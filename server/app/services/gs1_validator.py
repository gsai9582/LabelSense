import re
import datetime
from typing import Dict, Any, List, Optional, Tuple

class GS1Validator:
    """
    Deterministic GS1 Specification & Medical Device UDI Validator.
    Conforms to GS1 General Specifications Section 7.9 (Modulo-10 Check Digit Calculation)
    and ISO 15223-1 / EU MDR Annex I Chapter III medical device labeling standards.
    """

    @staticmethod
    def calculate_modulo10_check_digit(payload_digits: str) -> int:
        """
        Calculates the standard GS1 Modulo-10 check digit for a numeric payload.
        Weights alternate 3 and 1, starting with weight 3 for the digit immediately
        to the left of the check digit (rightmost payload digit), then moving leftward.
        """
        if not payload_digits.isdigit():
            raise ValueError(f"Payload must contain only numeric digits, received: '{payload_digits}'")

        reversed_digits = [int(c) for c in reversed(payload_digits)]
        weighted_sum = sum(
            digit * (3 if idx % 2 == 0 else 1)
            for idx, digit in enumerate(reversed_digits)
        )
        remainder = weighted_sum % 10
        return 0 if remainder == 0 else (10 - remainder)

    @classmethod
    def validate_gtin(cls, raw_gtin: str) -> Dict[str, Any]:
        """
        Validates GTIN-8, GTIN-12, GTIN-13, or GTIN-14 against GS1 Modulo-10 math.
        """
        cleaned = re.sub(r'[\s\-]', '', raw_gtin)

        if not cleaned:
            return {
                "is_valid": False,
                "error_code": "EMPTY_GTIN",
                "message": "GTIN value cannot be empty.",
            }

        if not cleaned.isdigit():
            return {
                "is_valid": False,
                "error_code": "NON_NUMERIC_GTIN",
                "message": f"GTIN must contain strictly numeric digits. Found: '{cleaned}'",
            }

        length = len(cleaned)
        if length not in (8, 12, 13, 14):
            return {
                "is_valid": False,
                "error_code": "INVALID_LENGTH",
                "message": f"Invalid GTIN length ({length} digits). Standard lengths are 8, 12, 13, or 14.",
            }

        payload = cleaned[:-1]
        provided_check_digit = int(cleaned[-1])
        calculated_check_digit = cls.calculate_modulo10_check_digit(payload)

        is_match = (provided_check_digit == calculated_check_digit)
        format_name = f"GTIN-{length}"

        if not is_match:
            return {
                "is_valid": False,
                "format": format_name,
                "error_code": "CHECK_DIGIT_MISMATCH",
                "calculated_check_digit": calculated_check_digit,
                "provided_check_digit": provided_check_digit,
                "message": (
                    f"Check digit mismatch on {format_name}: calculated check digit is {calculated_check_digit}, "
                    f"but label contains {provided_check_digit}. Barcode scanning will fail in hospital receiving."
                ),
            }

        return {
            "is_valid": True,
            "format": format_name,
            "calculated_check_digit": calculated_check_digit,
            "provided_check_digit": provided_check_digit,
            "clean_gtin": cleaned,
            "message": f"Valid {format_name} with verified Modulo-10 check digit ({calculated_check_digit}).",
        }

    @staticmethod
    def validate_gs1_date(date_str: str) -> Dict[str, Any]:
        """
        Validates GS1 AI (17) date format.
        Supports standard GS1 YYMMDD format and YYYY-MM-DD ISO 8601 strings.
        Handles GS1 day '00' meaning the last day of the indicated month.
        """
        cleaned = re.sub(r'[\s\-]', '', date_str)

        # Standard GS1 format: 6 digits (YYMMDD)
        if len(cleaned) == 6 and cleaned.isdigit():
            yy = int(cleaned[0:2])
            mm = int(cleaned[2:4])
            dd = int(cleaned[4:6])

            if mm < 1 or mm > 12:
                return {
                    "is_valid": False,
                    "error_code": "INVALID_MONTH",
                    "message": f"GS1 date month component must be 01-12. Found: {mm:02d}",
                }

            # Map 2-digit year (cutoff 50: 2000-2049 vs 1950-1999)
            current_century = 2000 if yy < 50 else 1900
            full_year = current_century + yy

            # GS1 day 00 convention: Last day of the month
            if dd == 0:
                if mm == 12:
                    last_day_date = datetime.date(full_year + 1, 1, 1) - datetime.timedelta(days=1)
                else:
                    last_day_date = datetime.date(full_year, mm + 1, 1) - datetime.timedelta(days=1)
                parsed_date = last_day_date
            else:
                try:
                    parsed_date = datetime.date(full_year, mm, dd)
                except ValueError as err:
                    return {
                        "is_valid": False,
                        "error_code": "INVALID_CALENDAR_DAY",
                        "message": f"Invalid calendar day for year {full_year}, month {mm}: {err}",
                    }
        else:
            # Try ISO standard format YYYY-MM-DD
            try:
                parsed_date = datetime.datetime.strptime(date_str.strip(), "%Y-%m-%d").date()
            except ValueError:
                return {
                    "is_valid": False,
                    "error_code": "UNRECOGNIZED_DATE_FORMAT",
                    "message": f"Unrecognized date format: '{date_str}'. Expected GS1 YYMMDD or ISO YYYY-MM-DD.",
                }

        today = datetime.date.today()
        is_expired = (parsed_date < today)
        days_remaining = (parsed_date - today).days

        return {
            "is_valid": True,
            "iso_date": parsed_date.isoformat(),
            "is_expired": is_expired,
            "days_remaining": days_remaining,
            "message": (
                f"Expired {abs(days_remaining)} days ago ({parsed_date})"
                if is_expired
                else f"Valid unexpired product ({days_remaining} days shelf-life remaining)"
            ),
        }

    @classmethod
    def evaluate_label(
        cls,
        gtin: str,
        exp_date: Optional[str] = None,
        lot: Optional[str] = None,
        sku: Optional[str] = None,
        manufacturer_name: Optional[str] = None,
        device_class: str = "Class III",
        symbols: Optional[List[str]] = None,
        ai_confidence: Optional[float] = None,
        ai_has_critical_shift: Optional[bool] = None,
    ) -> Dict[str, Any]:
        """
        Executes complete deterministic validation pipeline across GS1, shelf-life, and mandatory fields.
        """
        findings = []
        scores = []
        symbols = symbols or []

        # 1. GS1 GTIN Validation
        gtin_result = cls.validate_gtin(gtin)
        if not gtin_result["is_valid"]:
            findings.append({
                "id": "FND-GTIN-01",
                "field": "gtin",
                "severity": "CRITICAL",
                "rule_id": "GS1-SPEC-SEC7.9",
                "message": gtin_result["message"],
                "evidence_value": gtin,
                "confidence": 1.0,
            })
            scores.append(0.0)
        else:
            scores.append(1.0)

        # 2. Expiration Date Validation
        if exp_date:
            date_result = cls.validate_gs1_date(exp_date)
            if not date_result["is_valid"]:
                findings.append({
                    "id": "FND-DATE-01",
                    "field": "exp_date",
                    "severity": "CRITICAL",
                    "rule_id": "ISO-8601-EXP",
                    "message": date_result["message"],
                    "evidence_value": exp_date,
                    "confidence": 1.0,
                })
                scores.append(0.0)
            elif date_result["is_expired"]:
                findings.append({
                    "id": "FND-DATE-02",
                    "field": "exp_date",
                    "severity": "CRITICAL",
                    "rule_id": "MDR-ANNEX-I-CH3",
                    "message": f"Product expired on {date_result['iso_date']}. Immediate distribution block required.",
                    "evidence_value": exp_date,
                    "confidence": 1.0,
                })
                scores.append(0.2)
            elif date_result["days_remaining"] > (365 * 5):
                # Shelf-life drift: exceeds 5 years standard envelope for Class III
                findings.append({
                    "id": "FND-DATE-03",
                    "field": "exp_date",
                    "severity": "MAJOR",
                    "rule_id": "STABILITY-ENVELOPE-05Y",
                    "message": f"Shelf-life of {date_result['days_remaining']} days exceeds standard 5-year stability master envelope. Requires QA verification.",
                    "evidence_value": exp_date,
                    "confidence": 0.95,
                })
                scores.append(0.75)
            else:
                scores.append(1.0)
        else:
            findings.append({
                "id": "FND-DATE-00",
                "field": "exp_date",
                "severity": "CRITICAL" if device_class in ("Class III", "Implantable") else "MAJOR",
                "rule_id": "GS1-AI-17-MANDATORY",
                "message": "Mandatory expiration date is missing from labeling payload.",
                "confidence": 1.0,
            })
            scores.append(0.1)

        # 3. Mandatory Lot Number
        if not lot or not lot.strip():
            findings.append({
                "id": "FND-LOT-01",
                "field": "lot",
                "severity": "CRITICAL",
                "rule_id": "FDA-21CFR-801-LOT",
                "message": "Mandatory Production Identifier (LOT / Batch number) is missing.",
                "confidence": 1.0,
            })
            scores.append(0.2)
        else:
            scores.append(1.0)

        # 4. Mandatory Manufacturer
        if not manufacturer_name or not manufacturer_name.strip():
            findings.append({
                "id": "FND-MFG-01",
                "field": "manufacturer_name",
                "severity": "MAJOR",
                "rule_id": "ISO-15223-5.1.1",
                "message": "Legal manufacturer name is missing from labeling specification.",
                "confidence": 1.0,
            })
            scores.append(0.5)
        else:
            scores.append(1.0)

        # Calculate Baseline Overall Score from deterministic rules
        overall_score = round(sum(scores) / len(scores), 2) if scores else 0.0

        # Baseline Rule Verdict calculation
        has_critical = any(f["severity"] == "CRITICAL" for f in findings)
        has_major = any(f["severity"] == "MAJOR" for f in findings)

        if has_critical or overall_score < 0.60:
            verdict = "CRITICAL"
        elif has_major or overall_score < 0.90:
            verdict = "REVIEW"
        else:
            verdict = "PASS"

        # AI Risk Escalation Guardrail:
        # Rule: Any hard GS1 failure or missing mandatory field => RED regardless of AI.
        # AI may escalate a tier (e.g. PASS -> REVIEW, or REVIEW -> CRITICAL), but NEVER lower it!
        if ai_has_critical_shift:
            findings.append({
                "id": "FND-AI-SHIFT-01",
                "field": "translation_or_semantics",
                "severity": "CRITICAL",
                "rule_id": "AI-SEMANTIC-SAFETY-GUARDRAIL",
                "message": "AI localization analysis detected critical semantic meaning shift (e.g. negation reversal).",
                "confidence": 0.95,
            })
            verdict = "CRITICAL"
            overall_score = min(overall_score, 0.40)
        elif ai_confidence is not None and ai_confidence < 0.70:
            if verdict == "PASS":
                findings.append({
                    "id": "FND-AI-CONF-01",
                    "field": "vision_extraction",
                    "severity": "MAJOR",
                    "rule_id": "AI-CONFIDENCE-ESC-01",
                    "message": f"Low vision extraction confidence ({int(ai_confidence * 100)}%). Escalated to human QA review.",
                    "confidence": ai_confidence,
                })
                verdict = "REVIEW"
                overall_score = min(overall_score, 0.85)

        return {
            "verdict": verdict,
            "overall_score": overall_score,
            "findings": findings,
            "breakdown": {
                "gtin_valid": gtin_result["is_valid"],
                "total_findings": len(findings),
                "critical_findings": sum(1 for f in findings if f["severity"] == "CRITICAL"),
                "review_findings": sum(1 for f in findings if f["severity"] == "MAJOR"),
            }
        }
