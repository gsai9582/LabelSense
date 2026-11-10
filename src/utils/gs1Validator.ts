/**
 * GS1 General Specifications - Modulo 10 Check Digit Calculator & Validator
 * Used for GTIN-8, GTIN-12, GTIN-13, GTIN-14, SSCC, and GSIN.
 * Weight pattern: alternating 3 and 1 from right to left (excluding check digit).
 */

export interface GS1ParseResult {
  raw: string;
  isValid: boolean;
  gtin?: string;
  gtinCheckDigitCalculated?: number;
  gtinCheckDigitActual?: number;
  isGtinCheckDigitValid: boolean;
  expiryDateRaw?: string; // YYMMDD
  expiryDateParsed?: string; // YYYY-MM-DD
  isExpiryValid: boolean;
  lot?: string;
  serialNumber?: string;
  errors: string[];
  warnings: string[];
}

/**
 * Computes the official GS1 Modulo-10 check digit for a numeric string of length N-1.
 * For a 14-digit GTIN, input is the first 13 digits.
 * Steps:
 * 1. Multiply odd position digits from right to left by 3, even by 1.
 * 2. Sum the products.
 * 3. The check digit is the smallest number which, when added to the sum, produces a multiple of 10.
 */
export function calculateGS1Modulo10(numericStringWithoutCheckDigit: string): number {
  const digits = numericStringWithoutCheckDigit.replace(/\D/g, '');
  if (!digits) return -1;

  let sum = 0;
  // Starting from rightmost digit of the payload (position 1 from right)
  let weight = 3;

  for (let i = digits.length - 1; i >= 0; i--) {
    const digit = parseInt(digits[i], 10);
    sum += digit * weight;
    weight = weight === 3 ? 1 : 3;
  }

  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Validates a 14-digit GTIN (or 13/12 digit) against its check digit.
 */
export function validateGTIN(gtin: string): { isValid: boolean; calculated: number; actual: number } {
  const clean = gtin.replace(/\D/g, '');
  if (clean.length < 8 || clean.length > 14) {
    return { isValid: false, calculated: -1, actual: -1 };
  }

  const payload = clean.slice(0, -1);
  const actualCheckDigit = parseInt(clean.slice(-1), 10);
  const calculated = calculateGS1Modulo10(payload);

  return {
    isValid: calculated === actualCheckDigit,
    calculated,
    actual: actualCheckDigit,
  };
}

/**
 * Validates GS1 Expiration date in format YYMMDD.
 * Note: If DD is '00', GS1 rules interpret this as the last calendar day of month MM.
 */
export function validateGS1ExpiryDate(yymmdd: string): { isValid: boolean; parsedDate: string; message: string } {
  const clean = yymmdd.replace(/\D/g, '');
  if (clean.length !== 6) {
    return { isValid: false, parsedDate: '', message: 'Expiry date must be exactly 6 digits (YYMMDD)' };
  }

  const yy = parseInt(clean.substring(0, 2), 10);
  const mm = parseInt(clean.substring(2, 4), 10);
  let dd = parseInt(clean.substring(4, 6), 10);

  if (mm < 1 || mm > 12) {
    return { isValid: false, parsedDate: '', message: `Invalid month '${mm}'. Must be 01-12.` };
  }

  // Assuming 2000-2099 for MedTech devices
  const year = 2000 + yy;

  // If DD is 00, it represents the last day of the month
  if (dd === 0) {
    const lastDay = new Date(year, mm, 0).getDate();
    dd = lastDay;
  } else {
    const maxDays = new Date(year, mm, 0).getDate();
    if (dd < 1 || dd > maxDays) {
      return { isValid: false, parsedDate: '', message: `Invalid day '${dd}' for year ${year}, month ${mm}.` };
    }
  }

  const formattedMonth = mm < 10 ? `0${mm}` : `${mm}`;
  const formattedDay = dd < 10 ? `0${dd}` : `${dd}`;
  const isoDate = `${year}-${formattedMonth}-${formattedDay}`;

  return {
    isValid: true,
    parsedDate: isoDate,
    message: 'Valid GS1 Expiry Date',
  };
}

/**
 * Parses a standard GS1 UDI composite string:
 * e.g., "(01)00840123456789(17)281231(10)LOT-2026A(21)SN-99882"
 * or without parens if using standard AI delimitation.
 */
export function parseGS1UDI(barcodeString: string): GS1ParseResult {
  const result: GS1ParseResult = {
    raw: barcodeString,
    isValid: true,
    isGtinCheckDigitValid: false,
    isExpiryValid: false,
    errors: [],
    warnings: [],
  };

  // Pattern matching for AIs (01), (17), (10), (21)
  const gtinMatch = barcodeString.match(/\(01\)(\d{14})/);
  const expMatch = barcodeString.match(/\(17\)(\d{6})/);
  const lotMatch = barcodeString.match(/\(10\)([A-Za-z0-9\-_]+)(?=\(|$)/);
  const snMatch = barcodeString.match(/\(21\)([A-Za-z0-9\-_]+)(?=\(|$)/);

  if (gtinMatch) {
    result.gtin = gtinMatch[1];
    const check = validateGTIN(result.gtin);
    result.gtinCheckDigitCalculated = check.calculated;
    result.gtinCheckDigitActual = check.actual;
    result.isGtinCheckDigitValid = check.isValid;

    if (!check.isValid) {
      result.isValid = false;
      result.errors.push(
        `GS1 Modulo-10 Check Digit Mismatch: GTIN '${result.gtin}' ends with '${check.actual}', but algorithm calculated '${check.calculated}'.`
      );
    }
  } else {
    result.isValid = false;
    result.errors.push('Missing mandatory Application Identifier (01) GTIN-14 in UDI-DI.');
  }

  if (expMatch) {
    result.expiryDateRaw = expMatch[1];
    const expCheck = validateGS1ExpiryDate(result.expiryDateRaw);
    result.isExpiryValid = expCheck.isValid;
    result.expiryDateParsed = expCheck.parsedDate;

    if (!expCheck.isValid) {
      result.isValid = false;
      result.errors.push(`AI (17) Date validation failed: ${expCheck.message}`);
    }
  } else {
    result.warnings.push('AI (17) Expiry Date not present in composite UDI-PI string.');
  }

  if (lotMatch) {
    result.lot = lotMatch[1];
  } else {
    result.warnings.push('AI (10) Batch/Lot not present in composite UDI string.');
  }

  if (snMatch) {
    result.serialNumber = snMatch[1];
  }

  return result;
}
