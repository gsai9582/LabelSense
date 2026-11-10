# LabelSense™: Self-Validating AI Labeling Platform
### Team: MarkRight | CodeQuest 2026 National Tech Hackathon (Round 2)

[![Compliance: FDA 21 CFR Part 11](https://img.shields.io/badge/Compliance-FDA%2021%20CFR%20Part%2011-06b6d4?style=flat-square)](https://www.fda.gov)
[![Standard: EU MDR 2017/745](https://img.shields.io/badge/Standard-EU%20MDR%202017%2F745-10b981?style=flat-square)](https://health.ec.europa.eu)
[![Standard: ISO 15223-1:2021](https://img.shields.io/badge/Standard-ISO%2015223--1%3A2021-8b5cf6?style=flat-square)](https://www.iso.org)
[![Quality: GAMP 5 CSA](https://img.shields.io/badge/Validation-GAMP%205%20CSA%20Cat%204-f59e0b?style=flat-square)](https://ispe.org)
[![Barcode: GS1 Modulo-10](https://img.shields.io/badge/Barcode-GS1%20UDI%20AIDC-3b82f6?style=flat-square)](https://www.gs1.org)

---

## Executive Summary & Problem Background

In medical device manufacturing, **labeling errors account for over 33% of all FDA and EU medical device recalls** (e.g. Class I coronary stent and implant recalls). When a single regulatory clause updates (e.g., EU MDR Annex I §23.2 sterile barrier symbol requirements, or ISO 20417:2026 legibility rules), life sciences manufacturers face an agonizing **14-step manual timeline taking 18 to 24 weeks** across siloed spreadsheets, translation agencies, and desktop artwork tools.

**LabelSense** by Team **MarkRight** transforms this high-risk manual workflow into a **self-validating 5-phase closed loop taking under 30 minutes** with:
1. **Zero Hallucination**: Strict slot-filling against locked PLM master data and ISO symbol libraries.
2. **Deterministic Verification**: Genuine GS1 Modulo-10 check-digit algorithms and sub-pixel OCR computer vision.
3. **Traceability**: Complete 21 CFR Part 11 electronic signatures with SHA-256 hash chaining and element-level "Why-Trace" inspection.

---

## 5 Core Workflow Modules

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   1. SENSE   │ ──> │  2. IMPACT   │ ──> │  3. AUTHOR   │ ──> │ 4. VALIDATE  │ ──> │ 5. RELEASE/LEARN │
│  Regulatory  │     │Label Digital │     │Template-Bound│     │3-Layer Hybrid│     │Why-Trace & 21 CFR│
│  Intel Agent │     │ Thread Graph │     │ GenAI Engine │     │ Verification │     │ Part 11 Audit    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────────┘
```

### 1. SENSE: Regulatory Intelligence Agent
- **Live Regulatory Radar**: Continuously monitors updates from **FDA (21 CFR Part 801)**, **EU MDR (2017/745 Annex I Ch III)**, **ISO 15223-1:2021**, **ISO 20417:2026**, and **IMDRF N52**.
- **Clause RAG Viewer**: Semantic retrieval of legal clauses with statutory interpretations and impact classifications (Class I, IIa, IIb, III, Implantable).
- **Automated Rule Extractor**: Parses regulatory prose into executable Abstract Syntax Tree (AST) assertions (e.g. `ASSERT symbol_exists("STERILE_BARRIER") AND aspect_ratio >= 1.55`).

### 2. IMPACT: Smart Change Impact Engine
- **Label Digital Thread Knowledge Graph**: Full interactive DAG mapping:
  `[Product SKU] ──> [Packaging Level] ──> [Target Market] ──> [Languages] ──> [Label Artwork IDs]`.
- **Engineering Change Notice (ECN) Simulator**:
  - Test scenarios: Shelf-life stability extension (24 to 36 months), Sterilization facility relocation (Site B), MRI conditional warning (ASTM F2503).
  - Deterministic graph traversal calculates impacted SKUs, affected country registrations, and 20+ language variants.
  - Auto-drafts **Engineering Change Order (ECO-2026-1042)** with auto-assigned GxP roles and due dates.

### 3. AUTHOR: Template-Bound GenAI Label Assistant
- **Anti-Hallucination Design**: Strict slot-filling engine using locked QA phrase blocks; prohibits free-text hallucination on critical clinical warnings.
- **ISO 15223-1 Vector Symbol Library**: Harmonized graphical symbol library with enforced standard aspect ratios (STERILE EO, REF, LOT, Consult IFU, Single Use, MD, CE 0123, Temperature Limits, Keep Dry, Sterile Barrier).
- **Multi-Language Translation Memory (TM)**: Side-by-side localization manager across English, German, French, Spanish, Japanese, and Telugu with locked clinical context tokens (`{{STERILE_EO}}`, `{{15_30_C}}`).
- **Interactive Packaging Artwork Canvas**: Live SVG/HTML medical packaging label renderer updating UDI 2D DataMatrix, REF, LOT, EXP, and manufacturer details with element-level inspection.

### 4. VALIDATE: Hybrid Self-Validating Engine (3-Layer Verification)
- **Layer 1: Deterministic Rules & GS1 UDI Checker**:
  - Genuine mathematical **GS1 Modulo-10 check digit verification** algorithm.
  - Validates Application Identifiers: `(01)` GTIN-14, `(17)` Expiry YYMMDD, `(10)` Batch/Lot, `(21)` Serial Number.
  - Mandatory Field Schema Check per device risk class (Manufacturer, Address, CE Mark, Symbols).
- **Layer 2: Computer Vision & OCR Auto-Redline**:
  - Sub-pixel alignment comparator with 4 modes: **Bounding Box Overlays**, **Pixel Diff**, **Split Wipe Slider**, and **Opacity Cross-Fade**.
  - Flags critical defects: Decimal shift (e.g. 3.0 mm -> 30 mm stent perforation risk), symbol aspect ratio distortion, quiet zone violations.
- **Layer 3: Neural Back-Translation & Terminology Drift**:
  - Bi-directional semantic verification flagging clinical nuance shifts (e.g., detecting semantic inversion of "Do not reuse" into "Reusable after washing").
- **Risk-Scored Human-In-The-Loop Routing**:
  - **GREEN TIER (≥ 0.98)**: Fast-track single QA e-signature.
  - **AMBER TIER (0.85 - 0.97)**: Routed to Regulatory Affairs + Localization Specialist.
  - **RED TIER (< 0.85 or hard GS1 fail)**: Automatic hard block; requires RA + QA + Clinical Review Board.

### 5. RELEASE & LEARN: Smart Workflow & Immutable Audit Trail
- **Element-Level "Why-Trace" Inspector**: Clicking any element on the packaging artwork reveals its 4 pillars:
  1. *Source Product Spec (PLM/MES)*
  2. *Regulatory Mandate (ISO/MDR/FDA Citation)*
  3. *Verification Test Record (Confidence & Protocol)*
  4. *Approval Hash & ECO (21 CFR Part 11)*
- **FDA 21 CFR Part 11 Electronic Signature Simulator**: Full cryptographic signing modal with user role, meaning of signature, password verification, and SHA-256 digest chaining.
- **Regulatory Submission Packet Generator**: Generates comprehensive submission dossier summary exportable to PDF/print.

---

## Regulatory & Standards Conformance Matrix

| Standard / Regulation | Mandate Scope | LabelSense Implementation |
| :--- | :--- | :--- |
| **FDA 21 CFR Part 11** | Electronic Records & Signatures | Cryptographic SHA-256 hash chaining, manifest audits, non-repudiation role signatures. |
| **FDA 21 CFR Part 801** | General Device Labeling & UDI | Full AIDC DataMatrix simulation, HRI synchronization, and Modulo-10 check digit math. |
| **EU MDR 2017/745 Annex I** | General Safety & Performance Requirements | Chapter III §23.2 mandatory sterile barrier indicators, CE 0123 Notified Body, and MD symbol. |
| **ISO 15223-1:2021** | Medical Device Symbols | Vector SVG symbol library with enforced standard aspect ratios and category classifications. |
| **ISO 20417:2026** | Information Supplied by Manufacturer | Minimum optical legibility checks (> 1.2 mm font height) and e-IFU link indicators. |
| **GAMP 5 CSA** | Computer Software Assurance | Deterministic testing category 4 rules engine guaranteeing 0% hallucination on master data. |

---

## One-Click Judge Demo Scenarios

In the top header, judges can test pre-configured scenarios with one click:
- **Scenario A (Flawless Pass - Green Tier 0.99)**: Minor manufacturer address update on Cardiac Stent. Passes all 3 layers; fast-tracks single QA e-signature.
- **Scenario B (Critical Fail - Red Tier 0.72)**: Corrupted GS1 Modulo-10 check digit + missing Notified Body CE mark + distorted symbol aspect ratio + decimal shift defect (3.0 mm -> 30 mm). Triggers automatic hard block.
- **Scenario C (Amber Tier Review 0.91)**: Multi-language translation update with minor layout/storage temperature variance. Routed to RA and Localization Specialist.

---

## Quickstart & Installation

```bash
# 1. Clone the repository
git clone https://github.com/MarkRight/LabelSense.git
cd LabelSense

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

Open your browser at `http://localhost:5173` to interact with LabelSense.

To create an optimized production build:
```bash
npm run build
npm run preview
```

---

## Architectural Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (MedTech Slate/Navy Dark & Light Design Language)
- **Icons**: Lucide React
- **Graph & Visualizer**: Interactive HTML5 / Canvas & SVG Label Digital Thread Explorer
- **Barcode & UDI**: Mathematical GS1 Modulo-10 Check Digit Calculator & 2D DataMatrix Simulator
- **Verification Engine**: Sub-pixel Computer Vision Redline, Bounding Box Overlays, and Neural Back-Translation Comparator
- **Audit & Security**: Web Crypto SHA-256 Hash Chaining & 21 CFR Part 11 E-Signature Store

---

**Team MarkRight | CodeQuest 2026 National Tech Hackathon**  
*Empowering Safe, Self-Validating Medical Device Packaging Worldwide.*
