from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogCreate, AuditLogResponse, VerifyChainResponse
from app.services.audit_service import AuditService

router = APIRouter(prefix="/audit", tags=["Audit Trail"])

@router.get("", response_model=List[AuditLogResponse])
def get_audit_trail(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.sequence_number.asc()).all()
    return logs

@router.post("", response_model=AuditLogResponse)
def append_audit_log(entry: AuditLogCreate, db: Session = Depends(get_db)):
    log = AuditService.append_audit_event(
        db=db,
        event_type=entry.event_type,
        actor=entry.actor,
        role=entry.role,
        action=entry.action,
        details=entry.details,
        system_verdict=entry.system_verdict,
    )
    return log

@router.get("/verify", response_model=VerifyChainResponse)
def verify_audit_chain(db: Session = Depends(get_db)):
    result = AuditService.verify_chain(db)
    return VerifyChainResponse(
        is_valid=result["is_valid"],
        total_blocks=result["total_blocks"],
        verified_blocks=result["verified_blocks"],
        broken_at_id=result["broken_at_id"],
        details=result["details"],
    )
