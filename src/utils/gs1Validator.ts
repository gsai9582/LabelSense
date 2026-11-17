/**
 * GS1 General Specifications - Modulo-10 Check Digit Calculator & Validator
 * Conforms to GS1 General Specifications Section 7.9.1 (Check Digit Calculation)
 * Supports GTIN-8, GTIN-12 (UPC-A), GTIN-13 (EAN-13), GTIN-14, SSCC, and GSIN.
 * 
 * Algorithm:
 * 1. Starting from the rightmost digit of the payload (excluding check digit),
 *    multiply alternating digits by 3 and 1 (weight 3 for position 1 from right, 1 for position 2, etc.).
 * 2. Sum the products.
 * 3. The check digit is the difference between this sum and the next multiple of 10.
 *    If remainder is 0, check digit is 0.
 */

export type GTINFormat = 'GTIN-8' | 'GTIN-12' | 'GTIN-13' | 'GTIN-14' | 'INVALID';

export interface GTINValidationResult {
  isValid: boolean;
  cleanGTIN: string;
  format: GTINFormat;
  payload: string; // Digits without check digit
  calculatedCheckDigit: number;
  actualCheckDigit: number;
  weightedSum: number;
  nextMultipleOf10: number;
  errorMessage?: string;
}

export interface ExpiryDateValidationResult {
  isValid: boolean;
  raw: string;
  parsedDate: string; // ISO format: YYYY-MM-DD
  year: number;
  month: number;
  day: number;
  isEndOfMonthDay: boolean; // True if input DD was '00' (GS1 standard for last day of month)
  message: string;
}

export interface ParsedApplicationIdentifier {
  ai: string;
  title: string;
  value: string;
  description: string;
  raw: string;
}

export interface GS1ParseResult {
  raw: string;
  isValid: boolean;
  gtin?: string;
  gtinValidation?: GTINValidationResult;
  expiryDateRaw?: string; // YYMMDD
  expiryDateValidation?: ExpiryDateValidationResult;
  lot?: string;
  serialNumber?: string;
  manufacturingDateRaw?: string;
  additionalProductId?: string;
  parsedAIs: ParsedApplicationIdentifier[];
  errors: string[];
  warnings: string[];
}

export interface MandatorySchemaCheck {
  id: string;
  name: string;
  field: string;
  clause: string;
  passed: boolean;
  actualValue?: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  message: string;
}

export interface MandatoryFieldValidationReport {
  deviceClass: string;
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  checks: MandatorySchemaCheck[];
  criticalFailures: string[];
}

/**
 * Computes the official GS1 Modulo-10 check digit for a numeric string of length N-1.
 * Returns -1 if the input is empty or contains non-numeric characters.
 */
export function calculateGS1Modulo10(numericStringWithoutCheckDigit: string): {
  checkDigit: number;
  weightedSum: number;
  nextMultipleOf10: number;
} {
  const digits = numericStringWithoutCheckDigit.replace(/\D/g, '');
  if (!digits || digits.length === 0) {
    return { checkDigit: -1, weightedSum: -1, nextMultipleOf10: -1 };
  }

  let sum = 0;
  // Starting from rightmost digit of the payload (position 2 of the complete barcode, which has weight 3)
  let weight = 3;

  for (let i = digits.length - 1; i >= 0; i--) {
    const digit = parseInt(digits[i], 10);
    sum += digit * weight;
    weight = weight === 3 ? 1 : 3;
  }

  const remainder = sum % 10;
  const checkDigit = remainder === 0 ? 0 : 10 - remainder;
  const nextMultipleOf10 = remainder === 0 ? sum : sum + (10 - remainder);

  return {
    checkDigit,
    weightedSum: sum,
    nextMultipleOf10,
  };
}

/**
 * Determines the specific GTIN format based on length.
 */
export function getGTINFormat(cleanDigits: string): GTINFormat {
  switch (cleanDigits.length) {
    case 8:
      return 'GTIN-8';
    case 12:
      return 'GTIN-12';
    case 13:
      return 'GTIN-13';
    case 14:
      return 'GTIN-14';
    default:
      return 'INVALID';
  }
}

/**
 * Validates a GTIN string against length requirements (8, 12, 13, 14 digits) and its Modulo-10 check digit.
 */
export function validateGTIN(gtin: string): GTINValidationResult {
  const clean = (gtin || '').replace(/\D/g, '');
  const format = getGTINFormat(clean);

  if (format === 'INVALID') {
    return {
      isValid: false,
      cleanGTIN: clean,
      format: 'INVALID',
      payload: '',
      calculatedCheckDigit: -1,
      actualCheckDigit: -1,
      weightedSum: -1,
      nextMultipleOf10: -1,
      errorMessage: `Invalid GTIN length: ${clean.length} digits. Must be exactly 8 (GTIN-8), 12 (GTIN-12), 13 (GTIN-13), or 14 (GTIN-14) digits.`,
    };
  }

  const payload = clean.slice(0, -1);
  const actualCheckDigit = parseInt(clean.slice(-1), 10);
  const { checkDigit: calculated, weightedSum, nextMultipleOf10 } = calculateGS1Modulo10(payload);

  const isValid = calculated === actualCheckDigit;

  return {
    isValid,
    cleanGTIN: clean,
    format,
    payload,
    calculatedCheckDigit: calculated,
    actualCheckDigit,
    weightedSum,
    nextMultipleOf10,
    errorMessage: isValid
      ? undefined
      : `Check digit mismatch for ${format}: Expected '${calculated}' (calculated via Modulo-10), but found '${actualCheckDigit}' on artwork.`,
  };
}

/**
 * Validates GS1 Expiration date in format YYMMDD or YYYY-MM-DD.
 * Per GS1 General Specifications §3.8.3:
 * - If DD is '00', it represents the last calendar day of month MM.
 * - Month MM must be between 01 and 12.
 * - Century window: uses 2000-2099 for modern medical device identification.
 */
export function validateGS1ExpiryDate(rawDate: string): ExpiryDateValidationResult {
  const clean = (rawDate || '').replace(/\D/g, '');

  let yy: number;
  let mm: number;
  let dd: number;
  let isEndOfMonth = false;

  if (clean.length === 6) {
    // YYMMDD format
    yy = parseInt(clean.substring(0, 2), 10);
    mm = parseInt(clean.substring(2, 4), 10);
    dd = parseInt(clean.substring(4, 6), 10);
  } else if (clean.length === 8) {
    // YYYYMMDD format
    const yyyy = parseInt(clean.substring(0, 4), 10);
    yy = yyyy % 100;
    mm = parseInt(clean.substring(4, 6), 10);
    dd = parseInt(clean.substring(6, 8), 10);
  } else {
    return {
      isValid: false,
      raw: rawDate,
      parsedDate: '',
      year: 0,
      month: 0,
      day: 0,
      isEndOfMonthDay: false,
      message: `Invalid date length (${clean.length} digits). Must be YYMMDD (6 digits) or YYYYMMDD (8 digits).`,
    };
  }

  if (isNaN(mm) || mm < 1 || mm > 12) {
    return {
      isValid: false,
      raw: rawDate,
      parsedDate: '',
      year: 0,
      month: mm,
      day: dd,
      isEndOfMonthDay: false,
      message: `Invalid month '${mm}'. Month must be in the range 01-12.`,
    };
  }

  // Assuming 2000-2099 for current medical device product shelf lives
  const fullYear = 2000 + yy;

  // Leap-year aware calculation of max days in month mm of fullYear
  // new Date(fullYear, mm, 0).getDate() gives the total days in month mm (1-indexed)
  const daysInMonth = new Date(fullYear, mm, 0).getDate();

  if (dd === 0) {
    // GS1 rule: DD = 00 signifies the last day of month MM
    dd = daysInMonth;
    isEndOfMonth = true;
  } else if (isNaN(dd) || dd < 1 || dd > daysInMonth) {
    return {
      isValid: false,
      raw: rawDate,
      parsedDate: '',
      year: fullYear,
      month: mm,
      day: dd,
      isEndOfMonthDay: false,
      message: `Invalid day '${dd}' for ${fullYear}-${String(mm).padStart(2, '0')}. Maximum allowed days is ${daysInMonth}.`,
    };
  }

  const formattedMonth = String(mm).padStart(2, '0');
  const formattedDay = String(dd).padStart(2, '0');
  const isoDate = `${fullYear}-${formattedMonth}-${formattedDay}`;

  return {
    isValid: true,
    raw: rawDate,
    parsedDate: isoDate,
    year: fullYear,
    month: mm,
    day: dd,
    isEndOfMonthDay: isEndOfMonth,
    message: isEndOfMonth
      ? `Valid GS1 Date (Day '00' resolved to end-of-month: ${isoDate})`
      : `Valid GS1 Date: ${isoDate}`,
  };
}

/**
 * Parses a standard GS1 UDI barcode string (bracketed or raw).
 * Examples:
 * - Bracketed: "(01)00840123456789(17)281231(10)LOT-2026B14(21)SN-942819"
 * - Raw stream: "01008401234567891728123110LOT-2026B14"
 */
export function parseGS1UDI(barcodeString: string): GS1ParseResult {
  const raw = (barcodeString || '').trim();
  const result: GS1ParseResult = {
    raw,
    isValid: true,
    parsedAIs: [],
    errors: [],
    warnings: [],
  };

  if (!raw) {
    result.isValid = false;
    result.errors.push('Barcode string is empty.');
    return result;
  }

  // Bracketed format parsing: (AI)Value
  if (raw.includes('(') && raw.includes(')')) {
    const aiRegex = /\((\d{2,4})\)([^()]+)/g;
    let match: RegExpExecArray | null;

    while ((match = aiRegex.exec(raw)) !== null) {
      const ai = match[1];
      const val = match[2].trim();

      switch (ai) {
        case '01': {
          result.gtin = val;
          result.parsedAIs.push({
            ai: '01',
            title: 'GTIN',
            value: val,
            description: 'Global Trade Item Number',
            raw: `(01)${val}`,
          });
          break;
        }
        case '17': {
          result.expiryDateRaw = val;
          result.parsedAIs.push({
            ai: '17',
            title: 'EXPIRY',
            value: val,
            description: 'Expiration Date (YYMMDD)',
            raw: `(17)${val}`,
          });
          break;
        }
        case '10': {
          result.lot = val;
          result.parsedAIs.push({
            ai: '10',
            title: 'BATCH/LOT',
            value: val,
            description: 'Batch or Lot Number',
            raw: `(10)${val}`,
          });
          break;
        }
        case '21': {
          result.serialNumber = val;
          result.parsedAIs.push({
            ai: '21',
            title: 'SERIAL',
            value: val,
            description: 'Serial Number',
            raw: `(21)${val}`,
          });
          break;
        }
        case '11': {
          result.manufacturingDateRaw = val;
          result.parsedAIs.push({
            ai: '11',
            title: 'MFG DATE',
            value: val,
            description: 'Production Date (YYMMDD)',
            raw: `(11)${val}`,
          });
          break;
        }
        case '240': {
          result.additionalProductId = val;
          result.parsedAIs.push({
            ai: '240',
            title: 'ADDITIONAL ID',
            value: val,
            description: 'Additional Product Identification',
            raw: `(240)${val}`,
          });
          break;
        }
        default: {
          result.parsedAIs.push({
            ai,
            title: `AI (${ai})`,
            value: val,
            description: `Application Identifier ${ai}`,
            raw: `(${ai})${val}`,
          });
        }
      }
    }
  } else {
    // Unbracketed format stream: e.g. 01008401234567891728123110LOT-123
    let cursor = 0;
    while (cursor < raw.length) {
      if (raw.startsWith('01', cursor) && raw.length >= cursor + 16) {
        const val = raw.substring(cursor + 2, cursor + 16);
        result.gtin = val;
        result.parsedAIs.push({
          ai: '01',
          title: 'GTIN',
          value: val,
          description: 'Global Trade Item Number',
          raw: `01${val}`,
        });
        cursor += 16;
      } else if (raw.startsWith('17', cursor) && raw.length >= cursor + 8) {
        const val = raw.substring(cursor + 2, cursor + 8);
        result.expiryDateRaw = val;
        result.parsedAIs.push({
          ai: '17',
          title: 'EXPIRY',
          value: val,
          description: 'Expiration Date (YYMMDD)',
          raw: `17${val}`,
        });
        cursor += 8;
      } else if (raw.startsWith('11', cursor) && raw.length >= cursor + 8) {
        const val = raw.substring(cursor + 2, cursor + 8);
        result.manufacturingDateRaw = val;
        result.parsedAIs.push({
          ai: '11',
          title: 'MFG DATE',
          value: val,
          description: 'Production Date (YYMMDD)',
          raw: `11${val}`,
        });
        cursor += 8;
      } else if (raw.startsWith('10', cursor)) {
        // AI 10 is variable length up to 20 chars; reads remainder or until next known AI
        const val = raw.substring(cursor + 2);
        result.lot = val;
        result.parsedAIs.push({
          ai: '10',
          title: 'BATCH/LOT',
          value: val,
          description: 'Batch or Lot Number',
          raw: `10${val}`,
        });
        break;
      } else {
        // Unknown or trailing token
        result.warnings.push(`Unparsed trailing segment at index ${cursor}: '${raw.substring(cursor)}'`);
        break;
      }
    }
  }

  // Validate GTIN if present
  if (result.gtin) {
    const gtinVal = validateGTIN(result.gtin);
    result.gtinValidation = gtinVal;
    if (!gtinVal.isValid) {
      result.isValid = false;
      result.errors.push(`AI (01) GTIN Validation Failed: ${gtinVal.errorMessage}`);
    }
  } else {
    result.isValid = false;
    result.errors.push('Missing mandatory Application Identifier (01) GTIN in UDI barcode.');
  }

  // Validate Expiry Date if present
  if (result.expiryDateRaw) {
    const expVal = validateGS1ExpiryDate(result.expiryDateRaw);
    result.expiryDateValidation = expVal;
    if (!expVal.isValid) {
      result.isValid = false;
      result.errors.push(`AI (17) Expiry Date Validation Failed: ${expVal.message}`);
    }
  } else {
    result.warnings.push('Application Identifier (17) Expiration Date not present in barcode string.');
  }

  // Check Batch / Lot
  if (!result.lot && !result.serialNumber) {
    result.warnings.push('Neither Batch/Lot (AI 10) nor Serial Number (AI 21) was found in UDI string.');
  }

  return result;
}

/**
 * Validates mandatory labeling fields per Medical Device Regulations (EU MDR Annex I & FDA 21 CFR §801).
 */
export function validateMandatoryLabelSchema(artwork: {
  sku?: string;
  productName?: string;
  manufacturerName?: string;
  manufacturerAddress?: string;
  deviceClass?: string;
  symbols?: string[];
  gtin?: string;
  lot?: string;
  expDate?: string;
  storageTemp?: string;
  dimensions?: string;
}): MandatoryFieldValidationReport {
  const deviceClass = artwork.deviceClass || 'Class IIa';
  const symbols = artwork.symbols || [];

  const checks: MandatorySchemaCheck[] = [
    {
      id: 'SCH-01',
      name: 'Legal Manufacturer Identification',
      field: 'manufacturerName',
      clause: 'EU MDR Annex I §23.2(a) / 21 CFR §801.1',
      passed: Boolean(artwork.manufacturerName && artwork.manufacturerName.trim().length > 0),
      actualValue: artwork.manufacturerName,
      severity: 'CRITICAL',
      message: 'Manufacturer legal name must be present on the label.',
    },
    {
      id: 'SCH-02',
      name: 'Manufacturer Physical Address',
      field: 'manufacturerAddress',
      clause: 'EU MDR Annex I §23.2(a) / 21 CFR §801.1',
      passed: Boolean(artwork.manufacturerAddress && artwork.manufacturerAddress.trim().length > 0),
      actualValue: artwork.manufacturerAddress,
      severity: 'CRITICAL',
      message: 'Manufacturer physical place of business address is mandatory.',
    },
    {
      id: 'SCH-03',
      name: 'Product Catalog / Model Identification (REF)',
      field: 'sku',
      clause: 'ISO 15223-1 Ref 5.1.6 / 21 CFR §801.40',
      passed: Boolean(artwork.sku && artwork.sku.trim().length > 0 && symbols.includes('REF')),
      actualValue: artwork.sku,
      severity: 'CRITICAL',
      message: 'Product catalog reference must be indicated alongside the ISO REF symbol.',
    },
    {
      id: 'SCH-04',
      name: 'Batch / Lot Designation (LOT)',
      field: 'lot',
      clause: 'ISO 15223-1 Ref 5.1.5 / 21 CFR §820.65',
      passed: Boolean(artwork.lot && artwork.lot.trim().length > 0 && symbols.includes('LOT')),
      actualValue: artwork.lot,
      severity: 'CRITICAL',
      message: 'Batch code or lot designation must be displayed alongside the ISO LOT symbol.',
    },
    {
      id: 'SCH-05',
      name: 'Use-by / Expiration Date',
      field: 'expDate',
      clause: 'ISO 15223-1 Ref 5.1.4 / EU MDR §23.2(i)',
      passed: Boolean(artwork.expDate && symbols.includes('USE_BY')),
      actualValue: artwork.expDate,
      severity: 'CRITICAL',
      message: 'Expiration date must be clearly displayed alongside the ISO Use-by symbol.',
    },
    {
      id: 'SCH-06',
      name: 'Medical Device Standard Symbol (MD)',
      field: 'symbols',
      clause: 'ISO 15223-1 Ref 5.7.7 / EU MDR §23.2(e)',
      passed: symbols.includes('MEDICAL_DEVICE'),
      actualValue: symbols.includes('MEDICAL_DEVICE') ? 'Present' : 'Absent',
      severity: 'MAJOR',
      message: 'The harmonized "MD" symbol must indicate that the package contains a medical device.',
    },
    {
      id: 'SCH-07',
      name: 'Sterilization Method Indicator',
      field: 'symbols',
      clause: 'ISO 15223-1 Ref 5.2.3 / EU MDR §23.2(l)',
      passed: symbols.some(s => s.startsWith('STERILE')),
      actualValue: symbols.find(s => s.startsWith('STERILE')) || 'None',
      severity: 'CRITICAL',
      message: 'Sterile devices must indicate the sterilization method (e.g. STERILE EO, STERILE R).',
    },
    {
      id: 'SCH-08',
      name: 'Sterile Barrier System Indicator',
      field: 'symbols',
      clause: 'ISO 15223-1 Ref 5.2.11 / ISO 11607-1',
      passed: symbols.includes('STERILE_BARRIER'),
      actualValue: symbols.includes('STERILE_BARRIER') ? 'Present' : 'Absent',
      severity: 'MAJOR',
      message: 'Packaging must specify the sterile barrier system configuration.',
    },
    {
      id: 'SCH-09',
      name: 'CE Marking with Notified Body Identifier',
      field: 'symbols',
      clause: 'EU MDR Article 20 & Annex V',
      passed: symbols.includes('CE_MARK'),
      actualValue: symbols.includes('CE_MARK') ? 'CE 0123' : 'Absent',
      severity: 'CRITICAL',
      message: 'High-risk medical devices marketed in the EU must bear the CE mark with 4-digit Notified Body ID.',
    },
    {
      id: 'SCH-10',
      name: 'Do Not Re-Use / Single Patient Restriction',
      field: 'symbols',
      clause: 'ISO 15223-1 Ref 5.4.2 / EU MDR §23.2(n)',
      passed: symbols.includes('SINGLE_USE'),
      actualValue: symbols.includes('SINGLE_USE') ? 'Present' : 'Absent',
      severity: 'MAJOR',
      message: 'Single use devices must bear the standardized do-not-reuse symbol.',
    },
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const criticalFailures = checks.filter(c => !c.passed && c.severity === 'CRITICAL').map(c => c.name);

  return {
    deviceClass,
    allPassed: passedCount === checks.length,
    passedCount,
    totalCount: checks.length,
    checks,
    criticalFailures,
  };
}
