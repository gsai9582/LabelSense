import test from 'node:test';
import assert from 'node:assert';

// Import pure utility functions for testing
import {
  calculateGS1Modulo10,
  validateGTIN,
  getGTINFormat,
  validateGS1ExpiryDate,
  parseGS1UDI,
  validateMandatoryLabelSchema,
} from './gs1Validator.mjs';

test('GS1 Modulo-10 Check Digit Calculation - GTIN-14 Standard', () => {
  // Payload for GTIN-14: '0084012345678' -> Check digit is 6
  const result = calculateGS1Modulo10('0084012345678');
  assert.strictEqual(result.checkDigit, 6, 'GTIN-14 check digit should be 6');
  assert.strictEqual(result.weightedSum, 104, 'Weighted alternating sum should be 104');
  assert.strictEqual(result.nextMultipleOf10, 110, 'Next multiple of 10 should be 110');
});

test('GS1 Modulo-10 Check Digit Calculation - GTIN-13 Standard (EAN-13)', () => {
  // Payload for GTIN-13: '400638133393' -> Check digit 1
  const result = calculateGS1Modulo10('400638133393');
  assert.strictEqual(result.checkDigit, 1, 'GTIN-13 check digit should be 1');
});

test('GS1 Modulo-10 Check Digit Calculation - GTIN-12 Standard (UPC-A)', () => {
  // Payload for GTIN-12: '01234567890' -> Check digit 5
  const result = calculateGS1Modulo10('01234567890');
  assert.strictEqual(result.checkDigit, 5, 'GTIN-12 check digit should be 5');
});

test('GS1 Modulo-10 Check Digit Calculation - GTIN-8 Standard', () => {
  // Payload for GTIN-8: '9638507' -> Check digit 4
  const result = calculateGS1Modulo10('9638507');
  assert.strictEqual(result.checkDigit, 4, 'GTIN-8 check digit should be 4');
});

test('GS1 Modulo-10 Check Digit Calculation - Edge Cases (Remainder 0)', () => {
  // When sum is already a multiple of 10, check digit must be 0
  const result = calculateGS1Modulo10('0000000000000');
  assert.strictEqual(result.checkDigit, 0, 'Zero payload check digit must be 0');
  assert.strictEqual(result.weightedSum, 0);
  assert.strictEqual(result.nextMultipleOf10, 0);

  // Empty string handling
  const emptyRes = calculateGS1Modulo10('');
  assert.strictEqual(emptyRes.checkDigit, -1, 'Empty input must return -1');
});

test('GTIN Validation - Valid Formats (GTIN-8, 12, 13, 14)', () => {
  assert.strictEqual(validateGTIN('00840123456786').isValid, true);
  assert.strictEqual(validateGTIN('00840123456786').format, 'GTIN-14');

  assert.strictEqual(validateGTIN('4006381333931').isValid, true);
  assert.strictEqual(validateGTIN('4006381333931').format, 'GTIN-13');

  assert.strictEqual(validateGTIN('012345678905').isValid, true);
  assert.strictEqual(validateGTIN('012345678905').format, 'GTIN-12');

  assert.strictEqual(validateGTIN('96385074').isValid, true);
  assert.strictEqual(validateGTIN('96385074').format, 'GTIN-8');
});

test('GTIN Validation - Check Digit Mismatches and Corrupted Barcodes', () => {
  // Scenario B defect: ends in 2 instead of 6
  const corrupted = validateGTIN('00840123456782');
  assert.strictEqual(corrupted.isValid, false);
  assert.strictEqual(corrupted.actualCheckDigit, 2);
  assert.strictEqual(corrupted.calculatedCheckDigit, 6);
  assert.ok(corrupted.errorMessage?.includes('Check digit mismatch'));
});

test('GTIN Validation - Invalid Lengths and Non-Numeric Inputs', () => {
  assert.strictEqual(validateGTIN('1234567').isValid, false, '7 digits is invalid');
  assert.strictEqual(validateGTIN('123456789').isValid, false, '9 digits is invalid');
  assert.strictEqual(validateGTIN('1234567890').isValid, false, '10 digits is invalid');
  assert.strictEqual(validateGTIN('12345678901').isValid, false, '11 digits is invalid');
  assert.strictEqual(validateGTIN('123456789012345').isValid, false, '15 digits is invalid');
  assert.strictEqual(validateGTIN('').isValid, false, 'Empty GTIN is invalid');
});

test('GS1 Expiration Date Validation - Standard YYMMDD and Day 00', () => {
  const standard = validateGS1ExpiryDate('281231');
  assert.strictEqual(standard.isValid, true);
  assert.strictEqual(standard.parsedDate, '2028-12-31');
  assert.strictEqual(standard.isEndOfMonthDay, false);

  // Day 00 GS1 Rule (last day of month)
  const endOfMonth = validateGS1ExpiryDate('281200');
  assert.strictEqual(endOfMonth.isValid, true);
  assert.strictEqual(endOfMonth.parsedDate, '2028-12-31');
  assert.strictEqual(endOfMonth.isEndOfMonthDay, true);

  // February Day 00 on non-leap year (2026 -> Feb 28)
  const febNonLeap = validateGS1ExpiryDate('260200');
  assert.strictEqual(febNonLeap.isValid, true);
  assert.strictEqual(febNonLeap.parsedDate, '2026-02-28');

  // February Day 00 on leap year (2028 -> Feb 29)
  const febLeap = validateGS1ExpiryDate('280200');
  assert.strictEqual(febLeap.isValid, true);
  assert.strictEqual(febLeap.parsedDate, '2028-02-29');
});

test('GS1 Expiration Date Validation - Leap Year Rules', () => {
  // Feb 29, 2024 is valid (leap year)
  assert.strictEqual(validateGS1ExpiryDate('240229').isValid, true);
  assert.strictEqual(validateGS1ExpiryDate('240229').parsedDate, '2024-02-29');

  // Feb 29, 2026 is invalid (not a leap year)
  const invalidLeap = validateGS1ExpiryDate('260229');
  assert.strictEqual(invalidLeap.isValid, false);
  assert.ok(invalidLeap.message.includes("Invalid day '29'"));
});

test('GS1 Expiration Date Validation - Invalid Months and Days', () => {
  assert.strictEqual(validateGS1ExpiryDate('280015').isValid, false, 'Month 00 is invalid');
  assert.strictEqual(validateGS1ExpiryDate('281301').isValid, false, 'Month 13 is invalid');
  assert.strictEqual(validateGS1ExpiryDate('280431').isValid, false, 'April 31 is invalid (30 days max)');
  assert.strictEqual(validateGS1ExpiryDate('281235').isValid, false, 'Day 35 is invalid');
  assert.strictEqual(validateGS1ExpiryDate('2812').isValid, false, 'Too short');
});

test('GS1 UDI Composite String Parsing - Bracketed AIs', () => {
  const barcode = '(01)00840123456786(17)281231(10)LOT-2026B14(21)SN-942819';
  const parsed = parseGS1UDI(barcode);

  assert.strictEqual(parsed.isValid, true);
  assert.strictEqual(parsed.gtin, '00840123456786');
  assert.strictEqual(parsed.expiryDateRaw, '281231');
  assert.strictEqual(parsed.lot, 'LOT-2026B14');
  assert.strictEqual(parsed.serialNumber, 'SN-942819');
  assert.strictEqual(parsed.errors.length, 0);
  assert.strictEqual(parsed.parsedAIs.length, 4);
});

test('GS1 UDI Composite String Parsing - Unbracketed Raw Stream', () => {
  const rawStream = '01008401234567861728123110LOT-2026B14';
  const parsed = parseGS1UDI(rawStream);

  assert.strictEqual(parsed.isValid, true);
  assert.strictEqual(parsed.gtin, '00840123456786');
  assert.strictEqual(parsed.expiryDateRaw, '281231');
  assert.strictEqual(parsed.lot, 'LOT-2026B14');
});

test('GS1 UDI Composite String Parsing - Fault Injection', () => {
  // Corrupted check digit in UDI
  const corruptedBarcode = '(01)00840123456782(17)281231(10)LOT-2026B14';
  const parsed = parseGS1UDI(corruptedBarcode);

  assert.strictEqual(parsed.isValid, false);
  assert.ok(parsed.errors.some(e => e.includes('Check Digit Mismatch') || e.includes('Validation Failed')));

  // Missing AI 01
  const missingGtin = '(17)281231(10)LOT-2026B14';
  const parsedMissing = parseGS1UDI(missingGtin);
  assert.strictEqual(parsedMissing.isValid, false);
  assert.ok(parsedMissing.errors.some(e => e.includes('Missing mandatory Application Identifier (01)')));
});

test('Mandatory Label Schema Validation - Full Compliance vs Missing Fields', () => {
  const compliantLabel = {
    sku: 'Stent-CS400',
    productName: 'EverCor™ Drug-Eluting Stent',
    manufacturerName: 'VascularDynamics Medical AG',
    manufacturerAddress: 'Gewerbestrasse 18, 4057 Basel, Switzerland',
    deviceClass: 'Class III',
    symbols: ['STERILE_EO', 'REF', 'LOT', 'USE_BY', 'SINGLE_USE', 'MEDICAL_DEVICE', 'CE_MARK', 'STERILE_BARRIER'],
    gtin: '00840123456786',
    lot: 'LOT-2026B14',
    expDate: '2028-12-31',
  };

  const compliantReport = validateMandatoryLabelSchema(compliantLabel);
  assert.strictEqual(compliantReport.allPassed, true);
  assert.strictEqual(compliantReport.criticalFailures.length, 0);

  // Mislabeled label missing CE mark and sterile barrier
  const defectiveLabel = {
    ...compliantLabel,
    symbols: ['REF', 'LOT', 'USE_BY'], // Missing CE_MARK, STERILE_EO, STERILE_BARRIER
  };

  const defectiveReport = validateMandatoryLabelSchema(defectiveLabel);
  assert.strictEqual(defectiveReport.allPassed, false);
  assert.ok(defectiveReport.criticalFailures.length > 0);
  assert.ok(defectiveReport.criticalFailures.includes('CE Marking with Notified Body Identifier'));
});
