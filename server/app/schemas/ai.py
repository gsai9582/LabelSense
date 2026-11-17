from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# 1. Vision Extraction
class VisionExtractionRequest(BaseModel):
    document_id: Optional[str] = None
    image_base64: Optional[str] = None
    force_ai: bool = False

class VisionExtractionResponse(BaseModel):
    product_name: str = ""
    sku: str = ""
    gtin: str = ""
    lot: str = ""
    exp_date: str = ""
    manufacturer_name: str = ""
    manufacturer_address: str = ""
    device_class: str = "Class II"
    symbols: List[str] = []
    confidence_scores: Dict[str, float] = {}
    evidence_regions: Dict[str, str] = {}
    is_gtin_checksum_valid: bool = False
    checksum_calculated: Optional[int] = None
    checksum_found: Optional[int] = None
    ai_provider: str = "mock"
    is_demo_mode: bool = True

# 2. Finding Explainer
class FindingExplanationRequest(BaseModel):
    finding_id: str
    rule_id: str
    evidence_text: str
    finding_details: str
    severity: str = "CRITICAL"

class FindingExplanationResponse(BaseModel):
    finding_id: str
    plain_summary: str
    clinical_impact: str
    regulatory_reference: str
    suggested_fix: str
    confidence: float = 0.95
    ai_provider: str = "mock"
    is_demo_mode: bool = True

# 3. Clause Search (RAG)
class ClauseSearchRequest(BaseModel):
    query: str
    limit: int = 4

# 4. Back-Translation Check
class FlaggedShift(BaseModel):
    category: str = Field(..., description="negation, numbers, units, or terminology")
    severity: str = "CRITICAL"
    description: str
    source_phrase: str
    translated_phrase: str

class BackTranslationRequest(BaseModel):
    source_text: str
    target_language: str
    target_text: str
    locked_terms: List[str] = []

class BackTranslationResponse(BaseModel):
    source_text: str
    target_text: str
    back_translation: str
    semantic_similarity: float
    has_critical_shift: bool
    flagged_shifts: List[FlaggedShift] = []
    deterministic_number_match: bool = True
    deterministic_unit_match: bool = True
    confidence: float = 0.95
    ai_provider: str = "mock"
    is_demo_mode: bool = True

# 5. Change Impact Summary
class ImpactSummaryRequest(BaseModel):
    ecn_id: str
    diff_text: str
    affected_nodes: List[Dict[str, Any]] = []

class ImpactSummaryResponse(BaseModel):
    ecn_id: str
    executive_brief: str
    affected_skus: List[str] = []
    affected_packaging_levels: List[str] = []
    target_markets: List[str] = []
    regulatory_filing_pathway: str
    mandatory_verification_protocols: List[str] = []
    confidence: float = 0.95
    ai_provider: str = "mock"
    is_demo_mode: bool = True

# 6. Ask LabelSense (Report Context Chat)
class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    report_id: Optional[str] = None
    report_context: Dict[str, Any]
    user_query: str
    conversation_history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str
    cited_finding_ids: List[str] = []
    is_report_grounded: bool = True
    ai_provider: str = "mock"
    is_demo_mode: bool = True

# 7. Human-in-the-Loop Reviewer Decision
class ReviewerDecisionRequest(BaseModel):
    feature_name: str
    item_id: str
    decision: str # "ACCEPT", "EDIT", "REJECT"
    reviewer_notes: Optional[str] = None
    edited_value: Optional[Dict[str, Any]] = None
