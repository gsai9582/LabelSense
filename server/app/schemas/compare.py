from pydantic import BaseModel
from typing import Optional, List

class DiffItem(BaseModel):
    field: str
    baseline: str
    candidate: str
    status: str # UNCHANGED, MODIFIED, EXPIRY_DRIFT, CRITICAL_DIFF
    note: Optional[str] = None

class CompareRequest(BaseModel):
    baseline_gtin: str
    candidate_gtin: str
    baseline_exp: Optional[str] = None
    candidate_exp: Optional[str] = None
    baseline_lot: Optional[str] = None
    candidate_lot: Optional[str] = None
    baseline_text: Optional[str] = None
    candidate_text: Optional[str] = None

class CompareResponse(BaseModel):
    risk_level: str # LOW, MEDIUM, HIGH
    verdict: str # PASS, REVIEW, CRITICAL
    diffs: List[DiffItem]
    text_similarity_ratio: float
