import type {
  LabelArtwork,
  DefectItem,
  ValidationReport,
  ValidationTier,
} from '../types/index.ts';
import {
  parseGS1UDI,
  validateGTIN,
  validateGS1ExpiryDate,
  validateMandatoryLabelSchema,
} from './gs1Validator.ts';

export interface DynamicValidationResult {
  report: ValidationReport;
  defects: DefectItem[];
  score: number;
  tier: ValidationTier;
  summaryText: string;
  fieldDiffs: {
    field: string;
    baseline: string;
    revised: string;
    isDifferent: boolean;
    severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'NONE';
  }[];
  isSimulatedVisionDiff: boolean;
}

/**
 * Runs a deterministic multi-layer validation on a label artwork against an approved baseline.
 * Calculates dynamic risk scores, classifies defect items, and routes for review.
 */
export function executeDynamicValidation(
  currentArtwork: LabelArtwork,
  baselineArtwork?: LabelArtwork,
  options?: {
    forceSimulatedVisionDefects?: boolean;
    hasTranslationAnomaly?: boolean;
  }
): DynamicValidationResult {
  const fullBarcodeString = `${currentArtwork.udiDi || ''}${currentArtwork.udiPi || ''}`;
  const gs1Result = parseGS1UDI(fullBarcodeString);
  const gtinValidation = validateGTIN(currentArtwork.gtin || '');
  const expiryValidation = validateGS1ExpiryDate(currentArtwork.expDate || '');
  const schemaReport = validateMandatoryLabelSchema(currentArtwork);

  const defects: DefectItem[] = [];
  const fieldDiffs: DynamicValidationResult['fieldDiffs'] = [];

  let score = 1.0;
  let hasCriticalDefect = false;

  // 1. Layer 1 Defect Analysis: GS1 Modulo-10 Check
  if (!gtinValidation.isValid) {
    score -= 0.28;
    hasCriticalDefect = true;
    defects.push({
      id: 'DEF-GS1-MOD10',
      type: 'QUIET_ZONE',
      title: 'GS1 Modulo-10 Check Digit Mismatch',
      description: `GTIN '${currentArtwork.gtin}' ends with check digit '${gtinValidation.actualCheckDigit}', but Modulo-10 algorithm computed '${gtinValidation.calculatedCheckDigit}'. Barcode scanners in hospital O.R. will fail to decode.`,
      severity: 'CRITICAL',
      x: 10,
      y: 75,
      width: 45,
      height: 18,
      expected: `Check Digit: ${gtinValidation.calculatedCheckDigit}`,
      actual: `Check Digit: ${gtinValidation.actualCheckDigit}`,
      regulatoryRef: '21 CFR §801.40 & GS1 GenSpecs §7.9.1',
    });
  }

  // 2. Layer 1 Defect Analysis: Expiry Date Validation
  if (!expiryValidation.isValid) {
    score -= 0.15;
    hasCriticalDefect = true;
    defects.push({
      id: 'DEF-EXP-DATE',
      type: 'MISSING_FIELD',
      title: 'Invalid Expiration Date Format/Value',
      description: expiryValidation.message,
      severity: 'CRITICAL',
      x: 55,
      y: 45,
      width: 35,
      height: 14,
      expected: 'Valid ISO / GS1 Expiry Date',
      actual: currentArtwork.expDate || 'MISSING',
      regulatoryRef: 'ISO 15223-1 Ref 5.1.4 & EU MDR §23.2(i)',
    });
  }

  // 3. Layer 1 Defect Analysis: Mandatory Schema Checks
  for (const check of schemaReport.checks) {
    if (!check.passed) {
      if (check.severity === 'CRITICAL') {
        score -= 0.12;
        hasCriticalDefect = true;
        defects.push({
          id: `DEF-SCH-${check.id}`,
          type: 'MISSING_FIELD',
          title: `Missing Mandatory Field: ${check.name}`,
          description: check.message,
          severity: 'CRITICAL',
          x: 75,
          y: 78,
          width: 22,
          height: 16,
          expected: 'Present on artwork',
          actual: 'ABSENT / INCOMPLETE',
          regulatoryRef: check.clause,
        });
      } else {
        score -= 0.05;
        defects.push({
          id: `DEF-SCH-${check.id}`,
          type: 'MISSING_FIELD',
          title: `Non-Critical Schema Variance: ${check.name}`,
          description: check.message,
          severity: 'MAJOR',
          x: 40,
          y: 78,
          width: 25,
          height: 14,
          expected: 'Present on artwork',
          actual: 'ABSENT',
          regulatoryRef: check.clause,
        });
      }
    }
  }

  // 4. Layer 2 Field Diffs vs Baseline Artwork
  if (baselineArtwork) {
    // Check Dimension Shift
    const dimDifferent = currentArtwork.dimensions !== baselineArtwork.dimensions;
    fieldDiffs.push({
      field: 'Dimensions',
      baseline: baselineArtwork.dimensions,
      revised: currentArtwork.dimensions,
      isDifferent: dimDifferent,
      severity: dimDifferent ? 'CRITICAL' : 'NONE',
    });

    if (dimDifferent) {
      score -= 0.25;
      hasCriticalDefect = true;
      defects.push({
        id: 'DEF-DIM-SHIFT',
        type: 'DECIMAL_SHIFT',
        title: 'Decimal Shift / Dimension Hazard',
        description: `Dimension shifted from baseline '${baselineArtwork.dimensions}' to '${currentArtwork.dimensions}'. Potential critical clinical perforation risk if device size is mislabeled.`,
        severity: 'CRITICAL',
        x: 18,
        y: 28,
        width: 32,
        height: 12,
        expected: baselineArtwork.dimensions,
        actual: currentArtwork.dimensions,
        regulatoryRef: 'ISO 25539-2 / 21 CFR §820.30',
      });
    }

    // Check Storage Temperature Variance
    const tempDifferent = currentArtwork.storageTemp !== baselineArtwork.storageTemp;
    fieldDiffs.push({
      field: 'Storage Temperature',
      baseline: baselineArtwork.storageTemp,
      revised: currentArtwork.storageTemp,
      isDifferent: tempDifferent,
      severity: tempDifferent ? 'MAJOR' : 'NONE',
    });

    if (tempDifferent) {
      score -= 0.08;
      defects.push({
        id: 'DEF-TEMP-VARIANCE',
        type: 'DECIMAL_SHIFT',
        title: 'Storage Temperature Limit Shift',
        description: `Storage condition changed from '${baselineArtwork.storageTemp}' to '${currentArtwork.storageTemp}'. Verification required against accelerated stability study STP-2025-99.`,
        severity: 'MAJOR',
        x: 20,
        y: 60,
        width: 40,
        height: 14,
        expected: baselineArtwork.storageTemp,
        actual: currentArtwork.storageTemp,
        regulatoryRef: 'ISO 15223-1 Ref 5.3.7',
      });
    }

    // Check Address Change
    const addrDifferent = currentArtwork.manufacturerAddress !== baselineArtwork.manufacturerAddress;
    fieldDiffs.push({
      field: 'Manufacturer Address',
      baseline: baselineArtwork.manufacturerAddress,
      revised: currentArtwork.manufacturerAddress,
      isDifferent: addrDifferent,
      severity: addrDifferent ? 'MINOR' : 'NONE',
    });

    if (addrDifferent && !dimDifferent && gtinValidation.isValid) {
      // Minor address update only - normal pass
      score = Math.max(score, 0.99);
    }
  }

  // 5. Layer 3 Translation Drift Option
  if (options?.hasTranslationAnomaly) {
    score -= 0.12;
    hasCriticalDefect = true;
    defects.push({
      id: 'DEF-TRANS-DRIFT',
      type: 'TRANSLATION_DRIFT',
      title: 'Clinical Nuance Semantic Inversion (Japanese TM)',
      description: 'Back-translation flagged semantic inversion of "Do not re-use" into "Reusable after washing". Severe patient cross-contamination hazard.',
      severity: 'CRITICAL',
      x: 10,
      y: 50,
      width: 80,
      height: 15,
      expected: 'Do not re-use (Single patient only)',
      actual: 'Reusable after washing (Flagged)',
      regulatoryRef: 'ISO 15223-1 Ref 5.4.2 & IMDRF N52',
    });
  }

  // Bound score
  score = Math.max(0.1, Math.min(1.0, Math.round(score * 100) / 100));

  // Determine Tier
  let tier: ValidationTier = 'GREEN';
  if (hasCriticalDefect || score < 0.85) {
    tier = 'RED';
  } else if (score < 0.98 || defects.length > 0) {
    tier = 'AMBER';
  } else {
    tier = 'GREEN';
  }

  // Build routing recommendation
  let recommendedPath = 'Fast-track single QA lead electronic signature release.';
  let requiredSignatures = ['QA Lead (e-Signature)'];
  let turnaroundSla = '< 2 Hours (Fast-Track)';

  if (tier === 'RED') {
    recommendedPath = 'Hard block release. Mandatory review by Regulatory Affairs, QA Director, and Clinical Review Board.';
    requiredSignatures = [
      'QA Lead',
      'Director Regulatory Affairs',
      'Clinical Safety Officer',
      'Operations Director',
    ];
    turnaroundSla = '24-48 Hours (Gating Review)';
  } else if (tier === 'AMBER') {
    recommendedPath = 'Conditional routing to Regulatory Affairs and Localization Specialist for redline sign-off.';
    requiredSignatures = ['QA Lead', 'Regulatory Affairs Specialist', 'Packaging Engineer'];
    turnaroundSla = '4-8 Hours (Standard)';
  }

  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    overallScore: score,
    tier,
    routing: {
      recommendedPath,
      requiredSignatures,
      turnaroundSla,
    },
    layer1Gs1: {
      passed: gtinValidation.isValid && expiryValidation.isValid && schemaReport.allPassed,
      gtinValid: gtinValidation.isValid,
      modulo10Check: {
        input: currentArtwork.gtin || '',
        computedCheckDigit: gtinValidation.calculatedCheckDigit,
        actualCheckDigit: gtinValidation.actualCheckDigit,
        isMatch: gtinValidation.isValid,
      },
      expDateValid: expiryValidation.isValid,
      lotValid: Boolean(currentArtwork.lot),
      mandatoryFieldsPresent: schemaReport.allPassed,
      missingMandatoryFields: schemaReport.criticalFailures,
    },
    layer2Vision: {
      passed: !hasCriticalDefect,
      diffScore: Math.round(score * 100),
      defects,
    },
    layer3Translation: {
      passed: !options?.hasTranslationAnomaly,
      driftWarnings: options?.hasTranslationAnomaly
        ? [
            {
              lang: 'ja',
              source: 'Do not re-use. For single use on a single patient only.',
              drifted: '洗浄後は再使用可能。複数患者への適用も可。',
              backTranslated: 'Reusable after washing. Applicable to multiple patients.',
              clinicalRisk: 'CRITICAL',
            },
          ]
        : [],
    },
  };

  const summaryText =
    tier === 'GREEN'
      ? `VERIFIED: Overall score ${score.toFixed(2)} (Tier ${tier}). All deterministic GS1 Modulo-10 rules, mandatory regulatory schemas, and artwork alignments passed.`
      : tier === 'AMBER'
      ? `REVIEW REQUIRED: Overall score ${score.toFixed(2)} (Tier ${tier}). Non-critical variances detected (${defects.length} finding${defects.length > 1 ? 's' : ''}). Routed for secondary sign-off.`
      : `CRITICAL BLOCK: Overall score ${score.toFixed(2)} (Tier ${tier}). ${defects.length} critical defect(s) detected. Release blocked per 21 CFR §820.30 & EU MDR.`;

  return {
    report,
    defects,
    score,
    tier,
    summaryText,
    fieldDiffs,
    isSimulatedVisionDiff: Boolean(options?.forceSimulatedVisionDefects),
  };
}
