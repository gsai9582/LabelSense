import datetime
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.audit import AuditLog
from app.services.audit_service import AuditService
from app.services.gs1_validator import GS1Validator
from app.routers.auth import DEMO_USERS, hash_password

def seed_database():
    print("[Seed] Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Users
        print("[Seed] Seeding clinical demo personas...")
        for u_data in DEMO_USERS:
            existing = db.query(User).filter(User.email == u_data["email"]).first()
            if not existing:
                user = User(
                    id=u_data["id"],
                    email=u_data["email"],
                    full_name=u_data["full_name"],
                    role=u_data["role"],
                    department=u_data["department"],
                    hashed_password=hash_password(u_data["password"]),
                )
                db.add(user)
        db.commit()

        # 2. Seed Initial Cryptographic Audit Chain
        existing_logs = db.query(AuditLog).count()
        if existing_logs == 0:
            print("[Seed] Creating genesis audit block and initial verification runs...")
            
            # Genesis block
            AuditService.append_audit_event(
                db=db,
                event_type="SYSTEM_BOOT",
                actor="System Supervisor",
                role="Core Platform",
                action="LabelSense Verification Engine Genesis Block Initialized",
                details="Cryptographic engine initialized with FIPS 180-4 SHA-256 genesis block.",
                system_verdict="PASS",
                custom_id="AUD-0001",
            )

            # Seed Scenario 1: PASS
            eval_a = GS1Validator.evaluate_label(
                gtin="00840123456786",
                exp_date="2028-11-30",
                lot="2026L482",
                sku="8401-LEAD",
                manufacturer_name="MedTech Innovations Europe Ltd.",
                device_class="Class III",
            )
            AuditService.append_audit_event(
                db=db,
                event_type="VALIDATION_RUN",
                actor="Dr. Aris Vance",
                role="Reviewer",
                action="Evaluated Scenario A: Baseline Pacing Lead (Compliant)",
                details=f"GTIN: 00840123456786, Verdict: {eval_a['verdict']}, Score: {eval_a['overall_score']}",
                system_verdict=eval_a["verdict"],
                custom_id="AUD-0002",
            )

            # Seed Scenario 2: CRITICAL (Bad GTIN check digit)
            eval_b = GS1Validator.evaluate_label(
                gtin="00840123456789", # Bad check digit 9 instead of 6
                exp_date="2028-11-30",
                lot="2026L482",
                sku="8401-LEAD",
                manufacturer_name="MedTech Innovations Europe Ltd.",
                device_class="Class III",
            )
            AuditService.append_audit_event(
                db=db,
                event_type="VALIDATION_RUN",
                actor="Elena Rostova",
                role="QA Lead",
                action="Evaluated Scenario B: Checksum Defect Injected",
                details=f"GTIN: 00840123456789, Verdict: {eval_b['verdict']}, Score: {eval_b['overall_score']}. Quarantined for Modulo-10 mismatch.",
                system_verdict=eval_b["verdict"],
                custom_id="AUD-0003",
            )

            # Seed Scenario 3: REVIEW (Changed expiry drift)
            eval_c = GS1Validator.evaluate_label(
                gtin="00840123456786",
                exp_date="2034-12-31", # Exceeds 5-year stability envelope
                lot="2026L482",
                sku="8401-LEAD",
                manufacturer_name="MedTech Innovations Europe Ltd.",
                device_class="Class III",
            )
            AuditService.append_audit_event(
                db=db,
                event_type="VALIDATION_RUN",
                actor="Elena Rostova",
                role="QA Lead",
                action="Evaluated Scenario C: Expiry Extension Beyond Stability Limit",
                details=f"GTIN: 00840123456786, Verdict: {eval_c['verdict']}, Score: {eval_c['overall_score']}. Flagged for stability committee review.",
                system_verdict=eval_c["verdict"],
                custom_id="AUD-0004",
            )

        # 3. Verify Chain Integrity
        verification = AuditService.verify_chain(db)
        print(f"[Seed] Chain Integrity Check: {verification['details']}")

    finally:
        db.close()
    print("[Seed] Seed process completed successfully.")

if __name__ == "__main__":
    seed_database()
