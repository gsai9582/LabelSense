import React, { useState } from 'react';
import { AuditTrailTimeline } from './AuditTrailTimeline';
import { SubmissionPacket } from './SubmissionPacket';
import { WhyTraceModal } from './WhyTraceModal';
import { LabelArtwork, ElectronicSignature } from '../../types';
import { INITIAL_AUDIT_LOGS } from '../../utils/auditTrail';
import { History, FileCheck, Search } from 'lucide-react';
import { AbbrTooltip } from '../common/AbbrTooltip';

interface AuditModuleProps {
  artwork: LabelArtwork;
  signatures: ElectronicSignature[];
  onOpenWhyTrace: (elementId: string) => void;
}

export const AuditModule: React.FC<AuditModuleProps> = ({
  artwork,
  signatures,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'packet'>('timeline');
  const [selectedWhyTraceId, setSelectedWhyTraceId] = useState<string | null>(null);

  const sampleTraceElements = [
    { id: 'STERILE_EO', label: 'Ethylene Oxide Symbol (ISO 15223-1 Ref 5.2.3)' },
    { id: 'UDI_DATAMATRIX', label: 'GS1 2D DataMatrix with Modulo-10 Check Digit' },
    { id: 'CE_MARK', label: 'CE Marking with TÜV SÜD Notified Body 0123' },
    { id: 'REF', label: 'Product Catalogue REF & BOM Spec' },
    { id: 'LOT', label: 'Cleanroom Batch Lot Execution Record' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-190px)] min-h-[640px]">
      {/* Column 1: Why-Trace Quick Directory (3 cols) */}
      <div className="lg:col-span-3 h-full bg-white border border-slate-200 rounded p-4 flex flex-col shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              <Search className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Why-Trace™ Directory</h3>
              <p className="text-[11px] text-slate-500">Element-to-regulation root cause inspector</p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
            SELECT ELEMENT TO AUDIT LINEAGE
          </div>
          {sampleTraceElements.map(el => (
            <div
              key={el.id}
              onClick={() => setSelectedWhyTraceId(el.id)}
              className="p-2.5 rounded border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-all space-y-1 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-900 text-[11px]">{el.id}</span>
                <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1 rounded font-semibold">
                  PASS
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-tight font-sans">{el.label}</p>
            </div>
          ))}

          <div className="p-3 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600 mt-4 leading-relaxed font-sans">
            <strong className="text-slate-900 block mb-0.5">Audit Guarantee:</strong>
            Every character, symbol, and barcode on the packaging is mapped back to an approved <AbbrTooltip term="DHF">DHF</AbbrTooltip> / <AbbrTooltip term="DMR">DMR</AbbrTooltip> specification.
          </div>
        </div>
      </div>

      {/* Column 2 & 3: Main Timeline or Submission Packet (9 cols) */}
      <div className="lg:col-span-9 h-full flex flex-col">
        {/* Toggle between Immutable Timeline and Dossier Export */}
        <div className="flex items-center bg-slate-100 rounded border border-slate-200 p-0.5 mb-2 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all ${
              activeSubTab === 'timeline'
                ? 'bg-white text-blue-900 font-semibold shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-blue-700" />
            <span>Chronological 21 CFR Part 11 Audit Trail</span>
          </button>

          <button
            onClick={() => setActiveSubTab('packet')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all ${
              activeSubTab === 'packet'
                ? 'bg-white text-blue-900 font-semibold shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Regulatory Submission Dossier & Certificate</span>
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeSubTab === 'timeline' && (
            <AuditTrailTimeline events={INITIAL_AUDIT_LOGS} />
          )}
          {activeSubTab === 'packet' && (
            <SubmissionPacket artwork={artwork} signatures={signatures} />
          )}
        </div>
      </div>

      {/* Why-Trace Modal */}
      {selectedWhyTraceId && (
        <WhyTraceModal
          elementId={selectedWhyTraceId}
          onClose={() => setSelectedWhyTraceId(null)}
        />
      )}
    </div>
  );
};
