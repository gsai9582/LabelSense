# LabelSense – System Architecture & Visual Dataflows

**Project:** LabelSense – Self-Validating AI Labeling Platform  
**Target Event:** CodeQuest 2026 National Tech Hackathon – Round 3 Final Showcase  
**Author:** Gowtham Sai Garnepudi (Individual, Final Year B.Tech, Vel Tech University)  
**Document Purpose:** Architectural blueprints, Mermaid dataflows, component interactions, and deployment topology.  

---

## 1. High-Level System Architecture

The following diagram illustrates the relationship between implemented frontend components and the proposed Phase 2 enterprise backend services.

```mermaid
graph TD
    subgraph Client_Runtime ["LabelSense Frontend (Implemented in React 18 + TypeScript)"]
        UI_Header["Enterprise Header & Stepper"]
        M1["Module 1: SENSE<br/>Regulatory Radar & Semantic Clause Inspector"]
        M2["Module 2: IMPACT<br/>ECN Simulator & Knowledge Graph"]
        M3["Module 3: AUTHOR<br/>Template Slot Binder & Live Canvas"]
        M4["Module 4: VALIDATE<br/>GS1 Modulo-10, Schema & Dynamic Risk Engine"]
        M5["Module 5: AUDIT<br/>Why-Trace Directory & SHA-256 Hash Chain"]
        DOC_PIPE["Document Ingestion Pipeline<br/>Upload, Token Review & Report Export"]
    end

    subgraph Deterministic_Core ["Deterministic Verification Core (Implemented)"]
        GS1_ENG["GS1 Modulo-10 Calculator<br/>GTIN-8, 12, 13, 14 Length & Math Check"]
        DATE_ENG["GS1 Expiration Date Parser<br/>Leap-Year Math & Day '00' End-of-Month"]
        SCHEMA_ENG["Mandatory Regulatory Schema Engine<br/>FDA 21 CFR 801 / EU MDR Annex I §23.2"]
        HASH_ENG["FIPS 180-4 SHA-256 Chaining<br/>Block Hash & Tamper-Evident Verifier"]
    end

    subgraph Proposed_Backend ["Proposed Phase 2/3 Enterprise Services (Roadmap)"]
        FAST_API["Python FastAPI Gateway"]
        CV_SERVICE["OpenCV Homography & OCR Service"]
        VECTOR_DB["Regulatory Vector Database (Chroma / Pinecone)"]
        SQL_DB["GxP Audit Database (PostgreSQL / SQLite)"]
    end

    M1 --> UI_Header
    M2 --> UI_Header
    M3 --> UI_Header
    M4 --> UI_Header
    M5 --> UI_Header

    M4 --> GS1_ENG
    M4 --> DATE_ENG
    M4 --> SCHEMA_ENG
    M4 --> DOC_PIPE
    M5 --> HASH_ENG

    DOC_PIPE -.->|Proposed REST API| FAST_API
    FAST_API -.-> CV_SERVICE
    FAST_API -.-> VECTOR_DB
    FAST_API -.-> SQL_DB
```

---

## 2. Component Interaction Architecture

This diagram illustrates how data passes between the active workflow tabs, modals, and shared state in the React application.

```mermaid
graph LR
    subgraph Global_State ["Application State Store (src/App.tsx)"]
        ActiveTab["Active Tab: sense | impact | author | validate | audit"]
        ScenarioState["Active Scenario: A (Green) | B (Red) | C (Amber)"]
        ArtworkState["Current Artwork Specification (LabelArtwork)"]
        AuditState["Chained Audit Log Records (AuditEvent[])"]
        SigState["Electronic Signatures Store"]
    end

    subgraph Workflow_Components ["Workflow Modules"]
        S_Comp["SenseModule"]
        I_Comp["ImpactModule"]
        A_Comp["AuthorModule"]
        V_Comp["ValidateModule"]
        AU_Comp["AuditModule"]
    end

    subgraph Modals_Layer ["Enterprise Modals"]
        WhyTraceModal["Why-Trace™ Lineage Inspector"]
        ESignModal["21 CFR Part 11 Signature Simulator"]
        BenchModal["Accuracy Benchmark Dialog"]
    end

    ScenarioState -->|Sets Artwork| ArtworkState
    ArtworkState --> A_Comp
    ArtworkState --> V_Comp
    ArtworkState --> AU_Comp

    V_Comp -->|Trigger Review| ESignModal
    ESignModal -->|Append Signed Record| SigState
    SigState -->|Creates Chained Block| AuditState
    AuditState --> AU_Comp

    A_Comp -->|Inspect Element| WhyTraceModal
    AU_Comp -->|Inspect Element| WhyTraceModal
```

---

## 3. Document Processing Pipeline Workflow

This workflow represents the newly implemented interactive document ingestion pipeline in `src/components/validate/DocumentUploadProcessor.tsx`.

```mermaid
flowchart TD
    StartUpload(["User Uploads File (PNG, JPG, SVG, JSON, TXT, PDF)"]) --> ValidateFile{"Validate File Constraints"}
    
    ValidateFile -- "Size == 0 bytes" --> RejectEmpty["Reject: Empty file error"]
    ValidateFile -- "Size > 10 MB" --> RejectSize["Reject: File exceeds 10 MB"]
    ValidateFile -- "Unsupported Mime" --> RejectType["Reject: Unsupported format error"]
    
    ValidateFile -- "Valid File" --> RenderPreview["Generate Document Preview<br/>(FileReader / Image Object URL)"]
    
    RenderPreview --> ExtractTokens["Extract / Slot-Map Label Tokens<br/>(GTIN, LOT, EXP, REF, Manufacturer, Symbols)"]
    
    ExtractTokens --> ReviewUI["Present Review & Correction Interface<br/>(User can edit and verify extracted values)"]
    
    ReviewUI --> UserCorrects{"User Edits Fields?"}
    UserCorrects -- Yes --> UpdateState["Update Field State in Memory"]
    UserCorrects -- No --> TriggerValidation["Click: Run Multi-Layer Validation"]
    UpdateState --> TriggerValidation
    
    TriggerValidation --> ExecGS1["1. Deterministic GS1 Modulo-10 Parity Math"]
    TriggerValidation --> ExecDate["2. GS1 Expiry Date & Leap Year Validation"]
    TriggerValidation --> ExecSchema["3. Mandatory Regulatory Schema Check"]
    TriggerValidation --> ExecDiff["4. Baseline Artwork Discrepancy Diff"]
    
    ExecGS1 --> ComputeScore["Aggregate Findings & Calculate Dynamic Score (0.00 - 1.00)"]
    ExecDate --> ComputeScore
    ExecSchema --> ComputeScore
    ExecDiff --> ComputeScore
    
    ComputeScore --> ClassifyTier{"Evaluate Score & Critical Defects"}
    ClassifyTier -- "Score >= 0.98 & 0 Defects" --> GreenTier["GREEN TIER: Fast-Track QA e-Signature (<2h)"]
    ClassifyTier -- "0.85 <= Score < 0.98" --> AmberTier["AMBER TIER: Secondary RA Sign-Off (4-8h)"]
    ClassifyTier -- "Score < 0.85 or Critical Defect" --> RedTier["RED TIER: Hard Block Release (Quarantine)"]
    
    GreenTier --> GenReport["Generate Structured JSON / Markdown Validation Report"]
    AmberTier --> GenReport
    RedTier --> GenReport
    
    GenReport --> AppendAudit["Create Chained SHA-256 Audit Event in Audit Trail"]
    AppendAudit --> Finish(["Validation Complete & Export Ready"])
```

---

## 4. End-to-End Data Flow (Upstream to Downstream)

```mermaid
sequenceDiagram
    autonumber
    actor QA as QA / Packaging Engineer
    participant Sense as Module 1: Sense
    participant Impact as Module 2: Impact
    participant Author as Module 3: Author
    participant Validate as Module 4: Validate
    participant Audit as Module 5: Audit

    QA->>Sense: Review updated regulatory clause (e.g. EU MDR §23.2)
    Sense-->>QA: Extracted assertion rule (MDR-BARRIER-REQ)
    
    QA->>Impact: Trigger ECN (Shelf-life extension 24m -> 36m)
    Impact->>Impact: Traverse Label Digital Thread DAG (SKU -> Pack -> Markets -> Langs)
    Impact-->>QA: Impact Assessment & Auto-drafted ECO-2026-1042
    
    QA->>Author: Open packaging master template
    Author->>Author: Apply locked ISO 15223-1 symbols & Translation Memory
    Author-->>QA: Render revised SVG/HTML artwork
    
    QA->>Validate: Run 3-layer hybrid validation
    Validate->>Validate: Check GS1 Modulo-10 parity & mandatory schema
    Validate->>Validate: Compare dimensions & flag decimal shift (3.0mm vs 30mm)
    Validate-->>QA: Dynamic Score + Classified Defect Dossier
    
    QA->>Audit: Submit for release sign-off
    Audit->>Audit: Compute SHA-256 digest chained to previous block
    Audit-->>QA: Immutable audit event confirmed (0 Tampering verified)
```

---

## 5. Deployment Architecture (Current vs Proposed Production)

```mermaid
graph TD
    subgraph Current_Deployment ["Current Client Deployment (Verified in Round 3)"]
        Browser["Modern Web Browser (Chrome, Edge, Firefox)"]
        ViteBuild["Vite Optimized Static Bundle (HTML, CSS, JS)"]
        LocalEngine["In-Memory Web Crypto & Deterministic GS1 Engine"]
        
        Browser --> ViteBuild
        ViteBuild --> LocalEngine
    end

    subgraph Proposed_Production ["Proposed Production Enterprise Deployment (Phase 2 & 3)"]
        CDN["Cloudflare / AWS CloudFront Edge CDN"]
        AppServer["Containerized Frontend (Nginx in Docker)"]
        API_Gateway["API Gateway (FastAPI / Gunicorn)"]
        OCR_Worker["Asynchronous OCR Worker (Celery + Tesseract)"]
        DB_Cluster["PostgreSQL GxP Database (Read-Replicas + Audit Log)"]
        
        CDN --> AppServer
        AppServer --> API_Gateway
        API_Gateway --> OCR_Worker
        API_Gateway --> DB_Cluster
    end
```
