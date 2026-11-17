import difflib
from typing import Dict, Any, List
from app.services.gs1_validator import GS1Validator

class CompareService:
    @staticmethod
    def compare_labels(
        baseline_gtin: str,
        candidate_gtin: str,
        baseline_exp: str = None,
        candidate_exp: str = None,
        baseline_lot: str = None,
        candidate_lot: str = None,
        baseline_text: str = None,
        candidate_text: str = None,
    ) -> Dict[str, Any]:
        """
        Executes semantic and checksum differential comparison between baseline and candidate artwork.
        """
        diffs = []
        risk_level = "LOW"
        verdict = "PASS"

        # 1. Compare GTIN
        if baseline_gtin == candidate_gtin:
            diffs.append({
                "field": "UDI GTIN-14",
                "baseline": baseline_gtin,
                "candidate": candidate_gtin,
                "status": "UNCHANGED",
                "note": "Exact match across revisions.",
            })
        else:
            # Check candidate validity
            cand_val = GS1Validator.validate_gtin(candidate_gtin)
            if not cand_val["is_valid"]:
                diffs.append({
                    "field": "UDI GTIN-14",
                    "baseline": baseline_gtin,
                    "candidate": candidate_gtin,
                    "status": "CRITICAL_DIFF",
                    "note": f"Critical GTIN defect: {cand_val['message']}",
                })
                risk_level = "HIGH"
                verdict = "CRITICAL"
            else:
                diffs.append({
                    "field": "UDI GTIN-14",
                    "baseline": baseline_gtin,
                    "candidate": candidate_gtin,
                    "status": "MODIFIED",
                    "note": "GTIN changed; candidate check digit is mathematically valid.",
                })
                if risk_level != "HIGH":
                    risk_level = "MEDIUM"
                    verdict = "REVIEW"

        # 2. Compare Expiry Date
        if baseline_exp and candidate_exp:
            if baseline_exp == candidate_exp:
                diffs.append({
                    "field": "Expiry Date",
                    "baseline": baseline_exp,
                    "candidate": candidate_exp,
                    "status": "UNCHANGED",
                    "note": "Identical expiry date.",
                })
            else:
                date_val = GS1Validator.validate_gs1_date(candidate_exp)
                if not date_val["is_valid"] or date_val["is_expired"]:
                    diffs.append({
                        "field": "Expiry Date",
                        "baseline": baseline_exp,
                        "candidate": candidate_exp,
                        "status": "EXPIRY_DRIFT",
                        "note": f"Candidate expiry invalid or expired: {date_val['message']}",
                    })
                    risk_level = "HIGH"
                    verdict = "CRITICAL"
                elif date_val["days_remaining"] > 365 * 5:
                    diffs.append({
                        "field": "Expiry Date",
                        "baseline": baseline_exp,
                        "candidate": candidate_exp,
                        "status": "EXPIRY_DRIFT",
                        "note": "Candidate expiry extended beyond baseline stability limit.",
                    })
                    if risk_level != "HIGH":
                        risk_level = "MEDIUM"
                        verdict = "REVIEW"
                else:
                    diffs.append({
                        "field": "Expiry Date",
                        "baseline": baseline_exp,
                        "candidate": candidate_exp,
                        "status": "MODIFIED",
                        "note": "Standard revision extension within stability envelope.",
                    })

        # 3. Text similarity ratio via difflib
        similarity_ratio = 1.0
        if baseline_text and candidate_text:
            matcher = difflib.SequenceMatcher(None, baseline_text, candidate_text)
            similarity_ratio = round(matcher.ratio(), 3)

        return {
            "risk_level": risk_level,
            "verdict": verdict,
            "diffs": diffs,
            "text_similarity_ratio": similarity_ratio,
        }
