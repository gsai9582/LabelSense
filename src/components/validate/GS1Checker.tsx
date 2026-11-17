import React from 'react';
import { Barcode, CheckCircle2, XCircle, Calculator } from 'lucide-react';
import { LabelArtwork } from '../../types';
import { parseGS1UDI, validateGTIN, validateMandatoryLabelSchema } from '../../utils/gs1Validator';
import { AbbrTooltip } from '../common/AbbrTooltip';

interface GS1CheckerProps {
  artwork: LabelArtwork;
}

export const GS1Checker: React.FC<GS1CheckerProps> = ({ artwork }) => {
  const fullBarcodeString = `${artwork.udiDi || ''}${artwork.udiPi || ''}`;
  const parsed = parseGS1UDI(fullBarcodeString);
  const gtinValidation = validateGTIN(artwork.gtin || '');
  const schemaReport = validateMandatoryLabelSchema(artwork);

  const allSchemaPassed = schemaReport.allPassed;

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
          gtinValidation.isValid && allSchemaPassed
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : 'bg-rose-50 text-rose-800 border-rose-300'
        }`}>
          {gtinValidation.isValid && allSchemaPassed ? 'LAYER 1 PASSED' : 'LAYER 1 BLOCKED'}
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
              {gtinValidation.isValid ? `${gtinValidation.format} PARITY VERIFIED` : 'CHECK DIGIT MISMATCH'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">INPUT GTIN:</span>
              <span className="text-slate-900 font-bold">{artwork.gtin || 'NONE'}</span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">PAYLOAD (EXCLUDING CHECK DIGIT):</span>
              <span className="text-slate-700">{gtinValidation.payload || 'N/A'}</span>
            </div>
          </div>

          {/* Dynamic Modulo 10 Breakdown */}
          <div className="bg-white p-2.5 rounded border border-slate-200 text-[11px] font-mono space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span>Weighted Alternating Sum (x3, x1 right-to-left):</span>
              <span className="text-slate-900 font-semibold">
                Sum = {gtinValidation.weightedSum >= 0 ? gtinValidation.weightedSum : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Next Multiple of 10:</span>
              <span className="text-slate-900 font-semibold">
                {gtinValidation.nextMultipleOf10 >= 0 ? gtinValidation.nextMultipleOf10 : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-blue-800 font-semibold">Calculated Modulo-10 Check Digit:</span>
              <span className="text-blue-800 font-bold text-sm">
                {gtinValidation.calculatedCheckDigit >= 0 ? gtinValidation.calculatedCheckDigit : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Actual Check Digit on Artwork:</span>
              <span className={`font-bold text-sm ${gtinValidation.isValid ? 'text-emerald-700' : 'text-rose-700'}`}>
                {gtinValidation.actualCheckDigit >= 0 ? gtinValidation.actualCheckDigit : 'N/A'}
              </span>
            </div>
          </div>

          {!gtinValidation.isValid && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-[11px] text-rose-900 flex items-start gap-2 leading-relaxed">
              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>CRITICAL GS1 RECALL DEFECT:</strong>{' '}
                {gtinValidation.errorMessage ||
                  `The GTIN has an invalid Modulo-10 check digit (${gtinValidation.actualCheckDigit} vs calculated ${gtinValidation.calculatedCheckDigit}).`}
                If scanned in a hospital operating room, point-of-care barcode verifiers will fail to decode, violating 21 CFR §801.40.
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
              <span className="text-blue-800 font-semibold">(01) Global Trade Item # (GTIN)</span>
              <span className="text-slate-900 font-bold">{parsed.gtin || artwork.gtin || 'MISSING'}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-700 font-semibold">(17) Expiration Date</span>
              <span className="text-slate-900">
                {parsed.expiryDateRaw ? `${parsed.expiryDateRaw} (${parsed.expiryDateValidation?.parsedDate})` : artwork.expDate || 'MISSING'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-700 font-semibold">(10) Batch / Lot Number</span>
              <span className="text-slate-900">{parsed.lot || artwork.lot || 'MISSING'}</span>
            </div>
            {parsed.serialNumber && (
              <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                <span className="text-slate-700 font-semibold">(21) Serial Number</span>
                <span className="text-slate-900">{parsed.serialNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mandatory Regulatory Schema Check */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider font-bold">
              MANDATORY FIELD SCHEMA CHECKS ({artwork.deviceClass || 'Class III'})
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Passed {schemaReport.passedCount} / {schemaReport.totalCount} Checks
            </span>
          </div>

          <div className="space-y-1">
            {schemaReport.checks.map(chk => (
              <div
                key={chk.id}
                className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-[11px]"
              >
                <div className="flex items-center gap-2">
                  {chk.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
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
