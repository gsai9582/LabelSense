import { ISOSymbol } from '../types';

export const ISO_SYMBOLS: ISOSymbol[] = [
  {
    id: 'STERILE_EO',
    standardRef: 'ISO 15223-1:2021 Ref 5.2.3',
    name: 'Sterilized using ethylene oxide',
    description: 'Indicates a medical device that has been sterilized using ethylene oxide gas.',
    aspectRatio: 2.5, // Standard rectangle (e.g. 50x20)
    category: 'STERILIZATION',
    isMandatoryFor: ['Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    svgCode: `<rect x="1" y="2" width="68" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="35" y="18" font-family="sans-serif" font-weight="700" font-size="11" text-anchor="middle" fill="currentColor">STERILE  EO</text>`,
  },
  {
    id: 'STERILE_R',
    standardRef: 'ISO 15223-1:2021 Ref 5.2.4',
    name: 'Sterilized using irradiation',
    description: 'Indicates a medical device that has been sterilized using ionizing irradiation.',
    aspectRatio: 2.5,
    category: 'STERILIZATION',
    isMandatoryFor: ['Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    svgCode: `<rect x="1" y="2" width="68" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="35" y="18" font-family="sans-serif" font-weight="700" font-size="11" text-anchor="middle" fill="currentColor">STERILE  R</text>`,
  },
  {
    id: 'REF',
    standardRef: 'ISO 15223-1:2021 Ref 5.1.6',
    name: 'Catalogue / Reference number',
    description: 'Indicates the manufacturer catalogue number so that the medical device can be identified.',
    aspectRatio: 2.0,
    category: 'IDENTIFICATION',
    isMandatoryFor: ['Class I', 'Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    svgCode: `<rect x="1" y="2" width="56" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="29" y="18" font-family="sans-serif" font-weight="700" font-size="12" text-anchor="middle" fill="currentColor">REF</text>`,
  },
  {
    id: 'LOT',
    standardRef: 'ISO 15223-1:2021 Ref 5.1.5',
    name: 'Batch code / Lot number',
    description: 'Indicates the manufacturer batch code so that the batch or lot can be traced.',
    aspectRatio: 2.0,
    category: 'IDENTIFICATION',
    isMandatoryFor: ['Class I', 'Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    svgCode: `<rect x="1" y="2" width="56" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="29" y="18" font-family="sans-serif" font-weight="700" font-size="12" text-anchor="middle" fill="currentColor">LOT</text>`,
  },
  {
    id: 'USE_BY',
    standardRef: 'ISO 15223-1:2021 Ref 5.1.4',
    name: 'Use-by date / Expiration date',
    description: 'Indicates the date after which the medical device is not to be used (Hourglass symbol).',
    aspectRatio: 1.0,
    category: 'STORAGE',
    isMandatoryFor: ['Class I', 'Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    svgCode: `<path d="M6 3 H22 L14 14 L22 25 H6 L14 14 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
<line x1="8" y1="21" x2="20" y2="21" stroke="currentColor" stroke-width="2"/>`,
  },
  {
    id: 'CONSULT_IFU',
    standardRef: 'ISO 15223-1:2021 Ref 5.4.3',
    name: 'Consult instructions for use',
    description: 'Indicates the need for the user to consult the instructions for use (Book with "i").',
    aspectRatio: 1.2,
    category: 'SAFETY',
    isMandatoryFor: ['Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    svgCode: `<path d="M4 6 C8 4, 12 5, 14 7 C16 5, 20 4, 24 6 V22 C20 20, 16 21, 14 23 C12 21, 8 20, 4 22 Z" fill="none" stroke="currentColor" stroke-width="2"/>
<line x1="14" y1="7" x2="14" y2="23" stroke="currentColor" stroke-width="2"/>
<text x="14" y="16" font-family="serif" font-style="italic" font-weight="bold" font-size="9" text-anchor="middle" fill="currentColor">i</text>`,
  },
  {
    id: 'SINGLE_USE',
    standardRef: 'ISO 15223-1:2021 Ref 5.4.2',
    name: 'Do not re-use',
    description: 'Indicates a medical device that is intended for one single use only.',
    aspectRatio: 1.0,
    category: 'SAFETY',
    isMandatoryFor: ['Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    svgCode: `<circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="14" y="19" font-family="sans-serif" font-weight="800" font-size="15" text-anchor="middle" fill="currentColor">2</text>
<line x1="6" y1="22" x2="22" y2="6" stroke="currentColor" stroke-width="2.2"/>`,
  },
  {
    id: 'MEDICAL_DEVICE',
    standardRef: 'ISO 15223-1:2021 Ref 5.7.7',
    name: 'Medical Device (MD symbol)',
    description: 'Mandatory symbol under EU MDR Annex I 23.2 to identify the product as a medical device.',
    aspectRatio: 1.8,
    category: 'IDENTIFICATION',
    isMandatoryFor: ['Class I', 'Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    svgCode: `<rect x="2" y="3" width="46" height="22" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="25" y="18" font-family="sans-serif" font-weight="800" font-size="12" text-anchor="middle" fill="currentColor">MD</text>`,
  },
  {
    id: 'CE_MARK',
    standardRef: 'EU MDR 2017/745 Annex V (CE 0123)',
    name: 'CE Marking with Notified Body 0123 (TÜV SÜD)',
    description: 'Conformité Européenne mark with Notified Body identification number for Class IIa/IIb/III.',
    aspectRatio: 2.2,
    category: 'SAFETY',
    isMandatoryFor: ['Class IIa', 'Class IIb', 'Class III', 'Implantable'],
    svgCode: `<path d="M12 5 A9 9 0 0 0 12 23 M10 14 H16" fill="none" stroke="currentColor" stroke-width="2"/>
<path d="M24 5 A9 9 0 0 0 24 23 M22 5 H28 M22 14 H26 M22 23 H28" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="44" y="17" font-family="sans-serif" font-weight="700" font-size="8.5" fill="currentColor">0123</text>`,
  },
  {
    id: 'TEMP_LIMIT',
    standardRef: 'ISO 15223-1:2021 Ref 5.3.7',
    name: 'Temperature limit (15°C - 30°C)',
    description: 'Indicates the temperature limits to which the medical device can be safely exposed.',
    aspectRatio: 1.0,
    category: 'STORAGE',
    isMandatoryFor: ['Class IIb', 'Class III', 'Implantable'],
    svgCode: `<path d="M12 4 V17 M10 17 A4 4 0 1 0 14 17 Z" fill="none" stroke="currentColor" stroke-width="2"/>
<line x1="16" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="1.5"/>
<line x1="16" y1="11" x2="21" y2="11" stroke="currentColor" stroke-width="1.5"/>
<text x="24" y="7" font-family="sans-serif" font-size="6" fill="currentColor">30°</text>
<text x="24" y="22" font-family="sans-serif" font-size="6" fill="currentColor">15°</text>`,
  },
  {
    id: 'STERILE_BARRIER',
    standardRef: 'ISO 15223-1:2021 Ref 5.2.11',
    name: 'Single sterile barrier system',
    description: 'Indicates a single sterile barrier packaging system.',
    aspectRatio: 1.6,
    category: 'STERILIZATION',
    isMandatoryFor: ['Class IIb', 'Class III', 'Implantable'],
    svgCode: `<ellipse cx="18" cy="14" rx="15" ry="9" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="18" cy="14" rx="11" ry="6" fill="none" stroke="currentColor" stroke-dasharray="2,2" stroke-width="1.5"/>`,
  },
  {
    id: 'KEEP_DRY',
    standardRef: 'ISO 15223-1:2021 Ref 5.3.4',
    name: 'Keep dry',
    description: 'Indicates a medical device that needs to be protected from moisture.',
    aspectRatio: 1.0,
    category: 'STORAGE',
    isMandatoryFor: ['Class I', 'Class IIa', 'Class IIb', 'Class III'],
    svgCode: `<path d="M4 14 C4 8 14 3 14 3 C14 3 24 8 24 14 Z" fill="none" stroke="currentColor" stroke-width="2"/>
<path d="M14 14 V21 A3 3 0 0 1 11 24" fill="none" stroke="currentColor" stroke-width="2"/>
<line x1="10" y1="1" x2="18" y2="1" stroke="currentColor" stroke-width="1.5"/>`,
  }
];
