/**
 * GS1 General Specifications - Modulo-10 Check Digit Calculator & Validator
 * Pure ESM module for universal Node.js test execution across Node 18, 20, 22, 24.
 */

export function calculateGS1Modulo10(numericStringWithoutCheckDigit) {
  const digits = (numericStringWithoutCheckDigit || '').replace(/\D/g, '');
  if (!digits || digits.length === 0) {
    return { checkDigit: -1, weightedSum: -1, nextMultipleOf10: -1 };
  }

  let sum = 0;
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

export function getGTINFormat(cleanDigits) {
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

export function validateGTIN(gtin) {
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
      errorMessage: `Invalid GTIN length: ${clean.length} digits. Must be exactly 8, 12, 13, or 14 digits.`,
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
      : `Check digit mismatch for ${format}: Expected '${calculated}', found '${actualCheckDigit}'.`,
  };
}

export function validateGS1ExpiryDate(rawDate) {
  const clean = (rawDate || '').replace(/\D/g, '');

  let yy, mm, dd;
  let isEndOfMonth = false;

  if (clean.length === 6) {
    yy = parseInt(clean.substring(0, 2), 10);
    mm = parseInt(clean.substring(2, 4), 10);
    dd = parseInt(clean.substring(4, 6), 10);
  } else if (clean.length === 8) {
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
      message: `Invalid date length (${clean.length} digits). Must be YYMMDD or YYYYMMDD.`,
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
      message: `Invalid month '${mm}'. Must be 01-12.`,
    };
  }

  const fullYear = 2000 + yy;
  const daysInMonth = new Date(fullYear, mm, 0).getDate();

  if (dd === 0) {
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

export function parseGS1UDI(barcodeString) {
  const raw = (barcodeString || '').trim();
  const result = {
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

  if (raw.includes('(') && raw.includes(')')) {
    const aiRegex = /\((\d{2,4})\)([^()]+)/g;
    let match;

    while ((match = aiRegex.exec(raw)) !== null) {
      const ai = match[1];
      const val = match[2].trim();

      switch (ai) {
        case '01':
          result.gtin = val;
          result.parsedAIs.push({ ai: '01', title: 'GTIN', value: val, raw: `(01)${val}` });
          break;
        case '17':
          result.expiryDateRaw = val;
          result.parsedAIs.push({ ai: '17', title: 'EXPIRY', value: val, raw: `(17)${val}` });
          break;
        case '10':
          result.lot = val;
          result.parsedAIs.push({ ai: '10', title: 'BATCH/LOT', value: val, raw: `(10)${val}` });
          break;
        case '21':
          result.serialNumber = val;
          result.parsedAIs.push({ ai: '21', title: 'SERIAL', value: val, raw: `(21)${val}` });
          break;
        default:
          result.parsedAIs.push({ ai, title: `AI (${ai})`, value: val, raw: `(${ai})${val}` });
      }
    }
  } else {
    let cursor = 0;
    while (cursor < raw.length) {
      if (raw.startsWith('01', cursor) && raw.length >= cursor + 16) {
        const val = raw.substring(cursor + 2, cursor + 16);
        result.gtin = val;
        result.parsedAIs.push({ ai: '01', title: 'GTIN', value: val, raw: `01${val}` });
        cursor += 16;
      } else if (raw.startsWith('17', cursor) && raw.length >= cursor + 8) {
        const val = raw.substring(cursor + 2, cursor + 8);
        result.expiryDateRaw = val;
        result.parsedAIs.push({ ai: '17', title: 'EXPIRY', value: val, raw: `17${val}` });
        cursor += 8;
      } else if (raw.startsWith('10', cursor)) {
        const val = raw.substring(cursor + 2);
        result.lot = val;
        result.parsedAIs.push({ ai: '10', title: 'BATCH/LOT', value: val, raw: `10${val}` });
        break;
      } else {
        break;
      }
    }
  }

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

  return result;
}

export function validateMandatoryLabelSchema(artwork) {
  const deviceClass = artwork.deviceClass || 'Class IIa';
  const symbols = artwork.symbols || [];

  const checks = [
    {
      id: 'SCH-01',
      name: 'Legal Manufacturer Identification',
      clause: 'EU MDR Annex I §23.2(a) / 21 CFR §801.1',
      passed: Boolean(artwork.manufacturerName && artwork.manufacturerName.trim().length > 0),
      severity: 'CRITICAL',
    },
    {
      id: 'SCH-02',
      name: 'Manufacturer Physical Address',
      clause: 'EU MDR Annex I §23.2(a) / 21 CFR §801.1',
      passed: Boolean(artwork.manufacturerAddress && artwork.manufacturerAddress.trim().length > 0),
      severity: 'CRITICAL',
    },
    {
      id: 'SCH-03',
      name: 'Product Catalog / Model Identification (REF)',
      clause: 'ISO 15223-1 Ref 5.1.6 / 21 CFR §801.40',
      passed: Boolean(artwork.sku && artwork.sku.trim().length > 0 && symbols.includes('REF')),
      severity: 'CRITICAL',
    },
    {
      id: 'SCH-04',
      name: 'Batch / Lot Designation (LOT)',
      clause: 'ISO 15223-1 Ref 5.1.5 / 21 CFR §820.65',
      passed: Boolean(artwork.lot && artwork.lot.trim().length > 0 && symbols.includes('LOT')),
      severity: 'CRITICAL',
    },
    {
      id: 'SCH-05',
      name: 'Use-by / Expiration Date',
      clause: 'ISO 15223-1 Ref 5.1.4 / EU MDR §23.2(i)',
      passed: Boolean(artwork.expDate && symbols.includes('USE_BY')),
      severity: 'CRITICAL',
    },
    {
      id: 'SCH-06',
      name: 'Medical Device Standard Symbol (MD)',
      clause: 'ISO 15223-1 Ref 5.7.7 / EU MDR §23.2(e)',
      passed: symbols.includes('MEDICAL_DEVICE'),
      severity: 'MAJOR',
    },
    {
      id: 'SCH-07',
      name: 'Sterilization Method Indicator',
      clause: 'ISO 15223-1 Ref 5.2.3 / EU MDR §23.2(l)',
      passed: symbols.some(s => s.startsWith('STERILE')),
      severity: 'CRITICAL',
    },
    {
      id: 'SCH-08',
      name: 'Sterile Barrier System Indicator',
      clause: 'ISO 15223-1 Ref 5.2.11 / ISO 11607-1',
      passed: symbols.includes('STERILE_BARRIER'),
      severity: 'MAJOR',
    },
    {
      id: 'SCH-09',
      name: 'CE Marking with Notified Body Identifier',
      clause: 'EU MDR Article 20 & Annex V',
      passed: symbols.includes('CE_MARK'),
      severity: 'CRITICAL',
    },
    {
      id: 'SCH-10',
      name: 'Do Not Re-Use / Single Patient Restriction',
      clause: 'ISO 15223-1 Ref 5.4.2 / EU MDR §23.2(n)',
      passed: symbols.includes('SINGLE_USE'),
      severity: 'MAJOR',
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
