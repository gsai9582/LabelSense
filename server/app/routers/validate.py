import datetime
import uuid
import json
import hashlib
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.document import VerificationResult, Document
from app.schemas.validation import ValidationRequest, ValidationResponse, FindingItem
from app.services.gs1_validator import GS1Validator
from app.services.audit_service import AuditService

router = APIRouter(prefix="/validate", tags=["Validation"])

@router.post("", response_model=ValidationResponse)
def validate_label(request: ValidationRequest, db: Session = Depends(get_db)):
    result = GS1Validator.evaluate_label(
        gtin=request.gtin,
        exp_date=request.exp_date,
        lot=request.lot,
        sku=request.sku,
        manufacturer_name=request.manufacturer_name,
        device_class=request.device_class or "Class III",
        symbols=request.symbols,
        ai_confidence=request.ai_confidence,
        ai_has_critical_shift=request.ai_has_critical_shift,
    )

    verified_at = datetime.datetime.utcnow().isoformat() + "Z"
    findings_list = [FindingItem(**f) for f in result["findings"]]

    # Canonical hash digest of validation output
    canonical_payload = json.dumps({
        "gtin": request.gtin,
        "exp_date": request.exp_date,
        "lot": request.lot,
        "verdict": result["verdict"],
        "score": result["overall_score"],
        "verified_at": verified_at,
    }, sort_keys=True)
    sha256_digest = hashlib.sha256(canonical_payload.encode("utf-8")).hexdigest()

    # If linked to a document in database, persist verification result
    if request.document_id:
        doc = db.query(Document).filter(Document.id == request.document_id).first()
        if doc:
            v_record = VerificationResult(
                id=str(uuid.uuid4()),
                document_id=doc.id,
                verdict=result["verdict"],
                overall_score=result["overall_score"],
                findings_json=json.dumps([f.dict() for f in findings_list]),
                extracted_fields_json=json.dumps(request.dict()),
            )
            db.add(v_record)
            doc.status = "VALIDATED"
            db.commit()

    # Append to Audit Trail
    AuditService.append_audit_event(
        db=db,
        event_type="VALIDATION_RUN",
        actor="LabelSense Deterministic Engine",
        role="Verification Service",
        action=f"Validation executed for GTIN {request.gtin}",
        details=f"Verdict: {result['verdict']}, Score: {result['overall_score']}, Findings: {len(findings_list)}",
        system_verdict=result["verdict"],
    )

    return ValidationResponse(
        verdict=result["verdict"],
        overall_score=result["overall_score"],
        findings=findings_list,
        verified_at=verified_at,
        sha256_digest=sha256_digest,
        breakdown=result["breakdown"],
    )
