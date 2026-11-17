/**
 * Dynamic Multi-Layer Validation Engine
 * Pure ESM module for universal Node.js test execution.
 */

import {
  parseGS1UDI,
  validateGTIN,
  validateGS1ExpiryDate,
  validateMandatoryLabelSchema,
} from './gs1Validator.mjs';

export function executeDynamicValidation(currentArtwork, baselineArtwork, options) {
  const fullBarcodeString = `${currentArtwork.udiDi || ''}${currentArtwork.udiPi || ''}`;
  const gs1Result = parseGS1UDI(fullBarcodeString);
  const gtinValidation = validateGTIN(currentArtwork.gtin || '');
  const expiryValidation = validateGS1ExpiryDate(currentArtwork.expDate || '');
  const schemaReport = validateMandatoryLabelSchema(currentArtwork);

  const defects = [];
  const fieldDiffs = [];

  let score = 1.0;
  let hasCriticalDefect = false;

  if (!gtinValidation.isValid) {
    score -= 0.28;
    hasCriticalDefect = true;
    defects.push({
      id: 'DEF-GS1-MOD10',
      title: 'GS1 Modulo-10 Check Digit Mismatch',
      description: `GTIN '${currentArtwork.gtin}' ends with check digit '${gtinValidation.actualCheckDigit}', but Modulo-10 algorithm computed '${gtinValidation.calculatedCheckDigit}'.`,
      severity: 'CRITICAL',
    });
  }

  if (!expiryValidation.isValid) {
    score -= 0.15;
    hasCriticalDefect = true;
    defects.push({
      id: 'DEF-EXP-DATE',
      title: 'Invalid Expiration Date Format/Value',
      description: expiryValidation.message,
      severity: 'CRITICAL',
    });
  }

  for (const check of schemaReport.checks) {
    if (!check.passed) {
      if (check.severity === 'CRITICAL') {
        score -= 0.12;
        hasCriticalDefect = true;
        defects.push({
          id: `DEF-SCH-${check.id}`,
          title: `Legal Manufacturer Identification: ${check.name}`,
          description: check.clause,
          severity: 'CRITICAL',
        });
      } else {
        score -= 0.05;
        defects.push({
          id: `DEF-SCH-${check.id}`,
          title: `Non-Critical Schema Variance: ${check.name}`,
          description: check.clause,
          severity: 'MAJOR',
        });
      }
    }
  }

  if (baselineArtwork) {
    const dimDifferent = currentArtwork.dimensions !== baselineArtwork.dimensions;
    if (dimDifferent) {
      score -= 0.25;
      hasCriticalDefect = true;
      defects.push({
        id: 'DEF-DIM-SHIFT',
        title: 'Decimal Shift / Dimension Hazard',
        description: `Dimension shifted from '${baselineArtwork.dimensions}' to '${currentArtwork.dimensions}'.`,
        severity: 'CRITICAL',
      });
    }

    const tempDifferent = currentArtwork.storageTemp !== baselineArtwork.storageTemp;
    if (tempDifferent) {
      score -= 0.08;
      defects.push({
        id: 'DEF-TEMP-VARIANCE',
        title: 'Storage Temperature Limit Shift',
        description: `Storage condition changed from '${baselineArtwork.storageTemp}' to '${currentArtwork.storageTemp}'.`,
        severity: 'MAJOR',
      });
    }
  }

  if (options?.hasTranslationAnomaly) {
    score -= 0.12;
    hasCriticalDefect = true;
    defects.push({
      id: 'DEF-TRANS-DRIFT',
      title: 'Clinical Nuance Semantic Inversion (Japanese TM)',
      description: 'Back-translation flagged semantic inversion.',
      severity: 'CRITICAL',
    });
  }

  score = Math.max(0.1, Math.min(1.0, Math.round(score * 100) / 100));

  let tier = 'GREEN';
  if (hasCriticalDefect || score < 0.85) {
    tier = 'RED';
  } else if (score < 0.98 || defects.length > 0) {
    tier = 'AMBER';
  } else {
    tier = 'GREEN';
  }

  const report = {
    overallScore: score,
    tier,
    routing: {
      recommendedPath:
        tier === 'RED'
          ? 'Hard block release. Mandatory review by Regulatory Affairs.'
          : tier === 'AMBER'
          ? 'Conditional routing to Regulatory Affairs and Localization Specialist.'
          : 'Fast-track single QA lead electronic signature release.',
    },
    layer1Gs1: {
      gtinValid: gtinValidation.isValid,
      expDateValid: expiryValidation.isValid,
      mandatoryFieldsPresent: schemaReport.allPassed,
    },
    layer2Vision: {
      defects,
    },
  };

  return { report, defects, score, tier };
}

export const BASELINE_ARTWORK = {
  sku: 'Stent-CS400',
  productName: 'EverCor™ Drug-Eluting Coronary Stent System',
  tradeName: 'EverCor™ Sirolimus Coated CoCr Stent',
  deviceClass: 'Class III',
  sterileBarrier: 'Single Sterile Barrier System with Protective Inner Wrap',
  packagingLevel: 'Primary Pouch',
  revision: 'Rev. 4.2',
  gtin: '00840123456786',
  lot: 'LOT-2026B14',
  expDate: '2028-12-31',
  mfgDate: '2025-12-01',
  serialNumber: 'SN-942819',
  manufacturerName: 'VascularDynamics Medical AG',
  manufacturerAddress: 'Gewerbestrasse 18, 4057 Basel, Switzerland',
  symbols: ['STERILE_EO', 'REF', 'LOT', 'USE_BY', 'CONSULT_IFU', 'SINGLE_USE', 'MEDICAL_DEVICE', 'CE_MARK', 'TEMP_LIMIT', 'STERILE_BARRIER'],
  instructions: 'See Instructions for Use.',
  storageTemp: '15°C - 30°C (59°F - 86°F)',
  dimensions: '3.0 mm x 18 mm',
  udiDi: '(01)00840123456786',
  udiPi: '(17)281231(10)LOT-2026B14(21)SN-942819',
};

export const SCENARIO_A_ARTWORK = {
  ...BASELINE_ARTWORK,
  revision: 'Rev. 4.3',
  manufacturerAddress: 'Gewerbestrasse 24, 4057 Basel, Switzerland',
};

export const SCENARIO_B_ARTWORK = {
  ...BASELINE_ARTWORK,
  revision: 'Rev. 5.0-UNCHECKED',
  gtin: '00840123456782', // Corrupted check digit
  udiDi: '(01)00840123456782',
  dimensions: '30 mm x 18 mm', // Decimal shift defect
  symbols: ['REF', 'LOT', 'USE_BY', 'CONSULT_IFU', 'SINGLE_USE'], // Missing CE, STERILE_EO, STERILE_BARRIER
};

export const SCENARIO_C_ARTWORK = {
  ...BASELINE_ARTWORK,
  revision: 'Rev. 4.4-RC2',
  storageTemp: '15°C - 25°C (59°F - 77°F)',
};
