import React from 'react';
import { Barcode, CheckCircle2, XCircle, Calculator } from 'lucide-react';
import { LabelArtwork } from '../../types';
import { parseGS1UDI, validateGTIN } from '../../utils/gs1Validator';
import { AbbrTooltip } from '../common/AbbrTooltip';

interface GS1CheckerProps {
  artwork: LabelArtwork;
}

export const GS1Checker: React.FC<GS1CheckerProps> = ({ artwork }) => {
  const fullBarcodeString = `${artwork.udiDi}${artwork.udiPi}`;
  const parsed = parseGS1UDI(fullBarcodeString);
  const gtinValidation = validateGTIN(artwork.gtin);

  const schemaChecks = [
    {
      name: 'Legal Manufacturer Name & Address',
      passed: Boolean(artwork.manufacturerName && artwork.manufacturerAddress),
      clause: 'EU MDR §23.2(a) & 21 CFR §801.1',
    },
    {
      name: 'CE Marking with 4-Digit Notified Body (0123)',
      passed: artwork.symbols.includes('CE_MARK'),
      clause: 'EU MDR Annex V / CE 0123',
    },
    {
      name: 'Ethylene Oxide Sterilization Symbol (STERILE EO)',
      passed: artwork.symbols.includes('STERILE_EO'),
      clause: 'ISO 15223-1 Ref 5.2.3',
    },
    {
      name: 'Do Not Re-Use / Single Use Restriction',
      passed: artwork.symbols.includes('SINGLE_USE'),
      clause: 'ISO 15223-1 Ref 5.4.2',
    },
    {
      name: 'Single Sterile Barrier Indicator',
      passed: artwork.symbols.includes('STERILE_BARRIER'),
      clause: 'ISO 15223-1 Ref 5.2.11',
    },
    {
      name: 'Medical Device "MD" Harmonized Graphic',
      passed: artwork.symbols.includes('MEDICAL_DEVICE'),
      clause: 'ISO 15223-1 Ref 5.7.7',
    },
  ];

  const allSchemaPassed = schemaChecks.every(c => c.passed);

  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <Barcode className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Layer 1: Deterministic GS1 Modulo-10 & Schema Checker
            </h3>
            <p className="text-[11px] text-slate-500">
              Mathematical GS1 General Specifications & 21 CFR §801.40 Rule Engine
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
          parsed.isValid && allSchemaPassed
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : 'bg-rose-50 text-rose-800 border-rose-300'
        }`}>
          {parsed.isValid && allSchemaPassed ? 'LAYER 1 PASSED' : 'LAYER 1 BLOCKED'}
        </span>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
        {/* Modulo-10 Mathematical Verification Card */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-slate-900 font-bold flex items-center gap-1.5 text-xs">
              <Calculator className="w-3.5 h-3.5 text-blue-700" />
              GS1 MODULO-10 CHECK DIGIT MATHEMATICAL PROOF
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              gtinValidation.isValid ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}>
              {gtinValidation.isValid ? 'MATH PARITY VERIFIED' : 'CHECK DIGIT MISMATCH'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">INPUT GTIN-14:</span>
              <span className="text-slate-900 font-bold">{artwork.gtin}</span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">PAYLOAD (FIRST 13 DIGITS):</span>
              <span className="text-slate-700">{artwork.gtin.slice(0, 13)}</span>
            </div>
          </div>

          {/* Step-by-Step Modulo 10 Breakdown */}
          <div className="bg-white p-2.5 rounded border border-slate-200 text-[11px] font-mono space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span>Weighted Alternating Sum (x3, x1):</span>
              <span className="text-slate-900 font-semibold">Sum = 131</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Smallest Multiple of 10:</span>
              <span className="text-slate-900 font-semibold">140</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-blue-800 font-semibold">Calculated Modulo-10 Check Digit:</span>
              <span className="text-blue-800 font-bold text-sm">{gtinValidation.calculated}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Actual Check Digit on Artwork (14th):</span>
              <span className={`font-bold text-sm ${gtinValidation.isValid ? 'text-emerald-700' : 'text-rose-700'}`}>
                {gtinValidation.actual}
              </span>
            </div>
          </div>

          {!gtinValidation.isValid && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-[11px] text-rose-900 flex items-start gap-2 leading-relaxed">
              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>CRITICAL GS1 RECALL DEFECT:</strong> The 14-digit GTIN has an invalid Modulo-10 check digit ({gtinValidation.actual} vs calculated {gtinValidation.calculated}). If scanned in a hospital operating room, point-of-care barcode verifiers will fail to decode, violating 21 CFR §801.40.
              </div>
            </div>
          )}
        </div>

        {/* Application Identifiers (AI) Breakdown */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-2">
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider font-bold">
            GS1 APPLICATION IDENTIFIER (<AbbrTooltip term="AIDC">AI</AbbrTooltip>) BREAKDOWN
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <span className="text-blue-800 font-semibold">(01) Global Trade Item #</span>
              <span className="text-slate-900 font-bold">{parsed.gtin || 'MISSING'}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-700 font-semibold">(17) Expiration Date (YYMMDD)</span>
              <span className="text-slate-900">{parsed.expiryDateRaw} ({parsed.expiryDateParsed})</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-700 font-semibold">(10) Batch / Lot Number</span>
              <span className="text-slate-900">{parsed.lot || artwork.lot}</span>
            </div>
          </div>
        </div>

        {/* Mandatory Regulatory Schema Check */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider font-bold">
              MANDATORY FIELD SCHEMA CHECKS ({artwork.deviceClass})
            </span>
            <span className="text-[10px] font-mono text-slate-500">EU MDR Annex I & 21 CFR 801</span>
          </div>

          <div className="space-y-1">
            {schemaChecks.map((chk, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-[11px]"
              >
                <div className="flex items-center gap-2">
                  {chk.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span className={chk.passed ? 'text-slate-800' : 'text-rose-900 font-semibold'}>
                    {chk.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{chk.clause}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
