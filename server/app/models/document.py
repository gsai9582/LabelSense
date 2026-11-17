import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    sha256_hash = Column(String(64), nullable=False, index=True)
    file_path = Column(String(500), nullable=False)
    status = Column(String(50), default="UPLOADED") # UPLOADED, EXTRACTING, EXTRACTED, VALIDATED, FAILED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    verification_results = relationship("VerificationResult", back_populates="document", cascade="all, delete-orphan")

class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(String(36), primary_key=True, index=True)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False, index=True)
    verdict = Column(String(20), nullable=False) # PASS, REVIEW, CRITICAL
    overall_score = Column(Float, nullable=False)
    findings_json = Column(Text, nullable=False) # JSON list of FindingItem
    extracted_fields_json = Column(Text, nullable=False) # JSON dictionary of extracted fields
    verified_at = Column(DateTime, default=datetime.datetime.utcnow)

    document = relationship("Document", back_populates="verification_results")
