import test from 'node:test';
import assert from 'node:assert';

import {
  calculateSha256,
  calculateSha256Sync,
  createChainedAuditEvent,
  verifyAuditChain,
  INITIAL_AUDIT_LOGS,
} from './auditTrail.mjs';

test('Cryptographic SHA-256 - Known Test Vectors', async () => {
  // FIPS 180-4 standard test vector: empty string
  const emptyHash = await calculateSha256('');
  assert.strictEqual(
    emptyHash,
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'Empty string SHA-256 digest must match FIPS test vector'
  );

  // Synchronous SHA-256 calculation
  const emptyHashSync = calculateSha256Sync('');
  assert.strictEqual(emptyHashSync, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

  // String 'LabelSense' test vector
  const labelSenseHash = await calculateSha256('LabelSense');
  assert.strictEqual(labelSenseHash.length, 64, 'SHA-256 digest must be 64 hexadecimal characters');
  assert.match(labelSenseHash, /^[0-9a-f]{64}$/, 'Must be valid hex');
});

test('Audit Trail - Seed Chain Cryptographic Verification', async () => {
  const result = await verifyAuditChain(INITIAL_AUDIT_LOGS);
  assert.strictEqual(result.isValid, true, 'Initial seed chain must be cryptographically valid');
  assert.strictEqual(result.totalEvents, INITIAL_AUDIT_LOGS.length);
  assert.strictEqual(result.brokenIndex, undefined);
});

test('Audit Trail - Dynamic Event Chaining', async () => {
  const tipEvent = INITIAL_AUDIT_LOGS[INITIAL_AUDIT_LOGS.length - 1];

  const newEvent = await createChainedAuditEvent({
    id: 'AUD-005',
    eventType: 'VALIDATION_RUN',
    actor: 'Automated Test Runner',
    role: 'QA Engineer',
    action: 'Unit Test Validation Run',
    details: 'Verified Modulo-10 parity on GTIN-14.',
    previousHash: tipEvent.currentHash,
    systemVerdict: 'PASS',
  });

  assert.strictEqual(newEvent.previousHash, tipEvent.currentHash);
  assert.strictEqual(newEvent.currentHash.length, 64);

  const extendedChain = [...INITIAL_AUDIT_LOGS, newEvent];
  const verification = await verifyAuditChain(extendedChain);
  assert.strictEqual(verification.isValid, true, 'Extended chain must remain valid');
  assert.strictEqual(verification.totalEvents, 5);
});

test('Audit Trail - Tamper Detection (Payload Modification)', async () => {
  // Deep clone chain and mutate a record in the middle
  const tamperedChain = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
  tamperedChain[1].details = 'MALICIOUS MODIFICATION: Unapproved shelf-life bypass';

  const verification = await verifyAuditChain(tamperedChain);
  assert.strictEqual(verification.isValid, false, 'Tampered chain must be flagged as invalid');
  assert.strictEqual(verification.brokenIndex, 1, 'Broken block index must be accurately identified');
  assert.ok(verification.message.includes('Tamper detected'));
});

test('Audit Trail - Tamper Detection (Broken Link / Missing Block)', async () => {
  // Swap order or break previousHash
  const tamperedChain = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
  tamperedChain[2].previousHash = 'bad0000000000000000000000000000000000000000000000000000000000000';

  const verification = await verifyAuditChain(tamperedChain);
  assert.strictEqual(verification.isValid, false, 'Broken hash link must be flagged');
  assert.strictEqual(verification.brokenIndex, 2);
});
