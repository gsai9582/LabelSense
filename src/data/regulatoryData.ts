import { RegulatoryUpdate } from '../types';

export const REGULATORY_RADAR_UPDATES: RegulatoryUpdate[] = [
  {
    id: 'REG-2026-MDR-01',
    authority: 'EU MDR',
    standard: 'EU MDR 2017/745 Annex I Ch III',
    clause: '§23.2(q)',
    title: 'Mandatory Sterile Barrier Symbol Integration',
    summary: 'Sterile medical packaging must clearly indicate single or double sterile barrier system using ISO 15223-1 symbols on primary pouch layer.',
    severity: 'CRITICAL',
    effectiveDate: '2026-05-26',
    deviceClasses: ['Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    markets: ['EU', 'UK'],
    status: 'ACTIVE',
    extractedRules: [
      {
        id: 'R-MDR-23.2-01',
        ruleCode: 'MDR-BARRIER-REQ',
        clauseRef: 'EU MDR Annex I §23.2(q)',
        description: 'Primary sterile packaging must display compliant sterile barrier symbol with minimum 1.6 aspect ratio.',
        assertionType: 'ASPECT_RATIO',
        machineLogic: 'ASSERT symbol_exists("STERILE_BARRIER") AND aspect_ratio("STERILE_BARRIER") >= 1.55',
        isMandatory: true,
      },
      {
        id: 'R-MDR-23.2-02',
        ruleCode: 'MDR-NOTIFIED-BODY',
        clauseRef: 'EU MDR Annex I §23.2(c)',
        description: 'Class IIa/IIb/III labels marketed in EU must carry CE mark accompanied by 4-digit Notified Body ID.',
        assertionType: 'PRESENCE',
        machineLogic: 'ASSERT symbol_exists("CE_MARK") AND matches(notified_body_id, "^\\d{4}$")',
        isMandatory: true,
      }
    ]
  },
  {
    id: 'REG-2026-FDA-02',
    authority: 'FDA',
    standard: '21 CFR Part 801 (UDI Rule)',
    clause: '§801.40',
    title: 'Form of a Unique Device Identifier (AIDC & HRI)',
    summary: 'The UDI must be presented in two forms on the label: Automatic Identification and Data Capture (AIDC, e.g. DataMatrix) and Human Readable Interpretation (HRI) with genuine Modulo-10 check digit.',
    severity: 'CRITICAL',
    effectiveDate: '2026-01-15',
    deviceClasses: ['Class I', 'Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    markets: ['US'],
    status: 'ACTIVE',
    extractedRules: [
      {
        id: 'R-FDA-801-01',
        ruleCode: 'FDA-UDI-MOD10',
        clauseRef: '21 CFR §801.40(a)',
        description: 'GS1 GTIN-14 check digit must be mathematically verified using standard Modulo-10 calculation algorithm.',
        assertionType: 'FORMAT',
        machineLogic: 'ASSERT modulo10_check(extract_gtin(udi_string)) == TRUE',
        isMandatory: true,
      },
      {
        id: 'R-FDA-801-02',
        ruleCode: 'FDA-QUIET-ZONE',
        clauseRef: 'GS1 GenSpecs §5.2.1 / 21 CFR §801.40',
        description: '2D DataMatrix barcode must maintain minimum 1X quiet zone margin clear of text and borders.',
        assertionType: 'LEGIBILITY',
        machineLogic: 'ASSERT quiet_zone_pixels(datamatrix) >= 8',
        isMandatory: true,
      }
    ]
  },
  {
    id: 'REG-2026-ISO-03',
    authority: 'ISO',
    standard: 'ISO 15223-1:2021',
    clause: 'Clause 5.7.7',
    title: 'Medical Device "MD" Identification Graphic',
    summary: 'Specifies the standardized "MD" framed symbol for indicating that the product is a medical device, avoiding language-dependent terminology.',
    severity: 'MAJOR',
    effectiveDate: '2025-11-01',
    deviceClasses: ['Class I', 'Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    markets: ['EU', 'JP', 'UK', 'US'],
    status: 'ACTIVE',
    extractedRules: [
      {
        id: 'R-ISO-15223-01',
        ruleCode: 'ISO-MD-SYMBOL',
        clauseRef: 'ISO 15223-1 Ref 5.7.7',
        description: 'Label must include the framed MD symbol with enclosed text centered and minimum font height 1.2mm.',
        assertionType: 'PRESENCE',
        machineLogic: 'ASSERT symbol_exists("MEDICAL_DEVICE")',
        isMandatory: true,
      }
    ]
  },
  {
    id: 'REG-2026-ISO-04',
    authority: 'ISO',
    standard: 'ISO 20417:2026',
    clause: 'Clause 6.1.3 & 6.4',
    title: 'Information Supplied by the Manufacturer - Legibility & e-IFU',
    summary: 'Mandates minimum font height of 1.2 mm (3.4pt) for critical warnings, storage conditions, and expiry statements, plus standardized electronic IFU link indicators.',
    severity: 'MAJOR',
    effectiveDate: '2026-08-01',
    deviceClasses: ['Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    markets: ['US', 'EU', 'JP'],
    status: 'ACTIVE',
    extractedRules: [
      {
        id: 'R-ISO-20417-01',
        ruleCode: 'ISO-MIN-LEGIBILITY',
        clauseRef: 'ISO 20417:2026 §6.1.3',
        description: 'All mandatory text elements must meet or exceed minimum optical print height of 1.2 mm.',
        assertionType: 'LEGIBILITY',
        machineLogic: 'ASSERT min_font_height_mm(label_text_nodes) >= 1.20',
        isMandatory: true,
      }
    ]
  },
  {
    id: 'REG-2026-IMDRF-05',
    authority: 'IMDRF',
    standard: 'IMDRF N52 (UDI Guidance)',
    clause: 'Section 4.3.2',
    title: 'Global Harmonization of Date Formats in UDI',
    summary: 'Recommends strict harmonization of expiration dates to YYYY-MM-DD in HRI and YYMMDD in GS1 AIDC AI (17).',
    severity: 'INFORMATIONAL',
    effectiveDate: '2026-03-30',
    deviceClasses: ['Class I', 'Class IIa', 'Class IIb', 'Class III'],
    markets: ['US', 'EU', 'JP', 'UK'],
    status: 'ACTIVE',
    extractedRules: [
      {
        id: 'R-IMDRF-DATE-01',
        ruleCode: 'IMDRF-DATE-SYNC',
        clauseRef: 'IMDRF N52 §4.3.2',
        description: 'HRI date on packaging must exactly synchronize with parsed GS1 Application Identifier (17).',
        assertionType: 'FORMAT',
        machineLogic: 'ASSERT format_date(extract_ai17(barcode)) == parse_hri(label_exp_date)',
        isMandatory: true,
      }
    ]
  }
];
