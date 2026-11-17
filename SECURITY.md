# Security Policy — LabelSense™

LabelSense is committed to maintaining the highest security, privacy, and integrity standards required for regulated medical software environments. This document outlines our vulnerability disclosure policy, security controls, and design safeguards.

---

## 1. Supported Versions

Security updates and patches are actively maintained for the following versions:

| Version | Supported | Status |
| :--- | :---: | :--- |
| `1.2.x` | :white_check_mark: | Current Release (Assistive AI Layer & MedTech SaaS) |
| `< 1.2.0` | :x: | Unsupported / Deprecated Prototypes |

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability or potential threat in LabelSense:

1. **Do NOT open a public GitHub issue.**
2. Send an advisory email to: `security@labelsense.ai` or submit a private security report via [GitHub Security Advisories](https://github.com/gsai9582/LabelSense/security/advisories/new).
3. Include:
   - Description of the vulnerability.
   - Exact steps or minimal reproducible payload to demonstrate the issue.
   - Potential impact (e.g., prompt injection, denial of service, privilege bypass).
   - Any suggested mitigations.

### Response Timeline
- **Initial Acknowledgment:** Within 24 hours.
- **Triage & Reproduction:** Within 72 hours.
- **Remediation & Patch Release:** Within 7 calendar days for critical issues.

---

## 3. Core Security & Compliance Safeguards

LabelSense incorporates defense-in-depth engineering principles aligned with **GAMP 5 (Good Automated Manufacturing Practice)** and **FDA 21 CFR Part 11**:

### A. Strict Rule Supremacy (AI Safety Guardrail)
- **Principle:** AI models (LLMs) are assistive only and inherently probabilistic. They **never** have unilateral authority to issue a `PASS` verdict.
- **Implementation:** Deterministic GS1 Modulo-10 checksum code, calendar leap-year date validators, and mandatory device class schemas override all AI predictions.
- **Escalation-Only Rule:** Assistive AI may escalate a label from `PASS` to `REVIEW` or `CRITICAL` upon catching semantic shifts or defects, but can **never lower** a `CRITICAL` or `REVIEW` tier assigned by deterministic rules.

### B. Prompt Injection Defense
- **Untrusted Input Isolation:** Text extracted from scanned labels or external files is treated as untrusted user input.
- **Enclosure:** Label contents are encapsulated inside boundary tokens (`<UNTRUSTED_LABEL_CONTENT>`) with explicit system instructions to ignore procedural commands or payload modifications embedded within labels.

### C. Cryptographic Audit Integrity (FIPS 180-4 SHA-256)
- **Hash-Chained Audit Trail:** Every label evaluation, manual review action, AI explanation request, and electronic signature is recorded as an immutable block chained via SHA-256 (`H_i = SHA-256(H_{i-1} || payload_i)`).
- **Tamper Detection:** Modifying or deleting any historical entry breaks the sequential hash chain and triggers immediate UI/API validation failure (`/api/audit/verify`).

### D. Data Privacy & Non-Training Policy
- **Zero Model Training:** Customer label artwork, proprietary formulations, serial numbers, and regulatory submissions are never transmitted to third-party models for training or indexing.
- **Session Sandboxing:** Uploaded label files are processed within isolated runtime environments and can be configured with ephemeral storage cleanup.
- **No PHI/PII Retention:** LabelSense is tailored for device labeling and does not ingest or store Protected Health Information (PHI).

### E. Rate Limiting & Input Size Capping
- **DDoS & Cost Protection:** AI and extraction endpoints are governed by an in-memory sliding-window rate limiter (default: 60 requests/minute/IP).
- **Payload Limits:** LLM input strings are capped at 15,000 characters to prevent resource exhaustion and buffer overflows.

### F. Role-Based Access Control (RBAC)
- **JWT Authorization:** API endpoints enforce role separation between:
  - `Reviewer`: Upload labels, execute analysis, view explainers, draft fixes.
  - `QA Lead`: Perform back-translation audits, run visual diffs, execute FIPS 180-4 hash verifications.
  - `Admin`: Manage regulatory clause datasets, inspect system metrics, configure LLM endpoints.

---

## 4. Regulatory Notice

> **IMPORTANT:** LabelSense is an assistive software tool engineered to accelerate pre-market verification. It is **not** a cleared or approved medical device under FDA 21 CFR 820 or EU MDR 2017/745. Final regulatory submissions and packaging releases require qualified human signatory approval.
