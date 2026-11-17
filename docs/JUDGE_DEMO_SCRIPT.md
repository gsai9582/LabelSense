# LabelSense – CodeQuest 2026 Round 3 Judge Demo Script

**Project:** LabelSense – Assistive Medical Device Label Verification Platform  
**Participant:** Gowtham Sai Garnepudi (Vel Tech R&D Institute of Science and Technology)  
**Event:** CodeQuest 2026 National Tech Hackathon – Round 3 Final Showcase & Evaluation  
**Presentation Duration:** 5–7 Minutes  
**Demonstration Mode:** Live Full-Stack Application Walkthrough + Interactive Real-Time Verification  

---

## 1. Quick Reference & System Setup

- **One-Command Startup:**
  - **Windows (PowerShell):** `.\start.ps1`
  - **Linux / macOS (Bash):** `./start.sh`
- **Frontend Workspace:** `http://127.0.0.1:5173` (React 18 + TypeScript + Tailwind + Framer Motion)
- **Backend API & Swagger:** `http://127.0.0.1:8000/docs` (FastAPI + SQLAlchemy + PyMuPDF)
- **Automated Test Suites (65 Passing Tests):**
  - Frontend: `npm test` (25/25 passing in 140ms)
  - Backend: `pytest` (40/40 passing in 1.2s)
  - Clinical Evaluation Benchmark: `python -m app.eval` (18 ground truth labels: 100% recall, 100% precision)
- **Sample Demonstration Label Files:** Pre-staged in UI and available in `docs/sample_labels/`:
  - `Scenario_A_PASS_CardioFlow_Stent.pdf` (Class III, Valid GTIN `00840123456786`)
  - `Scenario_B_CRITICAL_NeuroCath_BadGTIN.pdf` (Class II, Bad Check Digit `00840123456789`)
  - `Scenario_C_REVIEW_OrthoSuture_ExpiryDrift.pdf` (Class II, Expired / Review Date `2024-05-31`)

---

## 2. Timed 6-Minute Live Walkthrough Script

```
┌────────────────────────────────────────────────────────────────────────┐
│ TOTAL TIME: 6 Minutes                                                  │
│                                                                        │
│ 00:00 - 00:45 | 1. Introduction, MedTech Problem & Regulatory Honesty  │
│ 00:45 - 01:45 | 2. Clinical Landing Page & Persona-Based Auth (JWT)    │
│ 01:45 - 03:15 | 3. Live PDF Upload, PyMuPDF Parsing & GS1 Modulo-10   │
│ 03:15 - 04:15 | 4. Redline Comparison & Downloadable PDF Dossier      │
│ 04:15 - 05:15 | 5. Cryptographic SHA-256 Audit Trail & Chain Verify    │
│ 05:15 - 06:00 | 6. Codebase Architecture, 52 Tests & Q&A Transition    │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Segment 1: Opening & MedTech Problem Statement (00:00 – 00:45)
- **What to Display:** Landing Page (`http://127.0.0.1:5173`). Note the clean Linear/Stripe-level clinical styling, single teal brand accent, and clear honesty disclosures.
- **Speaking Script:**
  > *"Good morning, respected judges. My name is Gowtham Sai Garnepudi, and I am presenting LabelSense for CodeQuest 2026 Round 3.*
  >
  > *Over 33% of all medical device recalls globally originate from packaging and labeling errors—such as corrupted GS1 check digits, missing sterile barrier symbols under EU MDR Annex I, or decimal shift mislabeling on cardiovascular implants.*
  >
  > *Our engineering objective with LabelSense is an assistive, deterministic verification platform that eliminates manual cross-check errors under ISO 13485 and FDA 21 CFR Part 820 design controls. As an upfront honesty principle: LabelSense is an assistive verification engine designed to empower human QA specialists—it does not claim autonomous certification."*

---

### Segment 2: Clinical Landing Page & Authenticated Personas (00:45 – 01:45)
- **What to Display:**
  1. Scroll through the Landing Page: show the **4-Step Verification Workflow**, **Standards Support (ISO 15223-1, GS1)**, and **Honest Regulatory FAQ**.
  2. Click **"Switch Role"** in the top navigation bar to open the **Access Authentication Modal**.
  3. Show the 3 authenticated personas:
     - **Dr. Aris Thorne (QA Lead)** – Authorized to sign off and execute validation.
     - **Elena Rostova (Reviewer)** – Regulatory affairs and clause analyst.
     - **Marcus Vance (Admin)** – Governance, audit integrity, and rule management.
  4. Select **Dr. Aris Thorne (QA Lead)** and click **"Authenticate & Proceed"**.
  5. Click **"Launch Workspace"**.

---

### Segment 3: Live PDF Ingestion, PyMuPDF Parsing & GS1 Modulo-10 (01:45 – 03:15)
- **What to Display:**
  1. Navigate to **Verify & Ingest** (`currentTab: validate`).
  2. In the Upload Dropzone, click **"Scenario A (PASS)"** under *"Or test with authentic sample labels"*.
  3. Explain that the browser sends the genuine vector PDF to the FastAPI backend (`POST /api/documents`).
  4. Show the extracted tokens in Step 2:
     - **Product:** CardioFlow Drug-Eluting Coronary Stent System
     - **SKU:** CFS-3018
     - **GTIN:** `00840123456786` (Confidence: 99%)
     - **LOT:** `LOT-2024-089A`
     - **EXP:** `2027-12-31`
     - **ISO Symbols:** STERILE EO, CE 0123, REF, LOT, Single-Use
  5. Click **"Run Multi-Layer Validation"**.
  6. Point out the **Green PASS verdict** banner, the token confidence bars, and the evidence region links pointing to the exact document coordinates.
  7. Now, click **"Upload Different File"** and select **"Scenario B (CRITICAL)"**:
     - Run validation: Watch the verdict immediately switch to a **Red CRITICAL Block (Score: 0.50)**!
     - Explain the mathematical finding: GTIN `00840123456789` check digit calculated is 6, but found 9. Explain that this is deterministic Modulo-10 mathematics—not probabilistic AI guesswork.

---

### Segment 4: Redline Comparison & Downloadable PDF Dossier (03:15 – 04:15)
- **What to Display:**
  1. Click **"Compare"** in the top navigation bar.
  2. Show the **Baseline Artwork (Approved ECO-2025-081)** vs **Revision Artwork (Current)**.
  3. Click **"Visual Delta Redline"** mode to show the interactive delta overlay highlighting modified bounding boxes.
  4. Navigate to **Release / Audit** or the Verification Results page and click **"Download PDF Verification Dossier"**.
  5. Open the downloaded PDF in the browser or PDF viewer:
     - Point out the formal MedTech header, product classification, rule findings table, SHA-256 fingerprint, and electronic signature block with timestamp.

---

### Segment 5: FIPS 180-4 SHA-256 Chained Audit Log (04:15 – 05:15)
- **What to Display:**
  1. Click **"Audit Trail"** (`currentTab: audit`).
  2. Show the filterable chronological audit log. Filter by verdict: **CRITICAL** to isolate Scenario B.
  3. Highlight the **Previous Hash** and **Current Hash** on each block showing sequential chaining.
  4. Click the **"Verify SHA-256 Chain"** button:
     - The backend validates the mathematical continuity of every block from genesis to tip.
     - A green banner confirms: *"Audit chain integrity verified. All 4 blocks cryptographically valid with zero tampering detected."*

---

### Segment 6: Codebase Architecture & 52 Automated Tests (05:15 – 06:00)
- **What to Display:**
  1. Switch to the terminal window showing the test results:
     - `npm test`: **25 / 25 Passing** (Node.js test runner)
     - `pytest`: **27 / 27 Passing** (Pytest suite)
  2. Show the code modularity:
     - `server/app/services/gs1_validator.py` (Modulo-10 mathematics)
     - `server/app/services/extractor.py` (PyMuPDF & Tesseract OCR pipeline)
     - `server/app/services/audit_service.py` (FIPS 180-4 SHA-256 chain)
     - `server/app/services/pdf_report.py` (Vector PDF dossier generator)
- **Concluding Script:**
  > *"In summary, LabelSense brings production-grade rigor to regulated labeling: 52 automated tests, deterministic mathematical validation, real PyMuPDF vector extraction, visual delta redlines, and cryptographically verified audit trails. Thank you, and I am excited to take your questions!"*

---

## 3. Anticipated Judge Questions & Technical Answers

#### Q1: "Why use deterministic Modulo-10 instead of an LLM or OCR prompt for GTIN checking?"
> *"Generative AI models are probabilistic next-token predictors. For clinical barcodes where a single misread digit can halt hospital supply distribution or cause surgical device misidentification, probabilistic confidence is unacceptable. GS1 General Specifications §7.9.1 defines an exact mathematical algorithm. We execute the pure algorithm in code, using AI/OCR only for initial optical character recognition."*

#### Q2: "How does your PyMuPDF extraction handle non-vector scanned artwork?"
> *"Our extraction service employs a dual-pipeline strategy: PyMuPDF first inspects the PDF for native vector text blocks and coordinate bounding boxes. If vector text is sparse or absent (e.g. flat scanned artwork or TIFF/PNG files), it falls back to Tesseract OCR with adaptive image thresholding and coordinate mapping."*

#### Q3: "How is the SHA-256 audit chain verified against tampering?"
> *"Each block computes its hash as `SHA256(previous_hash + timestamp + actor + action + payload_json)`. If a malicious actor alters a record in the database, its recalculated hash diverges from the recorded current hash, and the link to all downstream blocks immediately breaks. When an auditor clicks 'Verify SHA-256 Chain', the engine re-evaluates the entire chain sequentially and pinpoints any broken block index."*

#### Q4: "Can this system be deployed on-premise for high-security medical device manufacturers?"
> *"Yes. The entire stack—FastAPI, SQLite/MySQL, PyMuPDF, and React—runs entirely on-premise without sending proprietary CAD drawings, device specifications, or patient warnings to third-party public clouds."*
