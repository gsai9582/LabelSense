import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["mode"] == "assistive-verification"

def test_api_login():
    res = client.post("/api/auth/login", json={
        "email": "elena.rostova@medtech-demo.internal",
        "password": "clinical_demo_password",
        "role": "QA Lead",
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "QA Lead"

def test_api_validate_pass():
    res = client.post("/api/validate", json={
        "gtin": "00840123456786",
        "exp_date": "2028-11-30",
        "lot": "2026L482",
        "sku": "8401-LEAD",
        "manufacturer_name": "MedTech Innovations Europe Ltd.",
        "device_class": "Class III",
    })
    assert res.status_code == 200
    data = res.json()
    assert data["verdict"] == "PASS"
    assert data["overall_score"] >= 0.90
    assert len(data["findings"]) == 0

def test_api_validate_critical_gtin():
    res = client.post("/api/validate", json={
        "gtin": "00840123456789", # Bad check digit
        "exp_date": "2028-11-30",
        "lot": "2026L482",
        "sku": "8401-LEAD",
        "manufacturer_name": "MedTech Innovations Europe Ltd.",
        "device_class": "Class III",
    })
    assert res.status_code == 200
    data = res.json()
    assert data["verdict"] == "CRITICAL"
    assert any(f["rule_id"] == "GS1-SPEC-SEC7.9" for f in data["findings"])

def test_api_compare():
    res = client.post("/api/compare", json={
        "baseline_gtin": "00840123456786",
        "candidate_gtin": "00840123456789",
        "baseline_exp": "2028-11-30",
        "candidate_exp": "2028-11-30",
    })
    assert res.status_code == 200
    data = res.json()
    assert data["risk_level"] == "HIGH"
    assert data["verdict"] == "CRITICAL"

def test_api_audit_verify():
    res = client.get("/api/audit/verify")
    assert res.status_code == 200
    data = res.json()
    assert data["is_valid"] is True

def test_api_download_pdf_report():
    res = client.get("/api/reports/DOS-2026-084/pdf")
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert len(res.content) > 1000
    assert res.content[:4] == b"%PDF"
