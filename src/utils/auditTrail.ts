import { ElectronicSignature } from '../types';

export interface AuditEvent {
  id: string;
  timestamp: string;
  eventType: 'ECN_TRIGGER' | 'GRAPH_TRAVERSAL' | 'AI_SLOT_FILL' | 'VALIDATION_RUN' | 'REDLINE_DIFF' | 'PART_11_SIGNATURE' | 'EXPORT_SUBMISSION';
  actor: string;
  role: string;
  action: string;
  details: string;
  previousHash: string;
  currentHash: string;
  systemVerdict?: 'PASS' | 'REVIEW' | 'FAIL';
}

/**
 * Lightweight deterministic pseudo SHA-256 for browser runtime demonstration
 */
export async function calculateSha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (e) {
      // Fallback
    }
  }
  // Deterministic fallback hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, 'a9b2c3d4e5f6');
}

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-11-08T08:15:20Z',
    eventType: 'ECN_TRIGGER',
    actor: 'Dr. Sarah Jenkins',
    role: 'VP Quality Assurance',
    action: 'Initiated Change Notice ECN-2026-S01',
    details: 'Triggered stability shelf-life extension from 24 to 36 months based on protocol STP-2025-99.',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    currentHash: '3f84d6a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789a',
    systemVerdict: 'PASS',
  },
  {
    id: 'AUD-002',
    timestamp: '2026-11-08T08:18:04Z',
    eventType: 'GRAPH_TRAVERSAL',
    actor: 'LabelSense AI Graph Agent',
    role: 'Automated Regulatory Engine',
    action: 'Label Digital Thread Traversal Completed',
    details: 'Traversed 3 SKUs, 3 packaging levels, 4 markets (US, EU, JP, UK), and 21 localized artwork variants.',
    previousHash: '3f84d6a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789a',
    currentHash: '7c8912e4f5061728394a5b6c7d8e9f0123456789abcdef0123456789a1b2c3d4',
    systemVerdict: 'PASS',
  },
  {
    id: 'AUD-003',
    timestamp: '2026-11-08T08:24:19Z',
    eventType: 'AI_SLOT_FILL',
    actor: 'Marcus Vance',
    role: 'Lead Packaging Engineer',
    action: 'Template-Bound Slot-Filling Executed',
    details: 'Applied locked phrase blocks for ISO 15223-1 symbols and synchronized GS1 AI (17) 281231.',
    previousHash: '7c8912e4f5061728394a5b6c7d8e9f0123456789abcdef0123456789a1b2c3d4',
    currentHash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789a7c8912',
    systemVerdict: 'PASS',
  },
  {
    id: 'AUD-004',
    timestamp: '2026-11-08T08:30:45Z',
    eventType: 'VALIDATION_RUN',
    actor: 'LabelSense 3-Layer Engine',
    role: 'Deterministic Verification System',
    action: 'Multi-Layer Validation Pass Complete',
    details: 'Layer 1 GS1 Modulo-10 verified (PASS). Layer 2 Computer Vision diff 99.8% (PASS). Layer 3 Back-translation 0.99 (PASS).',
    previousHash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789a7c8912',
    currentHash: 'd4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789a7c89123f84d6',
    systemVerdict: 'PASS',
  }
];

export const INITIAL_SIGNATURES: ElectronicSignature[] = [
  {
    id: 'SIG-2026-001',
    userId: 'USR-8821',
    userName: 'Dr. Sarah Jenkins',
    userRole: 'QA_LEAD',
    meaning: 'I have reviewed and approve this label revision as compliant with EU MDR 2017/745 and FDA 21 CFR 801.',
    timestamp: '2026-11-08T08:45:12Z',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    ipAddress: '192.168.10.42 (Internal GxP VPN)',
    part11Compliant: true,
  }
];
