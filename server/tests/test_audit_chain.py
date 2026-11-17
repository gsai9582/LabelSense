import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.audit import AuditLog
from app.services.audit_service import AuditService

@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_audit_chain_sequential_linking(test_db):
    b1 = AuditService.append_audit_event(
        db=test_db,
        event_type="BOOT",
        actor="System",
        role="Admin",
        action="System Initialized",
        details="Genesis",
        system_verdict="PASS",
    )
    assert b1.previous_hash == "0" * 64

    b2 = AuditService.append_audit_event(
        db=test_db,
        event_type="INGEST",
        actor="User",
        role="Reviewer",
        action="Ingested Label",
        details="Doc 1",
        system_verdict="PASS",
    )
    assert b2.previous_hash == b1.current_hash

    # Verify chain passes
    verify_res = AuditService.verify_chain(test_db)
    assert verify_res["is_valid"] is True
    assert verify_res["total_blocks"] == 2

def test_audit_chain_tamper_detection_modified_payload(test_db):
    b1 = AuditService.append_audit_event(
        db=test_db,
        event_type="BOOT",
        actor="System",
        role="Admin",
        action="System Initialized",
        details="Genesis",
        system_verdict="PASS",
    )
    b2 = AuditService.append_audit_event(
        db=test_db,
        event_type="VALIDATION",
        actor="Engine",
        role="Service",
        action="Run",
        details="Compliant",
        system_verdict="PASS",
    )

    # Maliciously mutate block 2 action directly in database
    b2.action = "TAMPERED_ACTION_UNAUTHORIZED"
    test_db.commit()

    verify_res = AuditService.verify_chain(test_db)
    assert verify_res["is_valid"] is False
    assert verify_res["broken_at_id"] == b2.id
    assert "Tamper detected" in verify_res["details"]
