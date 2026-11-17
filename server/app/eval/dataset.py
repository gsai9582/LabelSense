"""
Evaluation Dataset: 18 curated ground-truth medical device label test cases.
Covers Class I, II, and III packaging across cardiovascular, orthopedic, neurology, and surgical devices.
"""
from typing import Dict, Any, List

EVAL_DATASET: List[Dict[str, Any]] = [
    # --- Category 1: Clean Compliant Labels (Expected PASS) ---
    {
        "id": "EVAL-01",
        "description": "CardioFlow Stent (Class III) - Valid GTIN-14, Valid Expiry",
        "raw_text": "CardioFlow Drug-Eluting Stent REF: CFS-3018 (01)00840123456786(17)271231(10)LOT-2024-089A VascuLife Technologies Inc. STERILE EO CE 0123",
        "ground_truth": {
            "sku": "CFS-3018",
            "gtin": "00840123456786",
            "lot": "LOT-2024-089A",
            "exp_date": "2027-12-31",
            "manufacturer_name": "VascuLife Technologies Inc.",
            "is_defective": False,
            "expected_verdict": "PASS",
        }
    },
    {
        "id": "EVAL-02",
        "description": "OrthoSpine Pedicle Screw (Class IIb) - Valid GTIN-13 (EAN-13)",
        "raw_text": "OrthoSpine Titanium Screw REF: OS-5545 (01)4012345678901(17)280630(10)LOT-5512B SpineMed AG STERILE R CE 0197",
        "ground_truth": {
            "sku": "OS-5545",
            "gtin": "4012345678901",
            "lot": "LOT-5512B",
            "exp_date": "2028-06-30",
            "manufacturer_name": "SpineMed AG",
            "is_defective": False,
            "expected_verdict": "PASS",
        }
    },
    {
        "id": "EVAL-03",
        "description": "VisiCath Angiographic Catheter (Class II) - Valid GTIN-12 (UPC-A)",
        "raw_text": "VisiCath Diagnostic 5F REF: VC-501 (01)012345678905(17)261130(10)LOT-VC-99 VisiMed USA Non-pyrogenic CE",
        "ground_truth": {
            "sku": "VC-501",
            "gtin": "012345678905",
            "lot": "LOT-VC-99",
            "exp_date": "2026-11-30",
            "manufacturer_name": "VisiMed USA",
            "is_defective": False,
            "expected_verdict": "PASS",
        }
    },
    {
        "id": "EVAL-04",
        "description": "DuraSuture Silk Suture (Class I) - Valid GTIN-8",
        "raw_text": "DuraSuture Braided 3-0 REF: DS-30 (01)40123455(17)290131(10)LOT-009 SutureCorp Ltd STERILE EO",
        "ground_truth": {
            "sku": "DS-30",
            "gtin": "40123455",
            "lot": "LOT-009",
            "exp_date": "2029-01-31",
            "manufacturer_name": "SutureCorp Ltd",
            "is_defective": False,
            "expected_verdict": "PASS",
        }
    },
    {
        "id": "EVAL-05",
        "description": "Electrode Lead CS400 (Class III) - Day 00 End-of-Month Convention",
        "raw_text": "CardiaVance Lead CS400 REF: 8401-LEAD (01)00840123456786(17)281200(10)LOT-L482 MedTech Europe STERILE EO CE 0123",
        "ground_truth": {
            "sku": "8401-LEAD",
            "gtin": "00840123456786",
            "lot": "LOT-L482",
            "exp_date": "2028-12-31",
            "manufacturer_name": "MedTech Europe",
            "is_defective": False,
            "expected_verdict": "PASS",
        }
    },
    {
        "id": "EVAL-06",
        "description": "NeuroShunt Valve Kit (Class III) - Valid Leap Year 2028-02-29",
        "raw_text": "NeuroShunt Valve Kit REF: NSV-10 (01)00840123456786(17)280229(10)LOT-9982 NeuroFlow Inc STERILE STEAM",
        "ground_truth": {
            "sku": "NSV-10",
            "gtin": "00840123456786",
            "lot": "LOT-9982",
            "exp_date": "2028-02-29",
            "manufacturer_name": "NeuroFlow Inc",
            "is_defective": False,
            "expected_verdict": "PASS",
        }
    },

    # --- Category 2: Corrupted GTIN Check Digit Defect (Expected CRITICAL) ---
    {
        "id": "EVAL-07",
        "description": "NeuroCath Infusion Guide - Corrupted Check Digit (9 instead of 6)",
        "raw_text": "NeuroCath Guide Wire REF: NC-014 (01)00840123456789(17)260630(10)LOT-X91 NeuroTech Ltd",
        "ground_truth": {
            "sku": "NC-014",
            "gtin": "00840123456789",
            "lot": "LOT-X91",
            "exp_date": "2026-06-30",
            "manufacturer_name": "NeuroTech Ltd",
            "is_defective": True,
            "expected_verdict": "CRITICAL",
            "defect_type": "CHECK_DIGIT_MISMATCH",
        }
    },
    {
        "id": "EVAL-08",
        "description": "CoroBalloon PTCA - Single Digit Transposition Check Mismatch",
        "raw_text": "CoroBalloon PTCA 2.5mm REF: CB-25 (01)00840123456780(17)270531(10)LOT-B11 BalloonMed Inc",
        "ground_truth": {
            "sku": "CB-25",
            "gtin": "00840123456780",
            "lot": "LOT-B11",
            "exp_date": "2027-05-31",
            "manufacturer_name": "BalloonMed Inc",
            "is_defective": True,
            "expected_verdict": "CRITICAL",
            "defect_type": "CHECK_DIGIT_MISMATCH",
        }
    },
    {
        "id": "EVAL-09",
        "description": "Pacemaker Battery Pouch - Truncated 11-digit GTIN Payload",
        "raw_text": "Lithium Cell Pouch REF: PAC-BAT (01)08401234567(17)280930(10)LOT-BAT1 Pacing Systems",
        "ground_truth": {
            "sku": "PAC-BAT",
            "gtin": "08401234567",
            "lot": "LOT-BAT1",
            "exp_date": "2028-09-30",
            "manufacturer_name": "Pacing Systems",
            "is_defective": True,
            "expected_verdict": "CRITICAL",
            "defect_type": "INVALID_LENGTH",
        }
    },
    {
        "id": "EVAL-10",
        "description": "Hemostatic Patch - Alpha Character in GTIN",
        "raw_text": "HemoStop Gel Pack REF: HG-10 (01)0084012345678A(17)261231(10)LOT-H8 HemoCare Inc",
        "ground_truth": {
            "sku": "HG-10",
            "gtin": "0084012345678A",
            "lot": "LOT-H8",
            "exp_date": "2026-12-31",
            "manufacturer_name": "HemoCare Inc",
            "is_defective": True,
            "expected_verdict": "CRITICAL",
            "defect_type": "NON_NUMERIC_GTIN",
        }
    },

    # --- Category 3: Date & Shelf-Life Defect (Expected REVIEW / CRITICAL) ---
    {
        "id": "EVAL-11",
        "description": "OrthoSuture Antibacterial - Expired in 2024-05-31",
        "raw_text": "OrthoSuture Braided Polyglactin REF: OS-20-T (01)00840123456786(17)240531(10)LOT-090B SutureTech",
        "ground_truth": {
            "sku": "OS-20-T",
            "gtin": "00840123456786",
            "lot": "LOT-090B",
            "exp_date": "2024-05-31",
            "manufacturer_name": "SutureTech",
            "is_defective": True,
            "expected_verdict": "CRITICAL",
            "defect_type": "EXPIRED_PRODUCT",
        }
    },
    {
        "id": "EVAL-12",
        "description": "Vascular Clamp - Invalid Non-Leap Year (2025-02-29)",
        "raw_text": "Vascular Titanium Clamp REF: VC-20 (01)00840123456786(17)250229(10)LOT-VC20 VascuTech",
        "ground_truth": {
            "sku": "VC-20",
            "gtin": "00840123456786",
            "lot": "LOT-VC20",
            "exp_date": "2025-02-29",
            "manufacturer_name": "VascuTech",
            "is_defective": True,
            "expected_verdict": "CRITICAL",
            "defect_type": "INVALID_LEAP_YEAR_DATE",
        }
    },
    {
        "id": "EVAL-13",
        "description": "Drainage Catheter - Exceeds 5-Year Master Envelope (8 years)",
        "raw_text": "Silicone Drainage 14Fr REF: SD-14 (01)00840123456786(17)341231(10)LOT-DR88 DrainMed Ltd",
        "ground_truth": {
            "sku": "SD-14",
            "gtin": "00840123456786",
            "lot": "LOT-DR88",
            "exp_date": "2034-12-31",
            "manufacturer_name": "DrainMed Ltd",
            "is_defective": True,
            "expected_verdict": "REVIEW",
            "defect_type": "SHELF_LIFE_DRIFT",
        }
    },

    # --- Category 4: Missing Mandatory Field Defect (Expected CRITICAL / REVIEW) ---
    {
        "id": "EVAL-14",
        "description": "Aspiration Syringe - Missing Mandatory LOT Number",
        "raw_text": "Aspiration Syringe 20ml REF: AS-20 (01)00840123456786(17)270831 SyringeWorks Corp",
        "ground_truth": {
            "sku": "AS-20",
            "gtin": "00840123456786",
            "lot": "",
            "exp_date": "2027-08-31",
            "manufacturer_name": "SyringeWorks Corp",
            "is_defective": True,
            "expected_verdict": "CRITICAL",
            "defect_type": "MISSING_MANDATORY_LOT",
        }
    },
    {
        "id": "EVAL-15",
        "description": "Surgical Blade #11 - Missing Legal Manufacturer Name",
        "raw_text": "Stainless Scalpel Blade No. 11 REF: SB-11 (01)00840123456786(17)280430(10)LOT-BL99 STERILE R",
        "ground_truth": {
            "sku": "SB-11",
            "gtin": "00840123456786",
            "lot": "LOT-BL99",
            "exp_date": "2028-04-30",
            "manufacturer_name": "",
            "is_defective": True,
            "expected_verdict": "REVIEW",
            "defect_type": "MISSING_MANUFACTURER",
        }
    },
    {
        "id": "EVAL-16",
        "description": "Implantable Sensor - Missing Expiration Date entirely",
        "raw_text": "Implantable Sensor CS-1 REF: CS-100 (01)00840123456786(10)LOT-SN84 BioSensor Inc",
        "ground_truth": {
            "sku": "CS-100",
            "gtin": "00840123456786",
            "lot": "LOT-SN84",
            "exp_date": "",
            "manufacturer_name": "BioSensor Inc",
            "is_defective": True,
            "expected_verdict": "CRITICAL",
            "defect_type": "MISSING_EXPIRATION_DATE",
        }
    },

    # --- Category 5: Localization & Semantic Shift Defect (Expected CRITICAL) ---
    {
        "id": "EVAL-17",
        "description": "Coronary Stent - Metric Decimal Shift 3.0 mm to 30 mm",
        "raw_text": "CardioFlow Stent 30 mm x 18 mm REF: CFS-3018 (01)00840123456786(17)271231(10)LOT-089A VascuLife",
        "baseline_text": "CardioFlow Stent 3.0 mm x 18 mm",
        "ground_truth": {
            "sku": "CFS-3018",
            "gtin": "00840123456786",
            "lot": "LOT-089A",
            "exp_date": "2027-12-31",
            "manufacturer_name": "VascuLife",
            "is_defective": True,
            "expected_verdict": "CRITICAL",
            "defect_type": "DECIMAL_SHIFT_DEFECT",
        }
    },
    {
        "id": "EVAL-18",
        "description": "Biopsy Needle - Critical Negation Inversion 'Reusable'",
        "raw_text": "Biopsy Needle 18G REF: BN-18 (01)00840123456786(17)261031(10)LOT-N44 NeedleTech Reusable device",
        "ground_truth": {
            "sku": "BN-18",
            "gtin": "00840123456786",
            "lot": "LOT-N44",
            "exp_date": "2026-10-31",
            "manufacturer_name": "NeedleTech",
            "is_defective": True,
            "expected_verdict": "CRITICAL",
            "defect_type": "SEMANTIC_NEGATION_INVERSION",
        }
    },
]
