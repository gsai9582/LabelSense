/**
 * Cryptographic SHA-256 Audit Trail and Tamper Verification Engine
 * Pure ESM module for universal Node.js test execution.
 */

export function sha256Pure(message) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const maxWord = Math.pow(2, 32);
  let i = 0;
  let j = 0;
  let result = '';

  const words = [];
  const asciiBitLength = message.length * 8;

  let hash = [];
  const k = [];

  let primeCounter = 0;
  const isPrime = (n) => {
    for (let factor = 2, max = Math.sqrt(n); factor <= max; factor++) {
      if (n % factor === 0) return false;
    }
    return true;
  };

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (isPrime(candidate)) {
      if (primeCounter < 8) {
        hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
      }
      k[primeCounter] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      primeCounter++;
    }
  }

  let padded = message + '\x80';
  while ((padded.length % 64) - 56 !== 0) padded += '\x00';

  for (i = 0; i < padded.length; i++) {
    j = padded.charCodeAt(i);
    const wordIndex = i >> 2;
    words[wordIndex] = (words[wordIndex] || 0) | (j << (((3 - i) % 4) * 8));
  }

  const lenIndexHigh = words.length;
  words[lenIndexHigh] = (asciiBitLength / maxWord) | 0;
  words[lenIndexHigh + 1] = asciiBitLength | 0;

  for (j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = [...hash];
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15] || 0;
      const w2 = w[i - 2] || 0;

      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp1 =
        hash[7] +
        (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) +
        ch +
        k[i] +
        (w[i] =
          i < 16
            ? w[i] || 0
            : ((w[i - 16] || 0) + s0 + (w[i - 7] || 0) + s1) | 0);
      const temp2 =
        (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) +
        maj;

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

export async function calculateSha256(text) {
  const globalCrypto = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;
  if (globalCrypto && globalCrypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await globalCrypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fall through to pure implementation
    }
  }
  return sha256Pure(text);
}

export function calculateSha256Sync(text) {
  return sha256Pure(text);
}

export async function createChainedAuditEvent(params) {
  const timestamp = new Date().toISOString();
  const rawPayload = `${params.previousHash}|${params.id}|${timestamp}|${params.eventType}|${params.actor}|${params.role}|${params.action}|${params.details}|${params.systemVerdict || 'NONE'}`;
  const currentHash = await calculateSha256(rawPayload);

  return {
    id: params.id,
    timestamp,
    eventType: params.eventType,
    actor: params.actor,
    role: params.role,
    action: params.action,
    details: params.details,
    previousHash: params.previousHash,
    currentHash,
    systemVerdict: params.systemVerdict,
  };
}

export async function verifyAuditChain(events) {
  if (!events || events.length === 0) {
    return { isValid: true, totalEvents: 0, message: 'Audit log is empty; chain is trivially valid.' };
  }

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (i > 0) {
      const prevEvent = events[i - 1];
      if (event.previousHash !== prevEvent.currentHash) {
        return {
          isValid: false,
          totalEvents: events.length,
          brokenIndex: i,
          expectedHash: prevEvent.currentHash,
          actualHash: event.previousHash,
          message: `Chain continuity broken at index ${i}.`,
        };
      }
    }

    const rawPayload = `${event.previousHash}|${event.id}|${event.timestamp}|${event.eventType}|${event.actor}|${event.role}|${event.action}|${event.details}|${event.systemVerdict || 'NONE'}`;
    const recomputedHash = await calculateSha256(rawPayload);

    if (recomputedHash !== event.currentHash) {
      return {
        isValid: false,
        totalEvents: events.length,
        brokenIndex: i,
        expectedHash: recomputedHash,
        actualHash: event.currentHash,
        message: `Tamper detected at event ${event.id}: Block payload modified.`,
      };
    }
  }

  return {
    isValid: true,
    totalEvents: events.length,
    message: `All ${events.length} audit records cryptographically verified with zero tamper detected.`,
  };
}

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

function buildInitialEvent(id, timestamp, eventType, actor, role, action, details, previousHash, systemVerdict) {
  const rawPayload = `${previousHash}|${id}|${timestamp}|${eventType}|${actor}|${role}|${action}|${details}|${systemVerdict}`;
  const currentHash = sha256Pure(rawPayload);
  return { id, timestamp, eventType, actor, role, action, details, previousHash, currentHash, systemVerdict };
}

const EVT_1 = buildInitialEvent(
  'AUD-001',
  '2026-11-08T08:15:20Z',
  'ECN_TRIGGER',
  'Dr. Sarah Jenkins',
  'VP Quality Assurance',
  'Initiated Change Notice ECN-2026-S01',
  'Triggered stability shelf-life extension from 24 to 36 months based on protocol STP-2025-99.',
  GENESIS_HASH,
  'PASS'
);

const EVT_2 = buildInitialEvent(
  'AUD-002',
  '2026-11-08T08:18:04Z',
  'GRAPH_TRAVERSAL',
  'LabelSense AI Graph Agent',
  'Automated Regulatory Engine',
  'Label Digital Thread Traversal Completed',
  'Traversed 3 SKUs, 3 packaging levels, 4 markets (US, EU, JP, UK), and 21 localized artwork variants.',
  EVT_1.currentHash,
  'PASS'
);

const EVT_3 = buildInitialEvent(
  'AUD-003',
  '2026-11-08T08:24:19Z',
  'AI_SLOT_FILL',
  'Marcus Vance',
  'Lead Packaging Engineer',
  'Template-Bound Slot-Filling Executed',
  'Applied locked phrase blocks for ISO 15223-1 symbols and synchronized GS1 AI (17) 281231.',
  EVT_2.currentHash,
  'PASS'
);

const EVT_4 = buildInitialEvent(
  'AUD-004',
  '2026-11-08T08:30:45Z',
  'VALIDATION_RUN',
  'LabelSense 3-Layer Engine',
  'Deterministic Verification System',
  'Multi-Layer Validation Pass Complete',
  'Layer 1 GS1 Modulo-10 verified (PASS). Layer 2 Computer Vision diff 99.8% (PASS). Layer 3 Back-translation 0.99 (PASS).',
  EVT_3.currentHash,
  'PASS'
);

export const INITIAL_AUDIT_LOGS = [EVT_1, EVT_2, EVT_3, EVT_4];
