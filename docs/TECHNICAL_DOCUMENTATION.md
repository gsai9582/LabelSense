# LabelSense – Comprehensive Technical Documentation

**Project Name:** LabelSense – Self-Validating AI Labeling Platform  
**System Version:** 1.0.0 (CodeQuest 2026 Round 3 Final Build)  
**Author / Participant:** Gowtham Sai Garnepudi (Individual, Final Year B.Tech, Vel Tech University)  
**Classification:** Enterprise MedTech Packaging Automation Software  
**Target Compliance Frameworks:** FDA 21 CFR Part 801, FDA 21 CFR Part 11, EU MDR 2017/745, ISO 15223-1, ISO 20417:2026, ISO 13485, GAMP 5 CSA  

---

## 1. Abstract

LabelSense is an enterprise-grade, self-validating labeling platform engineered to eliminate labeling defects and streamline regulatory change management in the medical device and life sciences industry. By replacing manual 14-step copy-paste workflows with a continuous **Label Digital Thread**, LabelSense establishes end-to-end traceability between upstream engineering change notices, regulatory statutory mandates, template-bound authoring, multi-layer deterministic and optical verification, and immutable cryptographic audit trails.

---

## 2. Introduction & Problem Definition

### 2.1 Problem Definition
Medical device labeling constitutes the primary interface between manufacturers, clinical practitioners, regulatory authorities, and patients. According to FDA recall databases, labeling non-conformances represent over 33% of medical device recalls globally. The root causes cluster around:
1. **Disconnected Systems of Record:** Product attributes reside in PLM (Siemens Teamcenter, PTC Windchill), bill of materials in ERP (SAP S/4HANA), clinical safety in QMS (TrackWise), and artwork in desktop graphic files.
2. **Dynamic Regulatory Landscape:** Global authorities issue frequent revisions (e.g. EU MDR Annex I Chapter III, FDA UDI §801.40, ISO 15223-1:2021). Missing an applicable clause across international packaging variants triggers critical audit non-conformances.
3. **Manual Redlining & Copy-Paste Fatigue:** Quality reviewers manually compare 600 DPI printed artwork against spreadsheet specifications under tight product launch deadlines.

---

## 3. Objectives & Scope

### 3.1 Objectives
- **Zero Generative Hallucination:** Ensure clinical warning blocks and regulatory symbols are assembled strictly from validated, approved libraries.
- **Deterministic Mathematical Verification:** Implement 100% exact GS1 Modulo-10 check digit math and format parsing.
- **Element-Level Lineage (Why-Trace™):** Ensure every text token, symbol, and barcode contains a verified audit link back to its regulatory requirement and engineering design record.
- **Risk-Based Routing:** Route artwork reviews to approvers based on computed risk tiers (GREEN, AMBER, RED).
- **Audit Integrity:** Chain all system actions using cryptographic SHA-256 digests.

### 3.2 Scope
- **Current Scope (Phase 1 / Round 3 Build):** Client-side React 18 + TypeScript web architecture executing genuine GS1 Modulo-10 algorithms, GTIN length validation, leap-year expiry parsing, mandatory schema checks, dynamic risk scoring, interactive document ingestion, and SHA-256 audit chaining.
- **Extended Scope (Phase 2 & 3 Roadmap):** Server-side Python FastAPI backend, OpenCV high-DPI raster alignment, neural translation memory embedding, and SQLite/PostgreSQL persistent GxP audit storage.

---

## 4. System Requirements

### 4.1 Functional Requirements (FR)
- **FR-01 (Regulatory Ingestion):** The system shall monitor regulatory updates across FDA, EU MDR, and ISO standards and extract structured assertion rules.
- **FR-02 (Impact Scoping):** The system shall traverse the Label Digital Thread DAG to identify all impacted SKUs, packaging levels, target markets, and language variants resulting from an ECN.
- **FR-03 (Template Slot Filling):** The system shall prohibit unverified free-text entry on clinical warning blocks and lock translations to approved translation memory.
- **FR-04 (GS1 UDI Validation):** The system shall parse composite UDI barcodes, calculate Modulo-10 check digits, and validate GTIN-8, GTIN-12, GTIN-13, and GTIN-14 formats.
- **FR-05 (Expiry Date Parsing):** The system shall validate expiration dates, resolve Day '00' to month-end, and enforce leap year rules.
- **FR-06 (Mandatory Schema Checking):** The system shall verify the presence of mandatory manufacturer details, symbols (MD, CE, REF, LOT, USE_BY, STERILE_BARRIER) based on device class.
- **FR-07 (Dynamic Risk Scoring):** The system shall compute a continuous validation score (0.00 – 1.00) and route to GREEN, AMBER, or RED tiers.
- **FR-08 (Document Ingestion):** The system shall support drag-and-drop label file upload (<10MB), token editing, and structured JSON report generation.
- **FR-09 (Cryptographic Audit Trail):** The system shall chain audit event blocks using standard SHA-256 digests and provide on-demand chain verification.

### 4.2 Non-Functional Requirements (NFR)
- **NFR-01 (Performance):** Deterministic validation execution shall complete in under 50 milliseconds in client runtime.
- **NFR-02 (Security & Privacy):** Uploaded files and label specifications shall be processed locally in memory without unencrypted transmission to third-party APIs.
- **NFR-03 (Reliability):** Zero external runtime dependencies for test execution; full test suite shall run in standard Node.js.
- **NFR-04 (Traceability):** Every audit event shall capture timestamp, actor, role, action, previous hash, and current hash.

---

## 5. Technology Stack

| Layer | Technologies Selected | Rationale & Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18.3 + TypeScript 5.6 | Enterprise component architecture with strict compile-time type safety. |
| **Build Tool & Bundler** | Vite 5.4 | Sub-second hot module replacement (HMR) and optimized rollup production bundles. |
| **Styling & Design System**| TailwindCSS 3.4 | GxP-tailored Slate/Navy color tokens, responsive utility grid, and high contrast legibility. |
| **Iconography** | Lucide React | High-clarity medical, barcode, and regulatory symbol representations. |
| **Testing Harness** | Node.js Native Test Runner (`node:test`) | Zero third-party dependency; TAP-compatible, ultra-fast test execution. |
| **Cryptography** | Web Crypto API + FIPS 180-4 Pure JS | Guaranteed 256-bit SHA-256 digest computation across browser and CLI environments. |
| **Future Backend Stack** | Python 3.11 + FastAPI + SQLAlchemy | High-throughput asynchronous REST microservice with OpenCV and PyMuPDF integration. |

---

## 6. Detailed Module Descriptions & Algorithms

### 6.1 GS1 Modulo-10 Check Digit Calculation Algorithm
The algorithm implemented in `src/utils/gs1Validator.ts` conforms to GS1 General Specifications Section 7.9.1:

$$\text{Payload} = d_1 d_2 \dots d_{n-1}$$

1. Starting from the rightmost digit of the payload (position 1 from right of payload, position 2 from right of complete barcode), alternating weights $w_i \in \{3, 1\}$ are assigned:
   $$\text{Sum} = \sum_{i=1}^{n-1} d_{n-i} \cdot (3 \text{ if } i \text{ is odd else } 1)$$
2. Check digit $C$ is computed as:
   $$R = \text{Sum} \pmod{10}$$
   $$C = \begin{cases} 0 & \text{if } R = 0 \\ 10 - R & \text{if } R \neq 0 \end{cases}$$
3. The actual check digit on the artwork is compared against $C$. If they do not match, the barcode is flagged with a critical defect.

### 6.2 Dynamic Risk Scoring & Tier Routing Formulation
The dynamic validation score $S$ starts at 1.00 (100%) and applies weighted deductions:

$$S = 1.00 - \Delta_{\text{GS1}} - \Delta_{\text{Schema}} - \Delta_{\text{Dimension}} - \Delta_{\text{Date}} - \Delta_{\text{Translation}}$$

- Check digit mismatch: $\Delta_{\text{GS1}} = 0.28$ (Critical Defect)
- Missing mandatory critical symbol: $\Delta_{\text{Schema}} = 0.12$ per symbol (Critical Defect)
- Critical dimension shift: $\Delta_{\text{Dimension}} = 0.25$ (Critical Defect)
- Invalid expiration date: $\Delta_{\text{Date}} = 0.15$
- Translation nuance inversion: $\Delta_{\text{Translation}} = 0.12$
- Minor storage variance: $\Delta = 0.08$

**Validation Tiers:**
- **GREEN TIER ($S \ge 0.98 \land \text{Critical Defects} = 0$):** Minor non-clinical layout updates. Fast-track single QA lead e-signature release ($< 2$ hours SLA).
- **AMBER TIER ($0.85 \le S < 0.98 \land \text{Critical Defects} = 0$):** Minor parameter or layout shift. Routed to Regulatory Affairs and Localization Specialist (4–8 hours SLA).
- **RED TIER ($S < 0.85 \lor \text{Critical Defects} \ge 1$):** Hard release block. Automatic quarantine requiring Regulatory Affairs Director, QA Lead, and Clinical Review Board sign-off.

### 6.3 Cryptographic Audit Trail Chaining
Every event block $B_k$ generates a cryptographic digest:

$$H_k = \text{SHA-256}\left(H_{k-1} \parallel \text{ID}_k \parallel T_k \parallel E_k \parallel A_k \parallel R_k \parallel \text{Action}_k \parallel \text{Details}_k \parallel V_k\right)$$

Where $H_0 = 0^{64}$ (genesis hash). Any modification to past records invalidates all subsequent block digests $H_m$ ($m \ge k$), detected immediately by `verifyAuditChain()`.

---

## 7. Recommended Backend & Persistent Data Architecture (FastAPI Blueprint)

For Phase 2/3 production deployment, the recommended backend architecture is structured as follows:

```
                    ┌─────────────────────────┐
                    │   React Frontend (UI)   │
                    └────────────┬────────────┘
                                 │ REST API (HTTPS / JSON)
                                 ▼
                    ┌─────────────────────────┐
                    │  FastAPI Backend Engine │
                    └──────┬───────────┬──────┘
                           │           │
            ┌──────────────▼─────┐   ┌─▼──────────────────┐
            │ OpenCV / PyMuPDF   │   │ SQLAlchemy ORM     │
            │ • High-DPI Redline │   │ • SQLite (Dev)     │
            │ • Homography Diff  │   │ • PostgreSQL (Prod)│
            └────────────────────┘   └────────────────────┘
```

### 7.1 Proposed Database Schema (SQLAlchemy Models)
- `labels`: ID, SKU, trade_name, revision, gtin, lot, exp_date, device_class, status, created_at.
- `validation_runs`: ID, label_id, overall_score, tier, gtin_valid, exp_valid, schema_valid, defect_count, report_json, executed_at.
- `defects`: ID, validation_id, defect_type, title, description, severity, expected_val, actual_val, reg_ref.
- `audit_events`: ID, timestamp, event_type, actor, role, action, details, previous_hash, current_hash, verdict.

---

## 8. Security, Data Privacy & Regulatory Compliance Notice

1. **Local Sandboxing:** The current application processes uploaded documents entirely within browser memory via HTML5 Canvas and local FileReader APIs, preventing sensitive packaging specs from leaving the enterprise boundary.
2. **21 CFR Part 11 Scope:** Client-side SHA-256 hash chaining establishes cryptographic event tamper detection. Institutional Part 11 certification additionally mandates validated identity management (Active Directory / OAuth2 SSO), role-based authorization, and physical/environmental data integrity controls.
