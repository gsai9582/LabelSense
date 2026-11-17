/**
 * LabelSense Client API Bridge
 * Connects frontend workflows to the FastAPI backend.
 */

export interface BackendExtractedFields {
  sku?: string;
  product_name?: string;
  gtin?: string;
  lot?: string;
  exp_date?: string;
  manufacturer_name?: string;
  device_class?: string;
  symbols?: string[];
  confidence_scores?: Record<string, number>;
}

export interface BackendValidationRequest {
  gtin: string;
  exp_date?: string;
  lot?: string;
  sku?: string;
  manufacturer_name?: string;
  device_class?: string;
  symbols?: string[];
  document_id?: string;
}

export interface BackendFindingItem {
  id: string;
  field: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';
  rule_id: string;
  message: string;
  evidence_value?: string;
  confidence: number;
}

export interface BackendValidationResponse {
  verdict: 'PASS' | 'REVIEW' | 'CRITICAL';
  overall_score: number;
  findings: BackendFindingItem[];
  verified_at: string;
  sha256_digest: string;
  breakdown: Record<string, any>;
}

export interface BackendCompareRequest {
  baseline_gtin: string;
  candidate_gtin: string;
  baseline_exp?: string;
  candidate_exp?: string;
  baseline_lot?: string;
  candidate_lot?: string;
  baseline_text?: string;
  candidate_text?: string;
}

export interface BackendCompareResponse {
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  verdict: 'PASS' | 'REVIEW' | 'CRITICAL';
  diffs: {
    field: string;
    baseline: string;
    candidate: string;
    status: 'UNCHANGED' | 'MODIFIED' | 'EXPIRY_DRIFT' | 'CRITICAL_DIFF';
    note?: string;
  }[];
  text_similarity_ratio: number;
}

export interface BackendAuditLog {
  id: string;
  sequence_number: number;
  timestamp: string;
  event_type: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  previous_hash: string;
  current_hash: string;
  system_verdict: string;
}

export interface BackendVerifyChainResponse {
  is_valid: boolean;
  total_blocks: number;
  verified_blocks: number;
  broken_at_id?: string;
  details: string;
}

export interface BackendVisionExtractionResponse {
  product_name: string;
  sku: string;
  gtin: string;
  lot: string;
  exp_date: string;
  manufacturer_name: string;
  manufacturer_address: string;
  device_class: string;
  symbols: string[];
  confidence_scores: Record<string, number>;
  evidence_regions: Record<string, string>;
  is_gtin_checksum_valid: boolean;
  checksum_calculated?: number;
  checksum_found?: number;
  ai_provider: string;
  is_demo_mode: boolean;
}

export interface BackendFindingExplanationResponse {
  finding_id: string;
  plain_summary: string;
  clinical_impact: string;
  regulatory_reference: string;
  suggested_fix: string;
  confidence: number;
  ai_provider: string;
  is_demo_mode: boolean;
}

export interface BackendClauseItem {
  clause_id: string;
  source_name: string;
  section: string;
  title: string;
  excerpt: string;
  relevance_score: number;
}

export interface BackendClauseSearchResponse {
  query: string;
  matched_clauses: BackendClauseItem[];
  synthesized_answer: string;
  disclaimer: string;
}

export interface BackendFlaggedShift {
  category: string;
  severity: string;
  description: string;
  source_phrase: string;
  translated_phrase: string;
}

export interface BackendBackTranslationResponse {
  source_text: string;
  target_text: string;
  back_translation: string;
  semantic_similarity: number;
  has_critical_shift: boolean;
  flagged_shifts: BackendFlaggedShift[];
  deterministic_number_match: boolean;
  deterministic_unit_match: boolean;
  confidence: number;
  ai_provider: string;
  is_demo_mode: boolean;
}

export interface BackendImpactSummaryResponse {
  ecn_id: string;
  executive_brief: string;
  affected_skus: string[];
  affected_packaging_levels: string[];
  target_markets: string[];
  regulatory_filing_pathway: string;
  mandatory_verification_protocols: string[];
  confidence: number;
  ai_provider: string;
  is_demo_mode: boolean;
}

export interface BackendChatResponse {
  response: string;
  cited_finding_ids: string[];
  is_report_grounded: boolean;
  ai_provider: string;
  is_demo_mode: boolean;
}

const BASE_URL = '/api';

export const apiClient = {
  async health(): Promise<{ status: string; service: string; version: string }> {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return res.json();
  },

  async login(email: string, role: string = 'QA Lead'): Promise<{ access_token: string; role: string }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'clinical_demo_password', role }),
    });
    if (!res.ok) throw new Error(`Login failed: ${res.statusText}`);
    return res.json();
  },

  async validate(payload: BackendValidationRequest): Promise<BackendValidationResponse> {
    const res = await fetch(`${BASE_URL}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Validation failed: ${res.statusText}`);
    return res.json();
  },

  async compare(payload: BackendCompareRequest): Promise<BackendCompareResponse> {
    const res = await fetch(`${BASE_URL}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Compare failed: ${res.statusText}`);
    return res.json();
  },

  async getAuditTrail(): Promise<BackendAuditLog[]> {
    const res = await fetch(`${BASE_URL}/audit`);
    if (!res.ok) throw new Error(`Failed to fetch audit trail: ${res.statusText}`);
    return res.json();
  },

  async verifyAuditChain(): Promise<BackendVerifyChainResponse> {
    const res = await fetch(`${BASE_URL}/audit/verify`);
    if (!res.ok) throw new Error(`Failed to verify audit chain: ${res.statusText}`);
    return res.json();
  },

  async downloadReportPdf(documentId: string): Promise<Blob> {
    const res = await fetch(`${BASE_URL}/reports/${documentId}/pdf`);
    if (!res.ok) throw new Error(`PDF download failed: ${res.statusText}`);
    return res.blob();
  },

  async uploadDocument(file: File): Promise<{ id: string; filename: string; sha256_hash: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/documents`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
    return res.json();
  },

  async extractDocument(documentId: string): Promise<BackendExtractedFields> {
    const res = await fetch(`${BASE_URL}/documents/${documentId}/extract`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(`Extraction failed: ${res.statusText}`);
    return res.json();
  },

  // --- AI Assistive Layer Endpoints ---
  async getAiStatus(): Promise<{ status: string; provider: string; is_demo_mode: boolean; cached_entries: number; rate_limit_rpm: number }> {
    const res = await fetch(`${BASE_URL}/ai/status`);
    if (!res.ok) throw new Error(`AI status check failed: ${res.statusText}`);
    return res.json();
  },

  async extractVisionAI(documentId?: string, imageBase64?: string): Promise<BackendVisionExtractionResponse> {
    const res = await fetch(`${BASE_URL}/ai/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_id: documentId, image_base64: imageBase64, force_ai: true }),
    });
    if (!res.ok) throw new Error(`Vision AI extraction failed: ${res.statusText}`);
    return res.json();
  },

  async explainFinding(findingId: string, ruleId: string, evidenceText: string, findingDetails: string, severity: string = 'CRITICAL'): Promise<BackendFindingExplanationResponse> {
    const res = await fetch(`${BASE_URL}/ai/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        finding_id: findingId,
        rule_id: ruleId,
        evidence_text: evidenceText,
        finding_details: findingDetails,
        severity: severity,
      }),
    });
    if (!res.ok) throw new Error(`AI explanation failed: ${res.statusText}`);
    return res.json();
  },

  async searchClausesRAG(query: string, limit: number = 4): Promise<BackendClauseSearchResponse> {
    const res = await fetch(`${BASE_URL}/ai/clauses/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit }),
    });
    if (!res.ok) throw new Error(`Clause RAG search failed: ${res.statusText}`);
    return res.json();
  },

  async checkBackTranslation(sourceText: string, targetLanguage: string, targetText: string, lockedTerms: string[] = []): Promise<BackendBackTranslationResponse> {
    const res = await fetch(`${BASE_URL}/ai/backtranslate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_text: sourceText,
        target_language: targetLanguage,
        target_text: targetText,
        locked_terms: lockedTerms,
      }),
    });
    if (!res.ok) throw new Error(`Back-translation audit failed: ${res.statusText}`);
    return res.json();
  },

  async getImpactSummary(ecnId: string, diffText: string, affectedNodes: any[] = []): Promise<BackendImpactSummaryResponse> {
    const res = await fetch(`${BASE_URL}/ai/impact-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ecn_id: ecnId,
        diff_text: diffText,
        affected_nodes: affectedNodes,
      }),
    });
    if (!res.ok) throw new Error(`Impact summary failed: ${res.statusText}`);
    return res.json();
  },

  async chatWithReport(userQuery: string, reportContext: any, conversationHistory: any[] = []): Promise<BackendChatResponse> {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_query: userQuery,
        report_context: reportContext,
        conversation_history: conversationHistory,
      }),
    });
    if (!res.ok) throw new Error(`Report chat failed: ${res.statusText}`);
    return res.json();
  },

  async recordReviewerDecision(featureName: string, itemId: string, decision: 'ACCEPT' | 'EDIT' | 'REJECT', reviewerNotes?: string, editedValue?: any): Promise<{ status: string; audit_block_id: string; current_hash: string; decision: string }> {
    const res = await fetch(`${BASE_URL}/ai/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feature_name: featureName,
        item_id: itemId,
        decision,
        reviewer_notes: reviewerNotes,
        edited_value: editedValue,
      }),
    });
    if (!res.ok) throw new Error(`Recording reviewer decision failed: ${res.statusText}`);
    return res.json();
  },
};
