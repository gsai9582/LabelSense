import json
import time
import re
from typing import Type, TypeVar, Optional, Any, Dict
from pydantic import BaseModel

from app.ai.base import BaseLLMClient, LLMResponseMetadata

T = TypeVar("T", bound=BaseModel)

class MockLLMClient(BaseLLMClient):
    provider_name: str = "mock"
    is_available: bool = True

    def __init__(self, simulate_latency_ms: int = 15):
        self.simulate_latency_ms = simulate_latency_ms

    async def generate_json(
        self,
        prompt: str,
        response_model: Type[T],
        system_instruction: str = "",
        temperature: float = 0.1,
    ) -> tuple[T, LLMResponseMetadata]:
        start_time = time.time()
        
        # Test hook for error simulation
        if "TRIGGER_INVALID_JSON" in prompt:
            raise ValueError("LLM returned non-parsable malformed JSON payload.")
            
        model_name = response_model.__name__
        data = self._mock_data_for_model(model_name, prompt)
        
        parsed = response_model.model_validate(data)
        latency = int((time.time() - start_time) * 1000) + self.simulate_latency_ms
        
        meta = LLMResponseMetadata(
            provider="mock",
            model="mock-medtech-v1",
            latency_ms=latency,
            prompt_tokens=len(prompt) // 4,
            completion_tokens=len(json.dumps(data)) // 4,
            is_demo_mode=True,
        )
        return parsed, meta

    async def generate_text(
        self,
        prompt: str,
        system_instruction: str = "",
        temperature: float = 0.2,
    ) -> tuple[str, LLMResponseMetadata]:
        start_time = time.time()
        
        # Check for refusal conditions
        if "what is the capital of" in prompt.lower() or "write python code" in prompt.lower():
            text = "I am restricted to answering questions specifically regarding this packaging label verification report."
        elif "report context information:" in prompt.lower() or "ask labelsense" in system_instruction.lower():
            text = (
                "Based on this report, [FINDING-GS1-01] indicates that the GS1 GTIN-14 barcode check digit "
                "was calculated as 6, which conflicts with digit 9 on the artwork. "
                "Per GS1 General Specifications §7.9.1, this mismatch blocks automated bedside scanning."
            )
        elif "explain" in prompt.lower() or "finding details:" in prompt.lower():
            text = (
                "**Clinical & Regulatory Significance:**\n"
                "The identified GS1 Modulo-10 checksum failure indicates that the human-readable interpretation "
                "or DataMatrix carrier on this packaging pouch does not match the computed ISO/IEC 15418 specification. "
                "In clinical point-of-care environments, bedside barcode scanners will reject this item or register an unreadable fault, "
                "halting automated electronic health record (EHR) traceability and potentially delaying patient therapy.\n\n"
                "**Recommended Action:**\n"
                "Quarantine artwork batch Rev 2.1-DRAFT. Recalculate check digit using GS1 standard weights (3, 1 alternating). "
                "Update primary carton artwork and re-run pre-press verification before routing to QA Lead sign-off."
            )
        else:
            text = (
                "Based on the inspection report, the packaging label exhibits 1 critical defect regarding GS1 Modulo-10 parity "
                "and 1 review flag regarding expiration date proximity. All ISO 15223-1 symbols conform to Class III requirements."
            )
            
        latency = int((time.time() - start_time) * 1000) + self.simulate_latency_ms
        meta = LLMResponseMetadata(
            provider="mock",
            model="mock-medtech-v1",
            latency_ms=latency,
            prompt_tokens=len(prompt) // 4,
            completion_tokens=len(text) // 4,
            is_demo_mode=True,
        )
        return text, meta

    async def vision_extract(
        self,
        image_bytes: bytes,
        mime_type: str,
        prompt: str,
        response_model: Type[T],
    ) -> tuple[T, LLMResponseMetadata]:
        start_time = time.time()
        
        # Test hook for error simulation
        if "TRIGGER_INVALID_JSON" in prompt:
            raise ValueError("Vision model returned invalid structured JSON.")
            
        model_name = response_model.__name__
        data = self._mock_data_for_model(model_name, prompt)
        
        parsed = response_model.model_validate(data)
        latency = int((time.time() - start_time) * 1000) + self.simulate_latency_ms
        
        meta = LLMResponseMetadata(
            provider="mock",
            model="mock-vision-v1",
            latency_ms=latency,
            prompt_tokens=150,
            completion_tokens=len(json.dumps(data)) // 4,
            is_demo_mode=True,
        )
        return parsed, meta

    def _mock_data_for_model(self, model_name: str, prompt: str) -> Dict[str, Any]:
        """Generate structured schema-compliant data based on prompt context."""
        if "VisionExtractionResponse" in model_name or "Extract" in model_name:
            # Check if prompt contains critical scenario clues
            is_bad_gtin = "00840123456789" in prompt or "Scenario_B" in prompt
            gtin_val = "00840123456789" if is_bad_gtin else "00840123456786"
            return {
                "product_name": "CardioFlow Drug-Eluting Coronary Stent System",
                "sku": "CFS-3018",
                "gtin": gtin_val,
                "lot": "LOT-2024-089A",
                "exp_date": "2027-12-31",
                "manufacturer_name": "VascuLife Technologies Inc.",
                "manufacturer_address": "100 Medical Pkw, Irvine, CA 92618 USA",
                "device_class": "Class III",
                "symbols": ["STERILE_EO", "REF", "LOT", "USE_BY", "DO_NOT_REUSE", "CE_0123"],
                "confidence_scores": {
                    "product_name": 0.98,
                    "sku": 0.99,
                    "gtin": 0.99,
                    "lot": 0.97,
                    "exp_date": 0.96,
                    "manufacturer_name": 0.94,
                },
                "evidence_regions": {
                    "product_name": "Header Block [top: 64, left: 20]",
                    "sku": "Catalog Box [top: 78, left: 20]",
                    "gtin": "GS1 AI (01) HRI Box [top: 235, left: 28]",
                    "lot": "Batch AI (10) [top: 152, left: 20]",
                    "exp_date": "Expiry AI (17) [top: 168, left: 20]",
                    "manufacturer_name": "Legal Entity Block [top: 119, left: 20]",
                },
            }

        elif "FindingExplanationResponse" in model_name or "Explain" in model_name:
            return {
                "finding_id": "FINDING-GS1-01",
                "plain_summary": "The GS1 GTIN barcode check digit does not match the calculated Modulo-10 checksum.",
                "clinical_impact": "Hospital inventory and bedside clinical barcode scanners will fail to verify this implant, causing scan rejection at point-of-care and blocking electronic health record traceability.",
                "regulatory_reference": "GS1 General Specifications Section 7.9.1 & FDA 21 CFR §801.20",
                "suggested_fix": "Recalculate the 14th check digit using alternating weights (3, 1). Replace '9' with '6' on the primary blister artwork master.",
                "confidence": 0.96,
            }

        elif "BackTranslationResponse" in model_name or "Backtranslate" in model_name:
            # Check if this is the scenario with negation shift
            has_inversion = "reusable" in prompt.lower() or "single use" in prompt.lower()
            return {
                "source_text": "Do not re-use. Single use only.",
                "target_text": "再使用可能 (Reusable)",
                "back_translation": "Can be reused. Reusable device.",
                "semantic_similarity": 0.12 if has_inversion else 0.95,
                "has_critical_shift": True if has_inversion else False,
                "flagged_shifts": [
                    {
                        "category": "negation",
                        "severity": "CRITICAL",
                        "description": "Critical inversion of patient safety constraint: 'Do not re-use' back-translated as 'Can be reused'.",
                        "source_phrase": "Do not re-use",
                        "translated_phrase": "再使用可能",
                    }
                ] if has_inversion else [],
                "confidence": 0.97,
            }

        elif "ImpactSummaryResponse" in model_name or "Impact" in model_name:
            return {
                "ecn_id": "ECN-2026-S01",
                "executive_brief": "Shelf-life stability extension from 24 months to 36 months for CardiaVance CS400 leads impacts 14 packaging artwork files across 4 global markets.",
                "affected_skus": ["8401-LEAD", "8402-LEAD-XL", "8403-LEAD-PED"],
                "affected_packaging_levels": ["Primary Blister Pouch", "Secondary Carton Box", "Shipper Case"],
                "target_markets": ["US (FDA)", "EU (CE MDR)", "Japan (PMDA)", "Australia (TGA)"],
                "regulatory_filing_pathway": "EU MDR Article 71 Notification (Non-substantial design change supported by ISO 11607-1 accelerated aging data)",
                "mandatory_verification_protocols": [
                    "GS1 AI (17) YYMMDD expiration date calculation verification",
                    "Optical Redline baseline comparison against Rev 1.4 master",
                    "Translation memory integrity check across Japanese and German labeling",
                ],
                "confidence": 0.95,
            }

        elif "ClauseSearchResponse" in model_name or "Clause" in model_name:
            if "no matching" in prompt.lower() or "unknown_nonsense_term" in prompt.lower():
                return {
                    "query": prompt,
                    "matched_clauses": [],
                    "synthesized_answer": "No matching clause found in the curated regulatory dataset.",
                    "disclaimer": "Note: Regulatory clause dataset is a curated sample for assistive verification, not the full statutory legal text.",
                }
            return {
                "query": prompt,
                "matched_clauses": [
                    {
                        "clause_id": "EU-MDR-23.2-Q",
                        "source_name": "EU Medical Device Regulation (EU MDR 2017/745)",
                        "section": "Annex I, Chapter III, Section 23.2(q)",
                        "title": "Sterile Packaging Indication",
                        "excerpt": "Where the device is supplied sterile, the label shall indicate that the device is in a sterile condition and the method of sterilisation.",
                        "relevance_score": 0.94,
                    }
                ],
                "synthesized_answer": "Per EU MDR Annex I §23.2(q), medical devices supplied sterile must bear a clear indication of their sterile condition along with the specific method of sterilisation (such as the framed 'STERILE EO' symbol per ISO 15223-1 Ref 5.2.3).",
                "disclaimer": "Note: Regulatory clause dataset is a curated sample for assistive verification, not the full statutory legal text.",
            }

        elif "ChatResponse" in model_name:
            return {
                "response": "The report indicates [FINDING-GS1-01] has flagged GTIN check digit 9 as invalid. The calculated Modulo-10 checksum is 6.",
                "cited_finding_ids": ["FINDING-GS1-01"],
                "is_report_grounded": True,
            }

        # Fallback default
        return {"result": "success", "confidence": 0.90}
