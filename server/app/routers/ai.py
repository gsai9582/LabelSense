import json
import re
import hashlib
import time
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.ai.base import BaseLLMClient, LLMResponseMetadata
from app.ai.factory import get_llm_client
from app.ai.cache import ai_cache
from app.ai.limiter import ai_limiter
from app.ai.prompts import (
    UNTRUSTED_CONTENT_WRAPPER,
    SYSTEM_PROMPT_EXTRACTION,
    SYSTEM_PROMPT_EXPLAINER,
    SYSTEM_PROMPT_CLAUSE_RAG,
    SYSTEM_PROMPT_BACKTRANSLATION,
    SYSTEM_PROMPT_IMPACT_SUMMARY,
    SYSTEM_PROMPT_CHAT,
)
from app.schemas.ai import (
    VisionExtractionRequest,
    VisionExtractionResponse,
    FindingExplanationRequest,
    FindingExplanationResponse,
    ClauseSearchRequest,
    BackTranslationRequest,
    BackTranslationResponse,
    FlaggedShift,
    ImpactSummaryRequest,
    ImpactSummaryResponse,
    ChatRequest,
    ChatResponse,
    ReviewerDecisionRequest,
)
from app.services.clause_rag_service import ClauseRAGService, ClauseSearchResponse
from app.services.gs1_validator import GS1Validator
from app.services.audit_service import AuditService

router = APIRouter(prefix="/ai", tags=["AI Assistive Engine"])

def deterministic_compare_numbers_and_units(source: str, translation: str) -> tuple[bool, bool, List[FlaggedShift]]:
    """
    Deterministic safety guardrail: compares numbers and unit tokens via regex
    to guarantee zero probability of decimal shifts or inverted metrics escaping.
    """
    shifts: List[FlaggedShift] = []
    
    # Extract numbers
    src_nums = set(re.findall(r'\b\d+(?:\.\d+)?\b', source))
    trans_nums = set(re.findall(r'\b\d+(?:\.\d+)?\b', translation))
    
    number_match = True
    missing_in_trans = src_nums - trans_nums
    extra_in_trans = trans_nums - src_nums
    
    if missing_in_trans or extra_in_trans:
        number_match = False
        shifts.append(
            FlaggedShift(
                category="numbers",
                severity="CRITICAL",
                description=f"Deterministic number discrepancy: source contains {sorted(src_nums)}, while translation contains {sorted(trans_nums)}.",
                source_phrase=", ".join(sorted(missing_in_trans)) or "None",
                translated_phrase=", ".join(sorted(extra_in_trans)) or "None",
            )
        )
        
    # Extract units (case-insensitive)
    unit_pattern = r'\b(?:mm|cm|m|in|inch|inches|mg|g|kg|mcg|ml|l|°c|°f|c|f|kpa|bar|psi|fr|ch|gauge|g)\b'
    src_units = set(re.findall(unit_pattern, source, re.IGNORECASE))
    trans_units = set(re.findall(unit_pattern, translation, re.IGNORECASE))
    
    unit_match = True
    if src_units != trans_units:
        unit_match = False
        shifts.append(
            FlaggedShift(
                category="units",
                severity="CRITICAL",
                description=f"Deterministic unit of measure discrepancy: source units {sorted(src_units)} vs translation units {sorted(trans_units)}.",
                source_phrase=", ".join(sorted(src_units)) or "None",
                translated_phrase=", ".join(sorted(trans_units)) or "None",
            )
        )
        
    return number_match, unit_match, shifts

@router.get("/status")
def get_ai_status():
    """Return status and active provider configuration."""
    client = get_llm_client()
    return {
        "status": "available" if client.is_available else "unavailable",
        "provider": client.provider_name,
        "is_demo_mode": getattr(client, "is_available", True) and client.provider_name == "mock",
        "cached_entries": len(ai_cache._cache),
        "rate_limit_rpm": ai_limiter.limit,
    }

# 1. Vision Extraction
@router.post("/extract", response_model=VisionExtractionResponse)
async def ai_vision_extract(
    req: VisionExtractionRequest,
    db: Session = Depends(get_db),
):
    ai_limiter.check_rate_limit("ai_extract")
    client = get_llm_client()
    
    prompt = f"Extract packaging metadata from this medical device artwork ({req.document_id or ''}). Output valid JSON."
    if req.image_base64:
        ai_limiter.cap_input_size(req.image_base64, max_chars=1_000_000)
        import base64
        image_bytes = base64.b64decode(req.image_base64.split(",")[-1])
        result, meta = await client.vision_extract(
            image_bytes=image_bytes,
            mime_type="image/png",
            prompt=prompt,
            response_model=VisionExtractionResponse,
        )
    else:
        # Text/vector based prompt extraction
        result, meta = await client.generate_json(
            prompt=prompt,
            response_model=VisionExtractionResponse,
            system_instruction=SYSTEM_PROMPT_EXTRACTION,
        )

    # CRITICAL RULE: GTIN is ALWAYS re-verified deterministically by Modulo-10 code!
    raw_gtin = result.gtin.strip()
    gtin_eval = GS1Validator.validate_gtin(raw_gtin) if raw_gtin else {"is_valid": False}
    
    result.is_gtin_checksum_valid = gtin_eval.get("is_valid", False)
    result.checksum_calculated = gtin_eval.get("calculated_check_digit")
    result.checksum_found = gtin_eval.get("provided_check_digit")
    result.ai_provider = meta.provider
    result.is_demo_mode = meta.is_demo_mode

    # Log to audit trail
    AuditService.append_audit_event(
        db=db,
        event_type="AI_VISION_EXTRACTION",
        actor="LabelSense Vision AI",
        role="Assistive-AI",
        action=f"AI Extraction on {req.document_id or 'Raw Image'}",
        details=f"Provider: {meta.provider}, Latency: {meta.latency_ms}ms, GTIN Valid: {result.is_gtin_checksum_valid}",
        system_verdict="PASS" if result.is_gtin_checksum_valid else "FAIL",
    )

    return result

# 2. Finding Explainer
@router.post("/explain", response_model=FindingExplanationResponse)
async def ai_explain_finding(
    req: FindingExplanationRequest,
    db: Session = Depends(get_db),
):
    ai_limiter.check_rate_limit("ai_explain")
    ai_limiter.cap_input_size(req.evidence_text)
    
    client = get_llm_client()
    prompt = f"""Finding ID: {req.finding_id}
Rule Fired: {req.rule_id}
Severity: {req.severity}
Finding Details: {req.finding_details}

Evidence Text:
{UNTRUSTED_CONTENT_WRAPPER.format(content=req.evidence_text)}

Explain this finding in plain language, detailing patient safety impact and specific engineering fix."""

    # Check cache first
    cached = ai_cache.get(client.provider_name, "explainer", prompt)
    if cached:
        return cached

    result, meta = await client.generate_json(
        prompt=prompt,
        response_model=FindingExplanationResponse,
        system_instruction=SYSTEM_PROMPT_EXPLAINER,
    )
    result.finding_id = req.finding_id
    result.ai_provider = meta.provider
    result.is_demo_mode = meta.is_demo_mode

    ai_cache.set(client.provider_name, "explainer", prompt, result)

    AuditService.append_audit_event(
        db=db,
        event_type="AI_FINDING_EXPLANATION",
        actor="LabelSense Explain AI",
        role="Assistive-AI",
        action=f"Generated explanation for {req.finding_id}",
        details=f"Rule: {req.rule_id}, Latency: {meta.latency_ms}ms",
        system_verdict="PASS",
    )

    return result

@router.post("/explain/{finding_id}", response_model=FindingExplanationResponse)
async def ai_explain_finding_by_id(
    finding_id: str,
    req: FindingExplanationRequest,
    db: Session = Depends(get_db),
):
    req.finding_id = finding_id
    return await ai_explain_finding(req, db)

# 3. Clause Search (RAG)
@router.post("/clauses/search", response_model=ClauseSearchResponse)
async def ai_clause_search(
    req: ClauseSearchRequest,
    db: Session = Depends(get_db),
):
    ai_limiter.check_rate_limit("ai_clause_search")
    ai_limiter.cap_input_size(req.query, max_chars=1000)
    
    client = get_llm_client()
    return await ClauseRAGService.query_regulatory_rag(req.query, client)

# 4. Back-Translation Check
@router.post("/backtranslate", response_model=BackTranslationResponse)
async def ai_backtranslate_check(
    req: BackTranslationRequest,
    db: Session = Depends(get_db),
):
    ai_limiter.check_rate_limit("ai_backtranslate")
    ai_limiter.cap_input_size(req.source_text)
    ai_limiter.cap_input_size(req.target_text)

    client = get_llm_client()
    prompt = f"""Source English Text:
{req.source_text}

Target Language: {req.target_language}
Target Translation Text:
{UNTRUSTED_CONTENT_WRAPPER.format(content=req.target_text)}

Locked Terms to Preserve: {', '.join(req.locked_terms) if req.locked_terms else 'None'}

Perform back-translation to English and evaluate semantic drift."""

    result, meta = await client.generate_json(
        prompt=prompt,
        response_model=BackTranslationResponse,
        system_instruction=SYSTEM_PROMPT_BACKTRANSLATION,
    )
    result.source_text = req.source_text
    result.target_text = req.target_text
    result.ai_provider = meta.provider
    result.is_demo_mode = meta.is_demo_mode

    # Deterministic Number & Unit Guardrails
    num_match, unit_match, extra_shifts = deterministic_compare_numbers_and_units(
        source=req.source_text,
        translation=result.back_translation,
    )
    
    result.deterministic_number_match = num_match
    result.deterministic_unit_match = unit_match
    if extra_shifts:
        result.flagged_shifts.extend(extra_shifts)
        result.has_critical_shift = True
        result.semantic_similarity = min(result.semantic_similarity, 0.40)

    AuditService.append_audit_event(
        db=db,
        event_type="AI_BACKTRANSLATION_AUDIT",
        actor="LabelSense Localization AI",
        role="Assistive-AI",
        action=f"Back-translation verification ({req.target_language})",
        details=f"Similarity: {result.semantic_similarity}, Critical Shift: {result.has_critical_shift}, Number Match: {num_match}",
        system_verdict="PASS" if not result.has_critical_shift else "FAIL",
    )

    return result

# 5. Change Impact Summary
@router.post("/impact-summary", response_model=ImpactSummaryResponse)
async def ai_impact_summary(
    req: ImpactSummaryRequest,
    db: Session = Depends(get_db),
):
    ai_limiter.check_rate_limit("ai_impact")
    ai_limiter.cap_input_size(req.diff_text)

    client = get_llm_client()
    prompt = f"""ECN ID: {req.ecn_id}

Real Text & Attribute Delta:
{UNTRUSTED_CONTENT_WRAPPER.format(content=req.diff_text)}

Affected Knowledge Graph Traversal Nodes:
{json.dumps(req.affected_nodes, indent=2)}

Generate an executive impact summary detailing affected packaging levels, markets, notification pathways, and test protocols."""

    result, meta = await client.generate_json(
        prompt=prompt,
        response_model=ImpactSummaryResponse,
        system_instruction=SYSTEM_PROMPT_IMPACT_SUMMARY,
    )
    result.ecn_id = req.ecn_id
    result.ai_provider = meta.provider
    result.is_demo_mode = meta.is_demo_mode

    AuditService.append_audit_event(
        db=db,
        event_type="AI_IMPACT_SUMMARY",
        actor="LabelSense Impact AI",
        role="Assistive-AI",
        action=f"Generated ECN Impact Brief for {req.ecn_id}",
        details=f"Affected SKUs: {len(result.affected_skus)}, Markets: {len(result.target_markets)}",
        system_verdict="PASS",
    )

    return result

# 6. Ask LabelSense (Report Context Chat)
@router.post("/chat", response_model=ChatResponse)
async def ai_chat(
    req: ChatRequest,
    db: Session = Depends(get_db),
):
    ai_limiter.check_rate_limit("ai_chat")
    ai_limiter.cap_input_size(req.user_query, max_chars=2000)

    # Check for prompt injection attempts or out-of-context requests
    lower_query = req.user_query.lower()
    out_of_bounds_keywords = [
        "ignore all previous",
        "system prompt",
        "who won the",
        "write python code",
        "recipe for",
        "weather in",
    ]
    for kw in out_of_bounds_keywords:
        if kw in lower_query:
            return ChatResponse(
                response="I am restricted to answering questions specifically regarding this packaging label verification report.",
                cited_finding_ids=[],
                is_report_grounded=False,
                ai_provider="mock",
                is_demo_mode=True,
            )

    client = get_llm_client()
    prompt = f"""Report Context Information:
{json.dumps(req.report_context, indent=2)}

User Question:
{req.user_query}

Answer the user question referencing only this report and cite finding IDs (e.g. [FINDING-GS1-01])."""

    text_resp, meta = await client.generate_text(
        prompt=prompt,
        system_instruction=SYSTEM_PROMPT_CHAT,
    )

    # Extract cited finding IDs from response
    cited_ids = list(set(re.findall(r'\[?(FINDING-[A-Z0-9\-]+)\]?', text_resp)))

    return ChatResponse(
        response=text_resp,
        cited_finding_ids=cited_ids,
        is_report_grounded=True,
        ai_provider=meta.provider,
        is_demo_mode=meta.is_demo_mode,
    )

# 7. Human-in-the-Loop Reviewer Decision (Accept / Edit / Reject)
@router.post("/decision")
def record_reviewer_decision(
    req: ReviewerDecisionRequest,
    db: Session = Depends(get_db),
):
    """
    Records a designated human reviewer's decision on an AI-assisted recommendation.
    Logged to the FIPS 180-4 SHA-256 chained audit trail.
    """
    decision_verdict = "PASS" if req.decision == "ACCEPT" else ("REVIEW" if req.decision == "EDIT" else "FAIL")
    
    audit_entry = AuditService.append_audit_event(
        db=db,
        event_type="HUMAN_IN_THE_LOOP_DECISION",
        actor="Dr. Aris Thorne (QA Lead)",
        role="QA Lead",
        action=f"Reviewer Decision: {req.decision} on {req.feature_name}",
        details=f"Item ID: {req.item_id}, Decision: {req.decision}, Reviewer Notes: {req.reviewer_notes or 'None'}, Edited: {bool(req.edited_value)}",
        system_verdict=decision_verdict,
    )

    return {
        "status": "success",
        "audit_block_id": audit_entry.id,
        "current_hash": audit_entry.current_hash,
        "decision": req.decision,
    }
