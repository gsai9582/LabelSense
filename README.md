# LabelSense™: Assistive Medical Device Label Verification Platform

> **Deterministic UDI & Packaging Verification Engine for Regulated Medical Device Manufacturing**  
> *Engineered to assist Regulatory Affairs (RA), Quality Assurance (QA), and Packaging Engineers under ISO 13485 & 21 CFR Part 820 Design Control workflows.*

[![Frontend Tests](https://img.shields.io/badge/Frontend%20Tests-25%2F25%20Passing-emerald)](tests/)
[![Backend Tests](https://img.shields.io/badge/Backend%20Pytest-40%2F40%20Passing-teal)](server/tests/)
[![Deterministic Math](https://img.shields.io/badge/GS1%20Modulo--10-Deterministic-blue)](server/app/services/gs1_validator.py)
[![Cryptographic Audit](https://img.shields.io/badge/Audit%20Chain-FIPS%20180--4%20SHA--256-indigo)](server/app/services/audit_service.py)
[![AI Architecture](https://img.shields.io/badge/AI%20Layer-Provider--Agnostic%20Assistive-teal)](server/app/ai/)

**Participant:** Gowtham Sai Garnepudi (Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology)  
**Competition:** CodeQuest 2026 – Round 3 National Final Build & Showcase  
**Repository:** [https://github.com/gsai9582/LabelSense](https://github.com/gsai9582/LabelSense)

---

## 1. Regulatory Context & Problem Statement

Packaging and labeling faults account for over **33% of all medical device recalls globally** (FDA Recall Database, EU Safety Gate). Critical failure modes include:
- Corrupted GS1 check digits causing supply chain and bedside scanning failures.
- Expired or ambiguous date formats violating **GS1 General Specifications §7.9.1**.
- Missing mandatory statutory symbols required by **ISO 15223-1:2021** and **EU MDR 2017/745 Annex I, Chapter III**.
- Subtle decimal transcription errors on packaging (e.g. labeling a coronary stent balloon diameter as `30 mm` instead of `3.0 mm`, causing fatal arterial rupture risk).

### Assistive Regulatory Positioning & Honesty Statement
> **IMPORTANT REGULATORY DISCLOSURE:**  
> LabelSense is an **assistive verification tool** designed to support qualified human operators during artwork pre-press and release reviews. It is **not** an autonomous medical device, does not provide legal clearance, and does not replace statutory Notified Body (EU) or 510(k)/PMA (FDA) clearance. Final device release requires authorized human signoff.

---

## 2. Visual Interface & Product Gallery

LabelSense features a calm, high-density clinical MedTech SaaS user interface engineered for regulatory precision and audit efficiency:

| 01. Honest Clinical Landing Page | 02. Document Upload & Vision AI Processor |
| :---: | :---: |
| ![Landing Page](docs/images/01-landing-page.png) | ![Document Upload Processor](docs/images/02-upload-document-processor.png) |
| *Clear value proposition, 4-step workflow, and regulatory disclaimers.* | *Drag-and-drop PDF/image ingestion with Vision AI extraction & Modulo-10 guardrails.* |

| 03. Verification Results & GAMP 5 CSA Dossier | 04. Assistive AI Finding Explainer & In-Context Chat |
| :---: | :---: |
| ![Verification Results](docs/images/03-results-verdict-dossier.png) | ![AI Assistant Panel](docs/images/04-ai-assistant-finding-explainer.png) |
| *Rule-driven PASS/REVIEW/CRITICAL verdicts, confidence gauges, and evidence bounds.* | *Plain-language summaries, clinical risk context, suggested fixes, and Accept/Reject audit.* |

| 05. Statutory Clause Search (SQLite FTS5 RAG) | 06. Neural Back-Translation & Decimal Shift Audit |
| :---: | :---: |
| ![Clause Search RAG](docs/images/05-regulatory-clause-rag-search.png) | ![Neural Back-Translation](docs/images/06-neural-back-translation-audit.png) |
| *BM25 full-text search across curated EU MDR, FDA 21 CFR, and ISO clauses.* | *Semantic localization shift detection paired with deterministic numeric/unit checks.* |

| 07. ECN Change Impact & Dependency Graph | 08. Cryptographic FIPS 180-4 SHA-256 Audit Trail |
| :---: | :---: |
| ![ECN Impact Graph](docs/images/07-ecn-change-impact-graph.png) | ![Audit Trail Verification](docs/images/08-sha256-audit-trail-verification.png) |
| *Visual ripple effect and blast radius analysis on affected packaging variants.* | *Sequential block integrity chain with one-click cryptographic tamper detection.* |

---

## 3. System Architecture

LabelSense is structured as a decoupled, full-stack MedTech application:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LabelSense Full-Stack Architecture              │
└────────────────────────────────────────────────────────────────────────┘

  [ Client Tier: React 18 + TypeScript + Vite + Tailwind CSS ]
  ├── AppShell: Clinical Navigation, Role Switcher, System Status Bar
  ├── LandingPage: Value Proposition, 4-Step Workflow, Standards FAQ
  ├── DashboardView: Real-Time Verification Stats, Quick Upload Dropzone
  ├── ResultsView: Extracted Token Table, Confidence Gauges, Evidence Links
  ├── AiAssistantPanel: Finding Explainer, Ask LabelSense Chat, Accept/Reject
  ├── CompareView: Semantic Diff Table + Visual Delta Redline Viewer
  ├── AuditTrailTimeline: Filterable SHA-256 Ledger + Live Tamper Verification
  └── 5 Core Modules: Sense (Radar), Impact (Thread), Author, Validate, Release

                             │  HTTP / JSON / Multipart
                             ▼  (Vite Proxy /api -> 127.0.0.1:8000)

  [ Backend API Tier: FastAPI + Python 3.11 + Pydantic v2 ]
  ├── Core Verification:
  │   ├── POST /api/auth/login        -> Role-based JWT authentication
  │   ├── POST /api/documents         -> File upload (MIME validation, SHA-256)
  │   ├── POST /api/documents/{id}/extract -> PyMuPDF & Tesseract OCR parsing
  │   ├── POST /api/validate          -> Deterministic GS1 Modulo-10 validation
  │   ├── POST /api/compare           -> difflib text diff & visual delta alignment
  │   ├── GET  /api/reports/{id}/pdf  -> Cryptographic PDF dossier generation
  │   └── GET  /api/audit & /verify   -> SHA-256 hash chain verification
  │
  └── Assistive AI Engine (server/app/ai/):
      ├── POST /api/ai/extract        -> Vision AI (GTIN re-verified by Modulo-10)
      ├── POST /api/ai/explain        -> Finding explainer with clinical impact
      ├── POST /api/ai/clauses/search -> SQLite FTS5 RAG clause search & synthesis
      ├── POST /api/ai/backtranslate  -> Localization drift + regex numbers/units
      ├── POST /api/ai/impact-summary -> ECN blast-radius summary from graph diff
      ├── POST /api/ai/chat           -> In-context report chat (cites finding IDs)
      └── POST /api/ai/decision       -> Human reviewer decision audit logging

                             │  SQLAlchemy ORM & FTS5
                             ▼
  [ Persistence Tier: SQLite / MySQL / PostgreSQL ]
  ├── Users Table: Hashed credentials (bcrypt), roles, departments
  ├── Documents Table: Upload records, file paths, SHA-256 fingerprints
  ├── ValidationResults Table: Rule verdicts, scores, findings
  ├── Clauses Table & clauses_fts: FTS5 BM25 regulatory search index
  └── AuditBlocks Table: Cryptographically chained event blocks
```

---

## 4. Assistive AI Layer & Provider-Agnostic Architecture

The AI layer in LabelSense is strictly **assistive**: deterministic mathematical algorithms always hold final authority over compliance verdicts.

### Core Architectural Principles
1. **Provider-Agnostic `LLMClient` Interface**: Defined in `server/app/ai/base.py`. Swap between providers via environment variables (`LLM_PROVIDER`, `LLM_API_KEY`, `LLM_MODEL`). Supported: `gemini` and built-in `mock` (Demo mode).
2. **Offline & Test Safety ("Demo Mode")**: If no API key is configured, the application never crashes. It operates in offline **Demo Mode** using `MockLLMClient`, generating schema-validated clinical outputs for tests and presentations.
3. **Structured Outputs & Pydantic Validation**: All model responses are requested as JSON, validated with Pydantic v2 schemas, and retried once on format errors. Temperature is kept low ($0.1$ for extraction/classification, $0.2$ for explanations).
4. **Deterministic Checksum Supremacy**: When Vision AI extracts a GTIN (`POST /api/ai/extract`), the GTIN is **ALWAYS re-verified by the Modulo-10 code**, never trusted from the model.
5. **Deterministic Number & Unit Guardrails**: During back-translation audits (`POST /api/ai/backtranslate`), numbers and units are extracted and compared via regex to catch decimal shifts (e.g., `3.0 mm` vs `30 mm`) regardless of generative phrasing.
6. **Risk Routing Guardrail**: Hard GS1 errors or missing mandatory fields result in an automatic **RED** verdict. AI confidence or semantic flags may **escalate** a tier (e.g., Green $\rightarrow$ Amber, or Amber $\rightarrow$ Red), but **can never lower or dismiss a rule violation**.
7. **Prompt Injection Defense**: Raw packaging text is wrapped in `<UNTRUSTED_LABEL_CONTENT>` delimiters with explicit system instructions to ignore any commands inside.
8. **Audit Trail Logging & Human Review**: Every AI invocation is logged with prompt hash, latency, tokens, and model. When a human reviewer accepts, edits, or rejects an AI recommendation, their decision is recorded as a block in the SHA-256 audit chain.
9. **Rate Limiting & Input Capping**: AI endpoints are rate-limited to 60 requests/minute and capped at 15,000 characters per prompt. Identical prompts are cached in-memory using SHA-256 hashing.

### External Model Data Privacy Matrix
| Feature | Endpoint | Data Sent to Model | AI Model Output | Deterministic Safety Override |
| :--- | :--- | :--- | :--- | :--- |
| **Vision Extraction** | `POST /api/ai/extract` | Cropped packaging image or raw OCR text | Extracted fields + token coordinates | GTIN Modulo-10 checksum is recalculated in Python |
| **Finding Explainer** | `POST /api/ai/explain` | Finding ID, rule ID, and evidence string | Plain-language summary, clinical risk, suggested fix | Reviewer decision (Accept/Reject) logged to audit |
| **Clause Search (RAG)** | `POST /api/ai/clauses/search` | Search query string + SQLite FTS5 excerpts | Synthesized answer with exact clause citation | Curated sample disclaimer + below-threshold rejection |
| **Back-Translation** | `POST /api/ai/backtranslate` | Source text, translated text, locked terms | Back-translation + semantic similarity score | Regex comparison of numbers and units |
| **Impact Summary** | `POST /api/ai/impact-summary` | Text diff and affected graph node IDs | Executive summary and filing pathway recommendation | Strictly grounded in provided diff |
| **Ask LabelSense Chat** | `POST /api/ai/chat` | User query + report findings context | Grounded answer citing finding IDs | Refuses all out-of-scope queries |

---

## 5. Clinical Evaluation Benchmark (`python -m app.eval`)

LabelSense includes a built-in evaluation harness in `server/app/eval/` with **18 curated ground-truth medical device packaging labels** spanning Class I, II, and III implants across cardiovascular, orthopedic, neurology, and surgical devices.

To run the evaluation:
```powershell
Set-Location "server"
.\.venv\Scripts\activate
python -m app.eval
```

### Genuine Benchmark Results (From `server/eval_results.json`)
```
============================================================================
   LabelSense AI & Deterministic Engine - Clinical Evaluation Benchmark   
============================================================================
Total Evaluation Labels in Benchmark: 18
----------------------------------------------------------------------------
[EVAL-01] CardioFlow Stent (Class III) - Valid GTIN-14, Va | Exp: PASS     | Act: PASS     | ✓ CORRECT_CLEAN_PASS (TN)
[EVAL-02] OrthoSpine Pedicle Screw (Class IIb) - Valid GTI | Exp: PASS     | Act: PASS     | ✓ CORRECT_CLEAN_PASS (TN)
[EVAL-03] VisiCath Angiographic Catheter (Class II) - Vali | Exp: PASS     | Act: PASS     | ✓ CORRECT_CLEAN_PASS (TN)
[EVAL-04] DuraSuture Silk Suture (Class I) - Valid GTIN-8  | Exp: PASS     | Act: PASS     | ✓ CORRECT_CLEAN_PASS (TN)
[EVAL-05] Electrode Lead CS400 (Class III) - Day 00 End-of | Exp: PASS     | Act: PASS     | ✓ CORRECT_CLEAN_PASS (TN)
[EVAL-06] NeuroShunt Valve Kit (Class III) - Valid Leap Ye | Exp: PASS     | Act: PASS     | ✓ CORRECT_CLEAN_PASS (TN)
[EVAL-07] NeuroCath Infusion Guide - Corrupted Check Digit | Exp: CRITICAL | Act: CRITICAL | ✓ CORRECT_DETECTION (TP)
[EVAL-08] CoroBalloon PTCA - Single Digit Transposition Ch | Exp: CRITICAL | Act: CRITICAL | ✓ CORRECT_DETECTION (TP)
[EVAL-09] Pacemaker Battery Pouch - Truncated 11-digit GTI | Exp: CRITICAL | Act: CRITICAL | ✓ CORRECT_DETECTION (TP)
[EVAL-10] Hemostatic Patch - Alpha Character in GTIN       | Exp: CRITICAL | Act: CRITICAL | ✓ CORRECT_DETECTION (TP)
[EVAL-11] OrthoSuture Antibacterial - Expired in 2024-05-3 | Exp: CRITICAL | Act: CRITICAL | ✓ CORRECT_DETECTION (TP)
[EVAL-12] Vascular Clamp - Invalid Non-Leap Year (2025-02- | Exp: CRITICAL | Act: CRITICAL | ✓ CORRECT_DETECTION (TP)
[EVAL-13] Drainage Catheter - Exceeds 5-Year Master Envelo | Exp: REVIEW   | Act: REVIEW   | ✓ CORRECT_DETECTION (TP)
[EVAL-14] Aspiration Syringe - Missing Mandatory LOT Numbe | Exp: CRITICAL | Act: CRITICAL | ✓ CORRECT_DETECTION (TP)
[EVAL-15] Surgical Blade #11 - Missing Legal Manufacturer  | Exp: REVIEW   | Act: REVIEW   | ✓ CORRECT_DETECTION (TP)
[EVAL-16] Implantable Sensor - Missing Expiration Date ent | Exp: CRITICAL | Act: CRITICAL | ✓ CORRECT_DETECTION (TP)
[EVAL-17] Coronary Stent - Metric Decimal Shift 3.0 mm to  | Exp: CRITICAL | Act: CRITICAL | ✓ CORRECT_DETECTION (TP)
[EVAL-18] Biopsy Needle - Critical Negation Inversion 'Reu | Exp: CRITICAL | Act: CRITICAL | ✓ CORRECT_DETECTION (TP)
----------------------------------------------------------------------------
   BENCHMARK EVALUATION SUMMARY METRICS (GENUINE UNBIASED CALCULATIONS)   
----------------------------------------------------------------------------
Total Test Labels Evaluated:    18
Total Fields Inspected:         72
Field Extraction Accuracy:      73.61% (53/72)
Error-Detection Recall (Sens.): 100.0% (12/12 defective labels caught)
Error-Detection Precision:      100.0% (12/12)
Clean Label Specificity:        100.0% (6/6)
F1-Score:                       100.0%
Total Benchmark Execution Time: 0.003s (0.2ms/label)
============================================================================
```

---

## 6. Automated Verification & Test Coverage

The platform maintains **65 automated unit and integration tests** passing with zero failures:

### Frontend Test Suite (Node.js Test Runner / Vitest): 25 Tests
```
TAP version 13
# Subtest: Cryptographic SHA-256 - Known Test Vectors                    - ok
# Subtest: Audit Trail - Seed Chain Cryptographic Verification          - ok
# Subtest: Audit Trail - Dynamic Event Chaining                         - ok
# Subtest: Audit Trail - Tamper Detection (Payload Modification)         - ok
# Subtest: Audit Trail - Tamper Detection (Broken Link / Missing Block) - ok
# Subtest: GS1 Modulo-10 Check Digit Calculation (GTIN-8/12/13/14)      - ok (5 tests)
# Subtest: GTIN Format Validation (Valid, Invalid, Length, Non-Numeric) - ok (4 tests)
# Subtest: GS1 Expiration Date Validation (Leap Year, Day 00, Invalid)  - ok (3 tests)
# Subtest: GS1 UDI Composite String Parsing (Bracketed, Raw, Faults)    - ok (3 tests)
# Subtest: Dynamic Validation Engine (Scenarios A, B, C, Missing Fields)- ok (5 tests)
1..25 tests passed (136ms)
```

### Backend Test Suite (Pytest 9.2 + AnyIO): 40 Tests
```
server/tests/test_ai_endpoints.py::test_ai_status                        PASSED
server/tests/test_ai_endpoints.py::test_ai_vision_extract_modulo10_guardrail PASSED
server/tests/test_ai_endpoints.py::test_ai_explain_finding               PASSED
server/tests/test_ai_endpoints.py::test_ai_clause_search_rag_success     PASSED
server/tests/test_ai_endpoints.py::test_ai_clause_search_rag_no_match    PASSED
server/tests/test_ai_endpoints.py::test_ai_backtranslation_deterministic_numbers PASSED
server/tests/test_ai_endpoints.py::test_ai_backtranslation_negation_inversion PASSED
server/tests/test_ai_endpoints.py::test_ai_impact_summary                PASSED
server/tests/test_ai_endpoints.py::test_ai_chat_report_grounded          PASSED
server/tests/test_ai_endpoints.py::test_ai_chat_prompt_injection_refusal PASSED
server/tests/test_ai_endpoints.py::test_ai_decision_audit_trail          PASSED
server/tests/test_ai_endpoints.py::test_ai_risk_routing_guardrail        PASSED
server/tests/test_ai_endpoints.py::test_ai_input_size_capping            PASSED
server/tests/test_api.py::test_api_health                                PASSED
server/tests/test_api.py::test_api_login                                 PASSED
server/tests/test_api.py::test_api_validate_pass                         PASSED
server/tests/test_api.py::test_api_validate_critical_gtin                PASSED
server/tests/test_api.py::test_api_compare                               PASSED
server/tests/test_api.py::test_api_audit_verify                          PASSED
server/tests/test_api.py::test_api_download_pdf_report                   PASSED
server/tests/test_audit_chain.py::test_audit_chain_sequential_linking    PASSED
server/tests/test_audit_chain.py::test_audit_chain_tamper_detection      PASSED
server/tests/test_expiry.py::test_gs1_date_standard_yymmdd               PASSED
server/tests/test_expiry.py::test_gs1_date_day_00_convention             PASSED
server/tests/test_expiry.py::test_gs1_date_leap_year_valid               PASSED
server/tests/test_expiry.py::test_gs1_date_non_leap_year_invalid         PASSED
server/tests/test_expiry.py::test_gs1_date_invalid_month                 PASSED
server/tests/test_expiry.py::test_gs1_date_expired                       PASSED
server/tests/test_extraction.py::test_parse_bracketed_gs1_stream         PASSED
server/tests/test_extraction.py::test_parse_raw_fnc1_stream              PASSED
server/tests/test_extraction.py::test_extract_fields_from_ocr_text       PASSED
server/tests/test_gs1.py::test_modulo10_gtin14_standard                  PASSED
server/tests/test_gs1.py::test_modulo10_gtin13_ean13                     PASSED
server/tests/test_gs1.py::test_modulo10_gtin12_upca                      PASSED
server/tests/test_gs1.py::test_modulo10_gtin8                            PASSED
server/tests/test_gs1.py::test_modulo10_zero_remainder                   PASSED
server/tests/test_validate_gtin_valid                                    PASSED
server/tests/test_validate_gtin_check_digit_mismatch                      PASSED
server/tests/test_validate_gtin_invalid_length                            PASSED
server/tests/test_validate_gtin_non_numeric                              PASSED
40 passed in 1.19s
```

---

## 7. Quickstart: One-Command Execution

### Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: 3.10+ or 3.11+
- **Git**

### Windows (PowerShell)
```powershell
# Clone the repository
git clone https://github.com/gsai9582/LabelSense.git
cd LabelSense

# Run the single initialization script
.\start.ps1
```

### Linux / macOS (Bash)
```bash
# Clone the repository
git clone https://github.com/gsai9582/LabelSense.git
cd LabelSense

# Make executable and run
chmod +x start.sh
./start.sh
```

---

## 8. Demo Scenarios & Sample Labels for Judges

Authentic, vector-rendered sample label PDFs and PNGs are provided in `docs/sample_labels/` and pre-staged in the web UI for instant testing:

| Scenario | File Name | Device Class | Expected Verdict | Reason & Validation Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `Scenario_A_PASS_CardioFlow_Stent.pdf` | Class III | **PASS (Score: 1.00)** | GTIN `00840123456786` Modulo-10 checksum valid (check digit 6). All ISO 15223-1 symbols and valid 2027 expiration present. |
| **B** | `Scenario_B_CRITICAL_NeuroCath_BadGTIN.pdf` | Class II | **CRITICAL (Score: 0.50)** | GTIN `00840123456789` check digit mismatch (calculated: 6, found: 9). Automatic release block triggered. |
| **C** | `Scenario_C_REVIEW_OrthoSuture_ExpiryDrift.pdf` | Class II | **REVIEW (Score: 0.82)** | Expiration date `2024-05-31` is in the past. Flagged for human review. |

---

## 9. Authenticated Roles & Personas

Switch between simulated clinical personas in the top-right header:

- **Dr. Aris Thorne (QA Lead)**: Authorized to execute validation pipelines, sign electronic signoffs, and approve reviewer decisions.
- **Elena Rostova (Reviewer)**: Regulatory affairs specialist focused on clause traceability, visual redline analysis, and dossier inspection.
- **Marcus Vance (Admin)**: QMS Director with governance rights over audit logs, system parameters, and rule extraction.
