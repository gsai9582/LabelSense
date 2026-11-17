# LabelSense – CodeQuest 2026 Round 3 Development Roadmap

**Project:** LabelSense – Self-Validating AI Labeling Platform  
**Participant:** Gowtham Sai Garnepudi (Individual, Final Year B.Tech, Vel Tech University)  
**Target Milestone:** CodeQuest 2026 National Tech Hackathon – Round 3 Final Showcase  
**Architecture Horizon:** Phase 1 (Completed Core) ➔ Phase 2 (Engine Scale) ➔ Phase 3 (Traceability & Enterprise Backend) ➔ Phase 4 (Deployment & Showcase)  

---

## Roadmap Overview

```
┌───────────────────────────┐      ┌───────────────────────────┐
│   PHASE 1: CORE ENGINE    │ ───> │  PHASE 2: RISK & REDLINE  │
│ • Deterministic GS1 Math  │      │ • Dynamic Multi-Layer Diff│
│ • GTIN Length Validation  │      │ • Field-Level Change Class│
│ • Schema & Date Checks    │      │ • OCR / CV Auto-Redline   │
│ [STATUS: COMPLETED]       │      │ [STATUS: READY FOR DEMO]  │
└───────────────────────────┘      └───────────────────────────┘
              │                                  │
              ▼                                  ▼
┌───────────────────────────┐      ┌───────────────────────────┐
│  PHASE 3: TRACEABILITY    │ ───> │ PHASE 4: PILOT BENCHMARK  │
│ • SHA-256 Hash Chaining   │      │ • 25 Automated Unit Tests │
│ • Tamper Verification     │      │ • Judge Demo Scenarios    │
│ • Document Ingestion Flow │      │ • Production Vite Build   │
│ [STATUS: COMPLETED]       │      │ [STATUS: VERIFIED GREEN]  │
└───────────────────────────┘      └───────────────────────────┘
```

---

## Phase 1: Core Functionality (Deterministic Verification)

### Task 1.1: GS1 Modulo-10 Check Digit Calculator
- **Priority:** CRITICAL (P0)
- **Description:** Implement genuine mathematical Modulo-10 check digit calculation conforming to GS1 General Specifications §7.9.1.
- **Expected Outcome:** Accurate calculation of check digits using alternating 3, 1 weights right-to-left.
- **Dependencies:** None.
- **Completion Criteria:** Mathematical match across GTIN-8, GTIN-12, GTIN-13, and GTIN-14, with edge-case tests.
- **Current Status:** **COMPLETED** (Implemented in `src/utils/gs1Validator.ts`; verified in unit tests).

### Task 1.2: GTIN Format & Length Enforcement
- **Priority:** CRITICAL (P0)
- **Description:** Restrict valid GTIN lengths strictly to 8, 12, 13, and 14 digits, rejecting non-standard lengths (7, 9, 10, 11, 15).
- **Expected Outcome:** Immediate flagging of invalid barcode payloads.
- **Dependencies:** Task 1.1.
- **Completion Criteria:** Rejection of non-standard lengths with informative error diagnostics.
- **Current Status:** **COMPLETED** (Implemented in `validateGTIN`).

### Task 1.3: GS1 Expiry Date Parser & Leap Year Engine
- **Priority:** HIGH (P1)
- **Description:** Parse GS1 YYMMDD dates, resolve Day '00' to month-end per standard, and enforce leap-year constraints (Feb 29 on 2024/2028 vs non-leap 2026).
- **Expected Outcome:** Strict calendar and format verification for expiration dates.
- **Dependencies:** None.
- **Completion Criteria:** Pass test suite for leap years, month boundaries, and Day '00' conversions.
- **Current Status:** **COMPLETED** (Implemented in `validateGS1ExpiryDate`).

### Task 1.4: Mandatory Label Schema Validator
- **Priority:** HIGH (P1)
- **Description:** Verify mandatory medical device labeling fields per EU MDR Annex I §23.2 and 21 CFR §801 (Manufacturer name, address, REF, LOT, EXP, MD symbol, CE mark, sterile barrier).
- **Expected Outcome:** Structured schema report with identified critical vs non-critical non-conformances.
- **Dependencies:** Task 1.2.
- **Completion Criteria:** Accurate reporting of missing symbols or entity details by device class.
- **Current Status:** **COMPLETED** (Implemented in `validateMandatoryLabelSchema`).

---

## Phase 2: Comparison & Risk Analysis

### Task 2.1: Dynamic Validation & Risk Scoring Engine
- **Priority:** CRITICAL (P0)
- **Description:** Replace hardcoded scenario scores with a dynamic evaluation algorithm that deducts points based on actual detected defects.
- **Expected Outcome:** Continuous score from 0.00 to 1.00 mapped to GREEN, AMBER, or RED tiers.
- **Dependencies:** Tasks 1.1 – 1.4.
- **Completion Criteria:** Score automatically drops upon check digit mismatch, dimension shift, or missing symbols.
- **Current Status:** **COMPLETED** (Implemented in `src/utils/validationEngine.ts`).

### Task 2.2: Field-Level Discrepancy Classification
- **Priority:** HIGH (P1)
- **Description:** Detect specific changes between approved baseline artwork and revised versions (e.g., dimensions 3.0 mm vs 30 mm, storage temperature 30°C vs 25°C).
- **Expected Outcome:** Clear categorization of defects by severity (CRITICAL, MAJOR, MINOR) with regulatory citations.
- **Dependencies:** Task 2.1.
- **Completion Criteria:** Display findings linked directly to affected fields in the UI.
- **Current Status:** **COMPLETED** (Integrated into `executeDynamicValidation` and `VisionRedline.tsx`).

### Task 2.3: Computer Vision Optical Redline (OpenCV Integration)
- **Priority:** MEDIUM (P2)
- **Description:** Integrate server-side OpenCV homography alignment for high-DPI raster and vector PDF diffing.
- **Expected Outcome:** Sub-pixel alignment heatmap highlighting unintended layout drift and font height shrinkage below 1.2 mm.
- **Dependencies:** FastAPI backend infrastructure.
- **Completion Criteria:** Automated alignment of scanned artwork against master SVG/PDF.
- **Current Status:** **PLANNED FOR BACKEND PHASE** (Interactive visual overlay demonstration currently active in frontend).

### Task 2.4: Neural Back-Translation Drift Detection
- **Priority:** MEDIUM (P2)
- **Description:** Bi-directional neural translation check across 20+ languages to catch semantic inversions or unit shifts (cm vs mm).
- **Expected Outcome:** Automated flagging of high clinical risk translations before artwork printing.
- **Dependencies:** Translation Memory API / LLM embedding engine.
- **Completion Criteria:** Automated detection of clinical nuance drift.
- **Current Status:** **PLANNED FOR BACKEND PHASE** (Demonstration Japanese anomaly active in `NeuralBackTranslation.tsx`).

---

## Phase 3: Reporting & Traceability

### Task 3.1: Cryptographic SHA-256 Hash Chaining
- **Priority:** HIGH (P1)
- **Description:** Implement verifiable SHA-256 hash chaining linking each event block to the previous block's digest.
- **Expected Outcome:** Immutable, tamper-evident audit record sequence.
- **Dependencies:** None.
- **Completion Criteria:** Standard FIPS 180-4 compliant digest calculation across all runtimes.
- **Current Status:** **COMPLETED** (Implemented in `src/utils/auditTrail.ts`).

### Task 3.2: Interactive Audit Chain Verification
- **Priority:** HIGH (P1)
- **Description:** Provide a one-click UI tool to recompute and verify the cryptographic chain from genesis to tip, detecting any payload mutation.
- **Expected Outcome:** Visual confirmation of chain integrity or identification of broken block index.
- **Dependencies:** Task 3.1.
- **Completion Criteria:** Unit tested and verified in `AuditTrailTimeline.tsx`.
- **Current Status:** **COMPLETED** (Active in UI with full test coverage).

### Task 3.3: Document Upload & Interactive Field Review Pipeline
- **Priority:** HIGH (P1)
- **Description:** Enable users to drag and drop label files, review extracted tokens, correct fields, run dynamic validation, and download reports.
- **Expected Outcome:** Working document ingestion workflow with client-side validation.
- **Dependencies:** Tasks 1.1, 2.1.
- **Completion Criteria:** File validation (<10MB), field editor, live validation execution, and JSON report export.
- **Current Status:** **COMPLETED** (Implemented in `DocumentUploadProcessor.tsx`).

### Task 3.4: Persistent Database Storage (FastAPI + SQLite/PostgreSQL)
- **Priority:** MEDIUM (P2)
- **Description:** Develop an optional Python FastAPI backend service with SQLAlchemy ORM and SQLite/PostgreSQL storage.
- **Expected Outcome:** Server-side persistence of audit events, change orders, and uploaded documents.
- **Dependencies:** Backend environment provisioning.
- **Completion Criteria:** REST API endpoints (`/api/v1/labels/validate`, `/api/v1/audit/events`).
- **Current Status:** **PLANNED ARCHITECTURE** (Full design documented in `TECHNICAL_DOCUMENTATION.md`).

---

## 4. Phase 4: Testing & Innovation Showcase Readiness

### Task 4.1: Automated Test Suite Development
- **Priority:** CRITICAL (P0)
- **Description:** Develop automated test cases covering normal, invalid, and boundary scenarios for GS1, audit, and scoring.
- **Expected Outcome:** 100% passing automated test suite with zero external test framework dependency.
- **Dependencies:** Phase 1 and Phase 2 utilities.
- **Completion Criteria:** 25 passing unit tests running via `npm test`.
- **Current Status:** **COMPLETED** (25/25 tests passing in 182ms).

### Task 4.2: Production Build & Asset Optimization
- **Priority:** HIGH (P1)
- **Description:** Run TypeScript compilation (`tsc`) and Vite production bundler to produce optimized minified assets.
- **Expected Outcome:** Zero compilation warnings or bundle errors.
- **Dependencies:** Project configuration.
- **Completion Criteria:** `dist/` directory generated cleanly in under 8 seconds.
- **Current Status:** **COMPLETED** (Vite v5.4 production build verified).

### Task 4.3: Professional Judge Demonstration Script & Scenarios
- **Priority:** HIGH (P1)
- **Description:** Create a structured 5–7 minute speaking script with timed transitions, fallback plans, and judge Q&A preparation.
- **Expected Outcome:** Professional hackathon presentation guide tailored for CodeQuest 2026 Round 3 evaluation.
- **Dependencies:** Completed application build.
- **Completion Criteria:** Script created in `docs/JUDGE_DEMO_SCRIPT.md`.
- **Current Status:** **COMPLETED**.
