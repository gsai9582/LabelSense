from pydantic import BaseModel
from typing import Optional, List

class AuditLogCreate(BaseModel):
    event_type: str
    actor: str
    role: str
    action: str
    details: str
    system_verdict: str = "PASS"

class AuditLogResponse(BaseModel):
    id: str
    sequence_number: int
    timestamp: str
    event_type: str
    actor: str
    role: str
    action: str
    details: str
    previous_hash: str
    current_hash: str
    system_verdict: str

    model_config = {"from_attributes": True}

class VerifyChainResponse(BaseModel):
    is_valid: bool
    total_blocks: int
    verified_blocks: int
    broken_at_id: Optional[str] = None
    details: str
