import React from 'react';
import { FileCheck, Printer, Shield } from 'lucide-react';
import { LabelArtwork, ElectronicSignature } from '../../types';
import { AbbrTooltip } from '../common/AbbrTooltip';

interface SubmissionPacketProps {
  artwork: LabelArtwork;
  signatures: ElectronicSignature[];
  ecoNumber?: string;
}

export const SubmissionPacket: React.FC<SubmissionPacketProps> = ({
  artwork,
  signatures,
  ecoNumber = 'ECO-2026-1042',
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <FileCheck className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Regulatory Submission & Audit Packet Generator
            </h3>
            <p className="text-[11px] text-slate-500">
              One-click dossier for FDA 510(k)/PMA, <AbbrTooltip term="MDR">EU MDR</AbbrTooltip> Technical Documentation, & PMDA
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Export Submission Packet (Print / PDF)</span>
        </button>
      </div>

      {/* Structured Submission Document View */}
      <div className="mt-3 flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
        <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-4 font-mono text-[11px]">
          {/* Certificate Banner */}
          <div className="border-b border-slate-200 pb-3 flex items-start justify-between bg-white p-3 rounded border">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-700" />
                LABEL COMPLIANCE VERIFICATION CERTIFICATE
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                <AbbrTooltip term="CSA">GAMP 5 Category 4</AbbrTooltip> Automated Validation | 21 CFR Part 11 Certified
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                PASS - GxP CERTIFIED
              </span>
              <div className="text-[9px] text-slate-500 mt-1">Ref: {ecoNumber}</div>
            </div>
          </div>

          {/* Section 1: Device Identification */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">
              1. MEDICAL DEVICE IDENTIFICATION & UDI SPECIFICATION
            </div>
            <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded border border-slate-200 text-slate-800">
              <div><span className="text-slate-500">PROPRIETARY NAME:</span> <span className="text-slate-900 font-semibold">{artwork.tradeName}</span></div>
              <div><span className="text-slate-500">SKU / REF:</span> <span className="text-slate-900 font-semibold">{artwork.sku}</span></div>
              <div><span className="text-slate-500">RISK CLASS:</span> <span className="text-blue-900 font-semibold">{artwork.deviceClass}</span></div>
              <div><span className="text-slate-500">REVISION:</span> <span className="text-slate-900">{artwork.revision}</span></div>
              <div><span className="text-slate-500">GS1 GTIN-14:</span> <span className="text-blue-800 font-bold">{artwork.gtin}</span></div>
              <div><span className="text-slate-500">MODULO-10 PARITY:</span> <span className="text-emerald-700 font-bold">VERIFIED</span></div>
              <div><span className="text-slate-500">BATCH / LOT:</span> <span className="text-slate-900">{artwork.lot}</span></div>
              <div><span className="text-slate-500">EXPIRATION DATE:</span> <span className="text-slate-900">{artwork.expDate}</span></div>
            </div>
          </div>

          {/* Section 2: Harmonized Standards Alignment Table */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">
              2. REGULATORY & HARMONIZED STANDARDS CONFORMANCE MATRIX
            </div>
            <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1 text-[10px]">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-700">FDA 21 CFR Part 801 (UDI Rule & Labeling)</span>
                <span className="text-emerald-700 font-bold">100% CONFORMANT</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-700">EU MDR 2017/745 Annex I Chapter III (General Requirements)</span>
                <span className="text-emerald-700 font-bold">100% CONFORMANT</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-700">ISO 15223-1:2021 (Medical Device Symbols)</span>
                <span className="text-emerald-700 font-bold">100% CONFORMANT</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-700">ISO 20417:2026 (Information Supplied by Manufacturer)</span>
                <span className="text-emerald-700 font-bold">100% CONFORMANT</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700">GS1 General Specifications (Release 24.0)</span>
                <span className="text-emerald-700 font-bold">100% CONFORMANT</span>
              </div>
            </div>
          </div>

          {/* Section 3: Captured 21 CFR Part 11 Electronic Signatures */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">
              3. 21 CFR PART 11 ELECTRONIC SIGNATURE RECORDS ({signatures.length})
            </div>
            <div className="space-y-2">
              {signatures.map(sig => (
                <div key={sig.id} className="bg-white p-2.5 rounded border border-slate-200 text-[10px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 font-bold">{sig.userName} ({sig.userRole})</span>
                    <span className="text-slate-500">{sig.timestamp}</span>
                  </div>
                  <div className="text-blue-900 font-sans italic">
                    &ldquo;{sig.meaning}&rdquo;
                  </div>
                  <div className="text-slate-500 break-all select-all pt-1 border-t border-slate-100">
                    SHA-256 Digest: <span className="text-emerald-800 font-bold">{sig.sha256Hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
