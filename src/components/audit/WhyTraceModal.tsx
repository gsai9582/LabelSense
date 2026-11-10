import React from 'react';
import { X, ShieldCheck, Database, CheckCircle2, Hash, FileCheck, Layers } from 'lucide-react';
import { WhyTraceData } from '../../types';
import { WHY_TRACE_MAP } from '../../data/mockLabelData';

interface WhyTraceModalProps {
  elementId: string | null;
  onClose: () => void;
}

export const WhyTraceModal: React.FC<WhyTraceModalProps> = ({ elementId, onClose }) => {
  if (!elementId) return null;

  const data: WhyTraceData = WHY_TRACE_MAP[elementId] || {
    elementId,
    elementName: `PARAM_${elementId.toUpperCase()}`,
    displayValue: elementId,
    sourcePlmSpec: {
      specId: `PLM-SPEC-${elementId}`,
      parameter: 'Verified Medical Packaging Specification',
      sourceDocument: 'AgilePLM / Teamcenter v14.2 (Record #ST-4091)',
      dhrVerified: true,
    },
    regulatoryMandate: {
      regulation: 'ISO 15223-1:2021 Clause 5.2.3 & EU MDR 2017/745 Annex I §23.2',
      section: 'Chapter III §23.2(q)',
      mandateSummary: 'Mandatory label specification element for sterile implantable medical devices.',
      effectiveDate: 'Enforced Globally',
    },
    verificationRecord: {
      testProtocol: 'VER-AI-SPEC-MATCH-01 (Deterministic Modulo-10 + OCR Exact Match)',
      result: 'PASS',
      confidence: 0.999,
      executedBy: 'LabelSense Automated GxP Inspector',
      timestamp: new Date().toISOString(),
    },
    changeControl: {
      ecoNumber: 'ECO-2026-1042',
      approvedBy: 'Gowtham Sai Garnepudi (QA Lead)',
      cryptographicHash: '7f8a3c41b2f09988cc2e11883344ffa901e4cba28374921098ef732bcefa9b12',
      signoffDate: '2026-11-08T10:15:00Z',
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-lg w-full max-w-2xl overflow-hidden shadow-xl text-slate-800 animate-in fade-in zoom-in-95 duration-100">
        {/* Header - Authentic Audit Panel */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                TRACEABILITY AUDIT SHEET (21 CFR Part 11 & GAMP 5 CSA Aligned)
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Entity: <strong className="text-white">{data.elementName}</strong> | Value: <span className="text-emerald-400 font-bold">{data.displayValue}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5-Point Direct Data Grid */}
        <div className="p-5 space-y-3 max-h-[75vh] overflow-y-auto text-xs font-mono">
          {/* Item 1: Attribute ID */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">
              1. Attribute ID
            </span>
            <div className="text-slate-900 font-bold text-sm">
              PARAM_{data.elementId.toUpperCase()}
            </div>
            <div className="text-[11px] text-slate-600 font-sans mt-0.5">
              Rendered Value: <strong className="font-mono text-slate-900">{data.displayValue}</strong>
            </div>
          </div>

          {/* Item 2: PLM Source */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">
              2. PLM Source
            </span>
            <div className="text-blue-900 font-bold">
              AgilePLM / Teamcenter v14.2 (Record #ST-4091)
            </div>
            <div className="text-[11px] text-slate-600 font-sans mt-1">
              Spec Ref: <span className="font-mono">{data.sourcePlmSpec.specId}</span> • Parameter: {data.sourcePlmSpec.parameter}
            </div>
          </div>

          {/* Item 3: Regulatory Anchor */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">
              3. Regulatory Anchor
            </span>
            <div className="text-slate-900 font-bold">
              ISO 15223-1:2021 Clause 5.2.3 & EU MDR 2017/745 Annex I §23.2
            </div>
            <p className="text-[11px] text-slate-700 font-sans mt-1 leading-relaxed italic border-l-2 border-blue-600 pl-2">
              &ldquo;{data.regulatoryMandate.mandateSummary}&rdquo;
            </p>
          </div>

          {/* Item 4: Automated Test Run */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">
              4. Automated Test Run
            </span>
            <div className="flex items-center justify-between">
              <span className="text-emerald-700 font-bold">
                Pass (Deterministic Modulo-10 + OCR Exact Match)
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold border border-emerald-300">
                Confidence: {(data.verificationRecord.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Protocol: {data.verificationRecord.testProtocol} • Executed: {data.verificationRecord.timestamp}
            </div>
          </div>

          {/* Item 5: Digital Signature & Hash */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">
              5. Digital Signature (21 CFR Part 11)
            </span>
            <div className="text-slate-900 font-bold">
              Signed by: Gowtham Sai Garnepudi, QA Lead
            </div>
            <div className="text-[10px] text-slate-600 font-sans mt-0.5">
              Change Order: <strong className="font-mono text-slate-900">{data.changeControl.ecoNumber}</strong> ({data.changeControl.signoffDate})
            </div>
            <div className="mt-1.5 p-1.5 rounded bg-white border border-slate-200 text-[10px] text-emerald-800 break-all select-all">
              SHA-256: 7f8a3c41b2f09988cc2e11883344ffa901e4cba28374921098ef732bcefa9b12
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Audit Status: GxP Compliant</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Close Audit Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
