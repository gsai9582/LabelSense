import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True, index=True)
    sequence_number = Column(Integer, nullable=False, index=True)
    timestamp = Column(String(50), nullable=False)
    event_type = Column(String(50), nullable=False, index=True)
    actor = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False)
    action = Column(String(255), nullable=False)
    details = Column(Text, nullable=False)
    previous_hash = Column(String(64), nullable=False)
    current_hash = Column(String(64), nullable=False, index=True)
    system_verdict = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
