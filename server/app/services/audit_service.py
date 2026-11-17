import hashlib
import json
import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.audit import AuditLog

class AuditService:
    GENESIS_HASH = "0" * 64

    @staticmethod
    def compute_sha256(data: str) -> str:
        """Computes genuine FIPS 180-4 SHA-256 cryptographic digest."""
        return hashlib.sha256(data.encode("utf-8")).hexdigest()

    @classmethod
    def compute_block_hash(
        cls,
        event_id: str,
        timestamp: str,
        event_type: str,
        actor: str,
        role: str,
        action: str,
        details: str,
        previous_hash: str,
        system_verdict: str,
    ) -> str:
        """
        Calculates canonical block digest by hashing ordered tuple with previous block hash.
        """
        canonical_str = f"{event_id}|{timestamp}|{event_type}|{actor}|{role}|{action}|{details}|{previous_hash}|{system_verdict}"
        return cls.compute_sha256(canonical_str)

    @classmethod
    def append_audit_event(
        cls,
        db: Session,
        event_type: str,
        actor: str,
        role: str,
        action: str,
        details: str,
        system_verdict: str = "PASS",
        custom_id: Optional[str] = None,
    ) -> AuditLog:
        """
        Appends a cryptographically chained audit event to the database.
        """
        last_log = db.query(AuditLog).order_by(AuditLog.sequence_number.desc()).first()

        next_seq = (last_log.sequence_number + 1) if last_log else 1
        previous_hash = last_log.current_hash if last_log else cls.GENESIS_HASH

        event_id = custom_id or f"AUD-{next_seq:04d}"
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"

        current_hash = cls.compute_block_hash(
            event_id=event_id,
            timestamp=timestamp,
            event_type=event_type,
            actor=actor,
            role=role,
            action=action,
            details=details,
            previous_hash=previous_hash,
            system_verdict=system_verdict,
        )

        log_entry = AuditLog(
            id=event_id,
            sequence_number=next_seq,
            timestamp=timestamp,
            event_type=event_type,
            actor=actor,
            role=role,
            action=action,
            details=details,
            previous_hash=previous_hash,
            current_hash=current_hash,
            system_verdict=system_verdict,
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry

    @classmethod
    def verify_chain(cls, db: Session) -> Dict[str, Any]:
        """
        Verifies the cryptographic integrity of the entire audit chain.
        Returns whether the chain is valid, total blocks checked, and identifies any broken link.
        """
        logs = db.query(AuditLog).order_by(AuditLog.sequence_number.asc()).all()
        if not logs:
            return {
                "is_valid": True,
                "total_blocks": 0,
                "verified_blocks": 0,
                "broken_at_id": None,
                "details": "Audit chain is empty. Genesis state intact.",
            }

        expected_prev_hash = cls.GENESIS_HASH
        verified_count = 0

        for idx, block in enumerate(logs):
            # Check 1: Previous hash link
            if block.previous_hash != expected_prev_hash:
                return {
                    "is_valid": False,
                    "total_blocks": len(logs),
                    "verified_blocks": verified_count,
                    "broken_at_id": block.id,
                    "details": (
                        f"Chain link broken at block {block.id} (seq {block.sequence_number}): "
                        f"Expected previous hash {expected_prev_hash[:16]}..., found {block.previous_hash[:16]}..."
                    ),
                }

            # Check 2: Current hash recalculation
            computed_current = cls.compute_block_hash(
                event_id=block.id,
                timestamp=block.timestamp,
                event_type=block.event_type,
                actor=block.actor,
                role=block.role,
                action=block.action,
                details=block.details,
                previous_hash=block.previous_hash,
                system_verdict=block.system_verdict,
            )

            if block.current_hash != computed_current:
                return {
                    "is_valid": False,
                    "total_blocks": len(logs),
                    "verified_blocks": verified_count,
                    "broken_at_id": block.id,
                    "details": (
                        f"Tamper detected in block {block.id} (seq {block.sequence_number}): "
                        f"Stored hash {block.current_hash[:16]}... differs from recomputed {computed_current[:16]}..."
                    ),
                }

            expected_prev_hash = block.current_hash
            verified_count += 1

        return {
            "is_valid": True,
            "total_blocks": len(logs),
            "verified_blocks": verified_count,
            "broken_at_id": None,
            "details": f"All {verified_count} audit blocks cryptographically verified with FIPS 180-4 SHA-256.",
        }
