// MedTech Regulatory & Compliance Types

export type DeviceClass = 'Class I' | 'Class IIa' | 'Class IIb' | 'Class III' | 'Implantable';
export type TargetMarket = 'US' | 'EU' | 'JP' | 'UK';
export type PackagingLevel = 'Primary Pouch' | 'Secondary Carton' | 'Secondary Carton Box' | 'Shipper Case' | 'Shipper Corrugated Case';
export type ValidationTier = 'GREEN' | 'AMBER' | 'RED';

export interface RegulatoryUpdate {
  id: string;
  authority: 'FDA' | 'EU MDR' | 'ISO' | 'IMDRF';
  standard: string; // e.g. "21 CFR Part 801", "EU MDR 2017/745 Annex I Ch III"
  clause: string;   // e.g. "§23.2", "Clause 5.4.3"
  title: string;
  summary: string;
  severity: 'CRITICAL' | 'MAJOR' | 'INFORMATIONAL';
  effectiveDate: string;
  deviceClasses: DeviceClass[];
  markets: TargetMarket[];
  extractedRules: ExtractedRule[];
  status: 'ACTIVE' | 'PENDING' | 'INTEGRATED';
}

export interface ExtractedRule {
  id: string;
  ruleCode: string;
  clauseRef: string;
  description: string;
  assertionType: 'PRESENCE' | 'FORMAT' | 'ASPECT_RATIO' | 'TRANSLATION' | 'LEGIBILITY';
  machineLogic: string;
  isMandatory: boolean;
}

export interface DigitalThreadNode {
  id: string;
  label: string;
  type: 'SKU' | 'PACKAGING' | 'MARKET' | 'LANGUAGE' | 'ARTWORK';
  code: string;
  status: 'COMPLIANT' | 'NEEDS_REVIEW' | 'FLAGGED';
  metadata?: Record<string, string | number>;
  x?: number;
  y?: number;
}

export interface DigitalThreadEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  isImpacted?: boolean;
}

export interface ECNScenario {
  id: string;
  title: string;
  category: 'SHELF_LIFE' | 'STERILIZATION' | 'MRI_SAFETY' | 'MANUFACTURER_ADDRESS' | 'DIMENSION_TOLERANCE';
  description: string;
  targetSku: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
    reason: string;
  }[];
}

export interface ImpactAssessment {
  ecnId: string;
  ecoNumber: string;
  title: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  impactedSkus: string[];
  impactedPackaging: PackagingLevel[];
  affectedMarkets: TargetMarket[];
  affectedLanguages: string[];
  affectedArtworkIds: string[];
  actionItems: {
    id: string;
    role: string;
    task: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    dueDate: string;
  }[];
  justification: string;
  generatedDate: string;
}

export interface ISOSymbol {
  id: string;
  standardRef: string; // e.g. "ISO 15223-1 Ref 5.1.1"
  name: string;
  description: string;
  svgCode: string;
  aspectRatio: number; // width / height standard
  isMandatoryFor: DeviceClass[];
  category: 'STERILIZATION' | 'IDENTIFICATION' | 'STORAGE' | 'SAFETY';
}

export interface TranslationBlock {
  key: string;
  label: string;
  sourceEn: string;
  lockedTokens: string[];
  translations: Record<string, string>; // { de: "...", fr: "...", ja: "...", te: "...", es: "..." }
  backTranslations?: Record<string, {
    backText: string;
    driftScore: number; // 0.0 to 1.0 (1.0 = identical)
    driftReason?: string;
    hasFlag: boolean;
  }>;
}

export interface LabelArtwork {
  sku: string;
  productName: string;
  tradeName: string;
  deviceClass: DeviceClass;
  sterileBarrier: string;
  packagingLevel: PackagingLevel;
  revision: string;
  gtin: string;
  lot: string;
  expDate: string; // YYMMDD or YYYY-MM-DD
  mfgDate: string;
  serialNumber?: string;
  manufacturerName: string;
  manufacturerAddress: string;
  euRepName?: string;
  euRepAddress?: string;
  symbols: string[]; // symbol IDs
  instructions: string;
  storageTemp: string;
  dimensions: string; // e.g. "3.0 x 18 mm"
  udiDi: string;
  udiPi: string;
}

export interface DefectItem {
  id: string;
  type: 'DECIMAL_SHIFT' | 'LEGIBILITY' | 'ASPECT_RATIO' | 'QUIET_ZONE' | 'MISSING_FIELD' | 'TRANSLATION_DRIFT';
  title: string;
  description: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  x: number; // percentage coordinates for visual overlay
  y: number;
  width: number;
  height: number;
  expected: string;
  actual: string;
  regulatoryRef: string;
}

export interface ValidationReport {
  timestamp: string;
  overallScore: number; // 0.00 to 1.00
  tier: ValidationTier;
  routing: {
    recommendedPath: string;
    requiredSignatures: string[];
    turnaroundSla: string;
  };
  layer1Gs1: {
    passed: boolean;
    gtinValid: boolean;
    modulo10Check: {
      input: string;
      computedCheckDigit: number;
      actualCheckDigit: number;
      isMatch: boolean;
    };
    expDateValid: boolean;
    lotValid: boolean;
    mandatoryFieldsPresent: boolean;
    missingMandatoryFields: string[];
  };
  layer2Vision: {
    passed: boolean;
    diffScore: number; // 0 to 100%
    defects: DefectItem[];
  };
  layer3Translation: {
    passed: boolean;
    driftWarnings: {
      lang: string;
      source: string;
      drifted: string;
      backTranslated: string;
      clinicalRisk: 'NONE' | 'LOW' | 'CRITICAL';
    }[];
  };
}

export interface WhyTraceData {
  elementId: string;
  elementName: string;
  displayValue: string;
  sourcePlmSpec: {
    specId: string;
    parameter: string;
    sourceDocument: string;
    dhrVerified: boolean;
  };
  regulatoryMandate: {
    regulation: string;
    section: string;
    mandateSummary: string;
    effectiveDate: string;
  };
  verificationRecord: {
    testProtocol: string;
    result: 'PASS' | 'FAIL' | 'CONDITIONAL';
    confidence: number;
    executedBy: string;
    timestamp: string;
  };
  changeControl: {
    ecoNumber: string;
    approvedBy: string;
    cryptographicHash: string;
    signoffDate: string;
  };
}

export interface ElectronicSignature {
  id: string;
  userId: string;
  userName: string;
  userRole: 'QA_LEAD' | 'REGULATORY_AFFAIRS' | 'CLINICAL_SPECIALIST' | 'OPERATIONS_DIRECTOR';
  meaning: string;
  timestamp: string;
  sha256Hash: string;
  ipAddress: string;
  part11Compliant: boolean;
}

export type DemoScenarioKey = 'SCENARIO_A' | 'SCENARIO_B' | 'SCENARIO_C';
