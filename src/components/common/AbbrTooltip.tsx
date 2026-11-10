import React, { useState } from 'react';

const REGULATORY_DICTIONARY: Record<string, string> = {
  UDI: 'Unique Device Identifier (FDA 21 CFR §801.40 / EU MDR Article 27) — Mandatory machine-readable (AIDC) & human-readable (HRI) code.',
  MDR: 'Medical Device Regulation (EU 2017/745) — Binding European law replacing MDD with strict clinical evidence & labeling standards.',
  ECN: 'Engineering Change Notice — Formal upstream engineering trigger documenting proposed modifications to BOM, DMR, or DHF.',
  ECO: 'Engineering Change Order — Approved operational change document routing revised artworks and specs through GxP sign-offs.',
  CER: 'Clinical Evaluation Report (MEDDEV 2.7/1 Rev 4) — Assessment of clinical safety, performance, and risk/benefit ratio.',
  AIDC: 'Automatic Identification & Data Capture — Machine-readable barcodes (2D DataMatrix or GS1-128) encoding GTIN, Lot, and Expiry.',
  HRI: 'Human Readable Interpretation — Plain-text characters printed beneath or beside barcode symbols for direct visual reading.',
  DMR: 'Device Master Record (21 CFR §820.181) — Complete compilation of specifications, production processes, and labeling for finished device.',
  DHF: 'Design History File (21 CFR §820.30) — Compilation of records showing device was designed per approved design plan.',
  DHR: 'Device History Record (21 CFR §820.184) — Production and cleanroom execution records demonstrating batch conformed to DMR.',
  CSA: 'Computer Software Assurance (FDA Draft Guidance) — Risk-based validation focusing on critical testing over burdensome documentation.',
};

interface AbbrTooltipProps {
  term: keyof typeof REGULATORY_DICTIONARY | string;
  children?: React.ReactNode;
}

export const AbbrTooltip: React.FC<AbbrTooltipProps> = ({ term, children }) => {
  const [show, setShow] = useState(false);
  const definition = REGULATORY_DICTIONARY[term.toUpperCase()] || term;

  return (
    <span
      className="relative inline-block cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="border-b border-dotted border-slate-400 font-mono text-slate-700 hover:text-blue-700 transition-colors">
        {children || term}
      </span>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-64 bg-slate-900 text-white text-[10px] rounded px-2.5 py-1.5 shadow-lg border border-slate-700 pointer-events-none text-left font-sans leading-relaxed">
          <strong className="block text-blue-300 font-mono uppercase mb-0.5">{term}</strong>
          {definition}
        </span>
      )}
    </span>
  );
};
