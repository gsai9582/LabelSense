import {
  LabelArtwork,
  DigitalThreadNode,
  DigitalThreadEdge,
  ECNScenario,
  ImpactAssessment,
  WhyTraceData,
  ValidationReport,
  DemoScenarioKey
} from '../types';

export const BASELINE_ARTWORK: LabelArtwork = {
  sku: 'Stent-CS400',
  productName: 'EverCor™ Drug-Eluting Coronary Stent System',
  tradeName: 'EverCor™ Sirolimus Coated CoCr Stent',
  deviceClass: 'Class III',
  sterileBarrier: 'Single Sterile Barrier System with Protective Inner Wrap',
  packagingLevel: 'Primary Pouch',
  revision: 'Rev. 4.2',
  gtin: '00840123456789', // 14 digits. Let's ensure calculated modulo 10 matches or explain!
  lot: 'LOT-2026B14',
  expDate: '2028-12-31', // or 281231 in UDI
  mfgDate: '2025-12-01',
  serialNumber: 'SN-942819',
  manufacturerName: 'VascularDynamics Medical AG',
  manufacturerAddress: 'Gewerbestrasse 18, 4057 Basel, Switzerland',
  euRepName: 'MedTech Europe Compliance BV',
  euRepAddress: 'Kingsfordweg 151, 1043 GR Amsterdam, Netherlands',
  symbols: ['STERILE_EO', 'REF', 'LOT', 'USE_BY', 'CONSULT_IFU', 'SINGLE_USE', 'MEDICAL_DEVICE', 'CE_MARK', 'TEMP_LIMIT', 'STERILE_BARRIER'],
  instructions: 'See Instructions for Use for contraindications, warnings, precautions and adverse events.',
  storageTemp: '15°C - 30°C (59°F - 86°F)',
  dimensions: '3.0 mm x 18 mm',
  udiDi: '(01)00840123456789',
  udiPi: '(17)281231(10)LOT-2026B14(21)SN-942819',
};

// Scenario A Artwork (Green Tier - minor address update, flawless pass)
export const SCENARIO_A_ARTWORK: LabelArtwork = {
  ...BASELINE_ARTWORK,
  revision: 'Rev. 4.3',
  manufacturerAddress: 'Gewerbestrasse 24, 4057 Basel, Switzerland',
};

// Scenario B Artwork (Red Tier - critical errors injected)
export const SCENARIO_B_ARTWORK: LabelArtwork = {
  ...BASELINE_ARTWORK,
  revision: 'Rev. 5.0-UNCHECKED',
  // GTIN check digit deliberately corrupted from valid check digit to 2
  gtin: '00840123456782', 
  udiDi: '(01)00840123456782',
  dimensions: '30 mm x 18 mm', // Decimal shift defect: 3.0 mm -> 30 mm (10x coronary perforation risk!)
  symbols: ['REF', 'LOT', 'USE_BY', 'CONSULT_IFU', 'SINGLE_USE'], // Missing STERILE_EO, MD, CE_MARK, STERILE_BARRIER!
};

// Scenario C Artwork (Amber Tier - translation drift & layout shift)
export const SCENARIO_C_ARTWORK: LabelArtwork = {
  ...BASELINE_ARTWORK,
  revision: 'Rev. 4.4-RC2',
  storageTemp: '15°C - 25°C (59°F - 77°F)', // Changed from 30°C without full stability doc update
};

// Digital Thread Graph Nodes & Edges
export const DIGITAL_THREAD_NODES: DigitalThreadNode[] = [
  // SKU Nodes
  { id: 'sku-stent', label: 'Stent-CS400 (Coronary)', type: 'SKU', code: 'SKU-001', status: 'COMPLIANT', x: 80, y: 180 },
  { id: 'sku-knee', label: 'OrthoKnee-XR2', type: 'SKU', code: 'SKU-002', status: 'COMPLIANT', x: 80, y: 320 },
  { id: 'sku-pump', label: 'Infusion-PCA60', type: 'SKU', code: 'SKU-003', status: 'COMPLIANT', x: 80, y: 460 },

  // Packaging Levels
  { id: 'pack-primary', label: 'Primary Pouch (Tyvek)', type: 'PACKAGING', code: 'PK-01', status: 'COMPLIANT', x: 280, y: 140 },
  { id: 'pack-secondary', label: 'Secondary Carton Box', type: 'PACKAGING', code: 'PK-02', status: 'COMPLIANT', x: 280, y: 260 },
  { id: 'pack-shipper', label: 'Shipper Corrugated Case', type: 'PACKAGING', code: 'PK-03', status: 'COMPLIANT', x: 280, y: 380 },

  // Target Markets
  { id: 'mkt-us', label: 'US Market (FDA 21 CFR)', type: 'MARKET', code: 'US', status: 'COMPLIANT', x: 480, y: 110 },
  { id: 'mkt-eu', label: 'EU Market (EU MDR 2017/745)', type: 'MARKET', code: 'EU', status: 'COMPLIANT', x: 480, y: 220 },
  { id: 'mkt-jp', label: 'Japan (PMDA / PAL)', type: 'MARKET', code: 'JP', status: 'NEEDS_REVIEW', x: 480, y: 330 },
  { id: 'mkt-uk', label: 'UK Market (MHRA UKCA)', type: 'MARKET', code: 'UK', status: 'COMPLIANT', x: 480, y: 440 },

  // Languages
  { id: 'lang-en', label: 'English (Source)', type: 'LANGUAGE', code: 'EN', status: 'COMPLIANT', x: 680, y: 90 },
  { id: 'lang-de', label: 'German (DE)', type: 'LANGUAGE', code: 'DE', status: 'COMPLIANT', x: 680, y: 170 },
  { id: 'lang-fr', label: 'French (FR)', type: 'LANGUAGE', code: 'FR', status: 'COMPLIANT', x: 680, y: 250 },
  { id: 'lang-ja', label: 'Japanese (JA)', type: 'LANGUAGE', code: 'JA', status: 'FLAGGED', x: 680, y: 330 },
  { id: 'lang-te', label: 'Telugu (TE)', type: 'LANGUAGE', code: 'TE', status: 'COMPLIANT', x: 680, y: 410 },

  // Artwork IDs
  { id: 'art-lbl-001', label: 'ART-EU-POUCH-400', type: 'ARTWORK', code: 'DWG-9021', status: 'COMPLIANT', x: 880, y: 140 },
  { id: 'art-lbl-002', label: 'ART-US-BOX-400', type: 'ARTWORK', code: 'DWG-9022', status: 'COMPLIANT', x: 880, y: 240 },
  { id: 'art-lbl-003', label: 'ART-JP-POUCH-400', type: 'ARTWORK', code: 'DWG-9023', status: 'FLAGGED', x: 880, y: 340 },
  { id: 'art-lbl-004', label: 'ART-GLOBAL-SHIP-400', type: 'ARTWORK', code: 'DWG-9024', status: 'COMPLIANT', x: 880, y: 440 },
];

export const DIGITAL_THREAD_EDGES: DigitalThreadEdge[] = [
  // Stent to Packaging
  { id: 'e1', source: 'sku-stent', target: 'pack-primary', label: 'Contained in' },
  { id: 'e2', source: 'sku-stent', target: 'pack-secondary', label: 'Packaged in' },
  { id: 'e3', source: 'sku-stent', target: 'pack-shipper', label: 'Bulk palletized' },

  // Knee to Packaging
  { id: 'e4', source: 'sku-knee', target: 'pack-primary' },
  { id: 'e5', source: 'sku-knee', target: 'pack-secondary' },

  // Pump to Packaging
  { id: 'e6', source: 'sku-pump', target: 'pack-secondary' },

  // Packaging to Markets
  { id: 'e7', source: 'pack-primary', target: 'mkt-eu', label: 'CE Approved' },
  { id: 'e8', source: 'pack-primary', target: 'mkt-us', label: 'PMA Approved' },
  { id: 'e9', source: 'pack-primary', target: 'mkt-jp', label: 'Shonin Pending' },
  { id: 'e10', source: 'pack-secondary', target: 'mkt-uk', label: 'UKCA Registered' },
  { id: 'e11', source: 'pack-secondary', target: 'mkt-eu' },

  // Markets to Languages
  { id: 'e12', source: 'mkt-us', target: 'lang-en', label: 'Mandatory' },
  { id: 'e13', source: 'mkt-eu', target: 'lang-en', label: 'Harmonized' },
  { id: 'e14', source: 'mkt-eu', target: 'lang-de', label: 'National Law' },
  { id: 'e15', source: 'mkt-eu', target: 'lang-fr', label: 'National Law' },
  { id: 'e16', source: 'mkt-jp', target: 'lang-ja', label: 'PMD Act Art.63' },
  { id: 'e17', source: 'mkt-eu', target: 'lang-te', label: 'Export Optional' },

  // Languages to Artworks
  { id: 'e18', source: 'lang-en', target: 'art-lbl-001' },
  { id: 'e19', source: 'lang-de', target: 'art-lbl-001' },
  { id: 'e20', source: 'lang-fr', target: 'art-lbl-001' },
  { id: 'e21', source: 'lang-en', target: 'art-lbl-002' },
  { id: 'e22', source: 'lang-ja', target: 'art-lbl-003', isImpacted: true },
  { id: 'e23', source: 'lang-en', target: 'art-lbl-004' },
];

export const ECN_SCENARIOS: ECNScenario[] = [
  {
    id: 'ECN-2026-S01',
    title: 'Shelf-Life Stability Extension (24 to 36 Months)',
    category: 'SHELF_LIFE',
    targetSku: 'Stent-CS400',
    description: 'Real-time 3-year aging stability testing successfully verified per ASTM F1980. Update UDI AI (17) date calculator and primary/secondary artwork shelf-life statements.',
    changes: [
      {
        field: 'Shelf Life',
        oldValue: '24 Months (Exp: 2027-12-31)',
        newValue: '36 Months (Exp: 2028-12-31)',
        reason: 'Accelerated & real-time stability protocol STP-2025-99 validated barrier seal integrity.',
      },
      {
        field: 'UDI-PI Expiry AI (17)',
        oldValue: '271231',
        newValue: '281231',
        reason: 'GS1 General Specifications synchronization with PLM Master Data.',
      }
    ]
  },
  {
    id: 'ECN-2026-S02',
    title: 'Sterilization Facility Relocation to Site B (Caguas, PR)',
    category: 'STERILIZATION',
    targetSku: 'Stent-CS400',
    description: 'EO Sterilization line relocated to approved contract facility (Site B). Requires update of Sterilization Site Code in DHF and audit check of ISO 15223-1 Ref 5.2.3 symbol.',
    changes: [
      {
        field: 'Sterilization Site',
        oldValue: 'MedSteril Site A (Memphis, TN - ISO 11135 certified)',
        newValue: 'MedSteril Site B (Caguas, PR - ISO 11135 certified)',
        reason: 'Supply chain resilience & capacity expansion approved by TÜV SÜD Notified Body.',
      }
    ]
  },
  {
    id: 'ECN-2026-S03',
    title: 'MRI Safety Conditional Statement Update (ASTM F2503)',
    category: 'MRI_SAFETY',
    targetSku: 'Stent-CS400',
    description: 'Updated clinical guidelines allow scanning at 3.0 Tesla under specific SAR absorption limits (< 2.0 W/kg). Revision required across all 20 language IFU booklets and packaging summary lines.',
    changes: [
      {
        field: 'MRI Warning Block',
        oldValue: 'MR Conditional at 1.5 Tesla static magnetic field only.',
        newValue: 'MR Conditional at 1.5 Tesla and 3.0 Tesla (Spatial gradient <= 3000 gauss/cm).',
        reason: 'Clinical trial evaluation report CER-2025-REV4 safety clearance.',
      }
    ]
  }
];

export const MOCK_IMPACT_ASSESSMENT: ImpactAssessment = {
  ecnId: 'ECN-2026-S01',
  ecoNumber: 'ECO-2026-1042',
  title: 'Global Shelf-Life Extension for EverCor™ Stent Family',
  riskRating: 'MEDIUM',
  impactedSkus: ['Stent-CS400', 'Stent-CS350', 'Stent-CS300'],
  impactedPackaging: ['Primary Pouch', 'Secondary Carton Box', 'Shipper Corrugated Case'],
  affectedMarkets: ['US', 'EU', 'JP', 'UK'],
  affectedLanguages: ['EN', 'DE', 'FR', 'JA', 'ES', 'IT', 'NL', 'SV', 'DA', 'FI', 'EL', 'PT', 'CS', 'PL', 'HU', 'RO', 'SK', 'SL', 'BG', 'HR', 'TE'],
  affectedArtworkIds: ['ART-EU-POUCH-400', 'ART-US-BOX-400', 'ART-JP-POUCH-400', 'ART-GLOBAL-SHIP-400'],
  actionItems: [
    {
      id: 'ACT-01',
      role: 'Regulatory Affairs Specialist',
      task: 'Submit 30-day notice to US FDA CDRH for shelf-life extension under 21 CFR 814.39.',
      status: 'IN_PROGRESS',
      dueDate: '2026-12-01',
    },
    {
      id: 'ACT-02',
      role: 'Notified Body Coordinator',
      task: 'Notify TÜV SÜD (NB 0123) of significant change assessment per EU MDR Annex IX §4.1.',
      status: 'PENDING',
      dueDate: '2026-12-15',
    },
    {
      id: 'ACT-03',
      role: 'Packaging & Labeling Engineer',
      task: 'Generate revised SVG master templates with synchronized GS1 AI (17) 281231.',
      status: 'DONE',
      dueDate: '2026-11-20',
    },
    {
      id: 'ACT-04',
      role: 'QA Compliance Officer',
      task: 'Execute automated 3-layer validation suite and capture 21 CFR Part 11 e-signatures.',
      status: 'IN_PROGRESS',
      dueDate: '2026-12-05',
    }
  ],
  justification: 'Supported by 36-month real-time room temperature aging protocol report RPT-7704. Package seal strength ASTM F88 and microbial aerosol challenge ASTM F1608 showed zero compromise.',
  generatedDate: '2026-11-08T09:45:00Z',
};

// Comprehensive Why-Trace Database for interactive element inspection
export const WHY_TRACE_MAP: Record<string, WhyTraceData> = {
  'STERILE_EO': {
    elementId: 'STERILE_EO',
    elementName: 'Ethylene Oxide Sterilization Symbol',
    displayValue: 'STERILE EO',
    sourcePlmSpec: {
      specId: 'PLM-SPEC-0842-STERILIZATION',
      parameter: 'Validated Ethylene Oxide Sterilization (10^-6 SAL)',
      sourceDocument: 'Device Master Record (DMR) Doc #DMR-STENT-004 §3.2',
      dhrVerified: true,
    },
    regulatoryMandate: {
      regulation: 'ISO 15223-1:2021 & EU MDR 2017/745',
      section: 'Ref 5.2.3 & Annex I Chapter III §23.2(l)',
      mandateSummary: 'Mandates explicit identification of the sterilization method used for medical devices supplied sterile.',
      effectiveDate: 'Harmonized Standard under MDR since 2021',
    },
    verificationRecord: {
      testProtocol: 'VER-SYM-EO-009 (Computer Vision Vector Match)',
      result: 'PASS',
      confidence: 0.998,
      executedBy: 'LabelSense Automated Inspector v2.4',
      timestamp: '2026-11-08T10:12:33Z',
    },
    changeControl: {
      ecoNumber: 'ECO-2026-1042',
      approvedBy: 'Dr. Sarah Jenkins (VP Quality Assurance)',
      cryptographicHash: 'a7c93e41b2f09988cc2e11883344ffa901e4cba28374921098ef732bcefa4012',
      signoffDate: '2026-11-08T10:15:00Z',
    }
  },
  'REF': {
    elementId: 'REF',
    elementName: 'Product Catalogue Reference',
    displayValue: 'REF Stent-CS400',
    sourcePlmSpec: {
      specId: 'PLM-SPEC-0012-CATALOG',
      parameter: 'Part Number Stent-CS400, Dia 3.0mm, Length 18mm',
      sourceDocument: 'Product Bill of Materials (BOM) Rev 8',
      dhrVerified: true,
    },
    regulatoryMandate: {
      regulation: 'ISO 15223-1:2021 & 21 CFR §801.40',
      section: 'Ref 5.1.6',
      mandateSummary: 'Catalogue number must be preceded by symbol or text to identify product unambiguously.',
      effectiveDate: 'Enforced globally',
    },
    verificationRecord: {
      testProtocol: 'VER-PLM-BOM-SYNC-01',
      result: 'PASS',
      confidence: 1.0,
      executedBy: 'LabelSense PLM Connector',
      timestamp: '2026-11-08T10:12:33Z',
    },
    changeControl: {
      ecoNumber: 'ECO-2026-1042',
      approvedBy: 'Marcus Vance (Lead Packaging Engineer)',
      cryptographicHash: 'b830f30c1e82e39148d88e04b407bc32f418518e1efae44b67d510e1cb2a0142',
      signoffDate: '2026-11-08T10:14:12Z',
    }
  },
  'LOT': {
    elementId: 'LOT',
    elementName: 'Batch Code / Lot Identifier',
    displayValue: 'LOT-2026B14',
    sourcePlmSpec: {
      specId: 'MES-LOT-EXECUTION-2026B14',
      parameter: 'Sterile cleanroom manufacturing batch #2026B14',
      sourceDocument: 'Device History Record (DHR) e-Batch Record #44912',
      dhrVerified: true,
    },
    regulatoryMandate: {
      regulation: '21 CFR §820.65 & EU MDR Annex I §23.2(f)',
      section: 'Traceability & Identification',
      mandateSummary: 'Each manufacturer shall establish procedures for identifying with control number each unit or batch.',
      effectiveDate: 'Enforced',
    },
    verificationRecord: {
      testProtocol: 'VER-MES-DHR-MATCH',
      result: 'PASS',
      confidence: 1.0,
      executedBy: 'LabelSense MES Connector',
      timestamp: '2026-11-08T10:12:33Z',
    },
    changeControl: {
      ecoNumber: 'ECO-2026-1042',
      approvedBy: 'Marcus Vance',
      cryptographicHash: 'f40192ea91bc023477112839d0102919aa4bcf08129e01f568a9b2319028eac1',
      signoffDate: '2026-11-08T10:14:12Z',
    }
  },
  'CE_MARK': {
    elementId: 'CE_MARK',
    elementName: 'Conformité Européenne & Notified Body Number',
    displayValue: 'CE 0123',
    sourcePlmSpec: {
      specId: 'REG-CERT-TUV-0123-MDR',
      parameter: 'TÜV SÜD Product Service GmbH (Notified Body 0123)',
      sourceDocument: 'EU Quality Management System Certificate #G10 094124 0012',
      dhrVerified: true,
    },
    regulatoryMandate: {
      regulation: 'EU MDR 2017/745 Annex V',
      section: 'Article 20 & Annex I §23.2(c)',
      mandateSummary: 'The CE marking must be followed by the identification number of the notified body responsible for conformity assessment.',
      effectiveDate: '2021-05-26',
    },
    verificationRecord: {
      testProtocol: 'VER-CE-FONT-PROPORTION',
      result: 'PASS',
      confidence: 0.995,
      executedBy: 'LabelSense Vision Inspector',
      timestamp: '2026-11-08T10:12:34Z',
    },
    changeControl: {
      ecoNumber: 'ECO-2026-1042',
      approvedBy: 'Elena Rostova (Director Regulatory Affairs)',
      cryptographicHash: '93fba227bc9103984521dd9048a129ef8b00124cae33810298a0c2014bca8192',
      signoffDate: '2026-11-08T10:15:30Z',
    }
  },
  'UDI_DATAMATRIX': {
    elementId: 'UDI_DATAMATRIX',
    elementName: 'GS1 2D DataMatrix with Modulo-10 Check Digit',
    displayValue: '(01)00840123456789(17)281231(10)LOT-2026B14',
    sourcePlmSpec: {
      specId: 'PLM-UDI-GTIN-14-ASSIGNMENT',
      parameter: 'GTIN-14 assigned: 00840123456789 (Company Prefix: 0084012)',
      sourceDocument: 'GS1 Global Registry & GUDID Direct Submission Entry #991482',
      dhrVerified: true,
    },
    regulatoryMandate: {
      regulation: 'FDA 21 CFR §801.40 & EU MDR Article 27',
      section: 'Unique Device Identification System (UDI)',
      mandateSummary: 'Requires label to bear a UDI in plain-text and machine-readable AIDC format with mathematically verified check digit.',
      effectiveDate: 'Class III Enforced',
    },
    verificationRecord: {
      testProtocol: 'VER-GS1-MOD10-MATH-ENGINE',
      result: 'PASS',
      confidence: 1.0,
      executedBy: 'LabelSense Deterministic GS1 Engine',
      timestamp: '2026-11-08T10:12:35Z',
    },
    changeControl: {
      ecoNumber: 'ECO-2026-1042',
      approvedBy: 'Dr. Sarah Jenkins',
      cryptographicHash: '110294719028bcae912401827419aaecbf810293481029837491028347192834',
      signoffDate: '2026-11-08T10:16:00Z',
    }
  }
};
