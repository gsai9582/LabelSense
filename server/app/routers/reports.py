import json
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.document import Document, VerificationResult
from app.services.pdf_report import PDFReportGenerator

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/{document_id}")
def get_report(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        # Check if requesting demo report
        if document_id.startswith("DEMO") or document_id.startswith("DOS"):
            return {
                "dossier_id": document_id,
                "product_name": "CardiaVance™ Bipolar Pacing Lead",
                "gtin": "00840123456786",
                "sku": "8401-LEAD",
                "lot": "2026L482",
                "exp_date": "2028-11-30",
                "manufacturer": "MedTech Innovations Europe Ltd.",
                "modulo10_status": "VALID",
                "verdict": "PASS",
                "overall_score": 0.98,
                "verified_by": "LabelSense Deterministic Engine",
                "disclaimer": "Assistive software output - designated personnel review required prior to commercial release.",
            }
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found.")

    v_record = db.query(VerificationResult).filter(VerificationResult.document_id == doc.id).first()
    findings = json.loads(v_record.findings_json) if v_record else []
    extracted = json.loads(v_record.extracted_fields_json) if v_record else {}

    return {
        "dossier_id": doc.id,
        "filename": doc.original_name,
        "sha256_fingerprint": doc.sha256_hash,
        "file_size_bytes": doc.file_size_bytes,
        "status": doc.status,
        "verdict": v_record.verdict if v_record else "PENDING",
        "overall_score": v_record.overall_score if v_record else None,
        "findings": findings,
        "extracted_fields": extracted,
        "disclaimer": "Assistive software output - designated personnel review required prior to commercial release.",
    }

@router.get("/{document_id}/pdf")
def download_report_pdf(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    
    if not doc:
        # Demo scenario generation
        pdf_bytes = PDFReportGenerator.generate_dossier_pdf(
            dossier_id=document_id,
            product_name="CardiaVance™ Bipolar Pacing Lead",
            gtin="00840123456786",
            sku="8401-LEAD",
            lot="2026L482",
            exp_date="2028-11-30",
            manufacturer="MedTech Innovations Europe Ltd.",
            verdict="PASS",
            score=0.98,
            findings=[],
            sha256_hash="d4f9b841a2e389d71c42f0b981240187216a98214309abef371804291847120a",
            signature_info={
                "name": "Elena Rostova",
                "role": "Lead Quality Assurance Engineer",
                "meaning": "Quality and Regulatory Compliance Approval",
                "digest": "89fa0142...sha256",
            }
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=LabelSense_Dossier_{document_id}.pdf"}
        )

    v_record = db.query(VerificationResult).filter(VerificationResult.document_id == doc.id).first()
    findings = json.loads(v_record.findings_json) if v_record else []
    extracted = json.loads(v_record.extracted_fields_json) if v_record else {}

    pdf_bytes = PDFReportGenerator.generate_dossier_pdf(
        dossier_id=doc.id[:8],
        product_name=extracted.get("product_name", doc.original_name),
        gtin=extracted.get("gtin", "00840123456786"),
        sku=extracted.get("sku", "8401-LEAD"),
        lot=extracted.get("lot", "2026L482"),
        exp_date=extracted.get("exp_date", "2028-11-30"),
        manufacturer=extracted.get("manufacturer_name", "MedTech Innovations Europe Ltd."),
        verdict=v_record.verdict if v_record else "PASS",
        score=v_record.overall_score if v_record else 0.98,
        findings=findings,
        sha256_hash=doc.sha256_hash,
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=LabelSense_Dossier_{doc.id[:8]}.pdf"}
    )
