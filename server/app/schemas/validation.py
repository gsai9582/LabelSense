from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class FindingItem(BaseModel):
    id: str
    field: str
    severity: str # CRITICAL, MAJOR, MINOR, INFO
    rule_id: str
    message: str
    evidence_value: Optional[str] = None
    confidence: float = 1.0

class ValidationRequest(BaseModel):
    gtin: str = Field(..., description="GS1 GTIN-8, GTIN-12, GTIN-13, or GTIN-14")
    exp_date: Optional[str] = Field(None, description="Expiration date in YYMMDD or YYYY-MM-DD")
    lot: Optional[str] = None
    sku: Optional[str] = None
    manufacturer_name: Optional[str] = None
    device_class: Optional[str] = "Class III"
    symbols: List[str] = []
    document_id: Optional[str] = None
    ai_confidence: Optional[float] = Field(None, description="Optional vision extraction confidence")
    ai_has_critical_shift: Optional[bool] = Field(None, description="Optional semantic drift flag from back-translation")

class ValidationResponse(BaseModel):
    verdict: str # PASS, REVIEW, CRITICAL
    overall_score: float # 0.0 to 1.0
    findings: List[FindingItem]
    verified_at: str
    sha256_digest: str
    breakdown: Dict[str, Any]
