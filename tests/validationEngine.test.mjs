import test from 'node:test';
import assert from 'node:assert';

import {
  executeDynamicValidation,
  BASELINE_ARTWORK,
  SCENARIO_A_ARTWORK,
  SCENARIO_B_ARTWORK,
  SCENARIO_C_ARTWORK,
} from './validationEngine.mjs';

test('Dynamic Validation Engine - Scenario A (Green Tier)', () => {
  const result = executeDynamicValidation(SCENARIO_A_ARTWORK, BASELINE_ARTWORK);

  assert.ok(result.score >= 0.98, `Scenario A score must be >= 0.98 (actual: ${result.score})`);
  assert.strictEqual(result.tier, 'GREEN', 'Scenario A must receive GREEN tier');
  assert.strictEqual(result.report.layer1Gs1.gtinValid, true);
  assert.strictEqual(result.report.layer1Gs1.expDateValid, true);
  assert.strictEqual(result.report.layer1Gs1.mandatoryFieldsPresent, true);
  assert.ok(result.report.routing.recommendedPath.includes('Fast-track'));
});

test('Dynamic Validation Engine - Scenario B (Red Tier Critical Block)', () => {
  const result = executeDynamicValidation(SCENARIO_B_ARTWORK, BASELINE_ARTWORK, {
    forceSimulatedVisionDefects: true,
    hasTranslationAnomaly: true,
  });

  assert.ok(result.score < 0.85, `Scenario B score must be < 0.85 (actual: ${result.score})`);
  assert.strictEqual(result.tier, 'RED', 'Scenario B must receive RED tier block');
  assert.strictEqual(result.report.layer1Gs1.gtinValid, false, 'Corrupted GTIN must fail');
  assert.ok(result.defects.length >= 3, 'Multiple critical defects must be classified');

  // Verify critical defects presence
  const hasGtinDefect = result.defects.some(d => d.id === 'DEF-GS1-MOD10');
  const hasDimDefect = result.defects.some(d => d.id === 'DEF-DIM-SHIFT');
  assert.strictEqual(hasGtinDefect, true, 'GS1 Modulo-10 defect must be present');
  assert.strictEqual(hasDimDefect, true, 'Dimension decimal shift defect must be present');

  assert.ok(result.report.routing.recommendedPath.includes('Hard block release'));
});

test('Dynamic Validation Engine - Scenario C (Amber Tier Review)', () => {
  const result = executeDynamicValidation(SCENARIO_C_ARTWORK, BASELINE_ARTWORK);

  assert.ok(result.score >= 0.85 && result.score <= 0.97, `Scenario C score must be Amber tier range (actual: ${result.score})`);
  assert.strictEqual(result.tier, 'AMBER', 'Scenario C must receive AMBER tier');
  assert.ok(result.defects.some(d => d.id === 'DEF-TEMP-VARIANCE'));
  assert.ok(result.report.routing.recommendedPath.includes('Conditional routing'));
});

test('Dynamic Validation Engine - Custom Label Input (Missing Mandatory Fields)', () => {
  const incompleteLabel = {
    ...BASELINE_ARTWORK,
    manufacturerName: '',
    manufacturerAddress: '',
    symbols: ['REF'], // Missing mandatory symbols
  };

  const result = executeDynamicValidation(incompleteLabel, BASELINE_ARTWORK);
  assert.strictEqual(result.tier, 'RED', 'Missing mandatory manufacturer fields must trigger RED tier');
  assert.ok(result.defects.some(d => d.title.includes('Legal Manufacturer Identification')));
});

test('Dynamic Validation Engine - Invalid Date Handling', () => {
  const badDateLabel = {
    ...BASELINE_ARTWORK,
    expDate: '2026-02-31', // Non-existent date
  };

  const result = executeDynamicValidation(badDateLabel, BASELINE_ARTWORK);
  assert.strictEqual(result.report.layer1Gs1.expDateValid, false);
  assert.ok(result.defects.some(d => d.id === 'DEF-EXP-DATE'));
});
