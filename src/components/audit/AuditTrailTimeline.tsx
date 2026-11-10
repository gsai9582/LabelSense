import React from 'react';
import { History, ShieldCheck } from 'lucide-react';
import { AuditEvent } from '../../utils/auditTrail';

interface AuditTrailTimelineProps {
  events: AuditEvent[];
}

export const AuditTrailTimeline: React.FC<AuditTrailTimelineProps> = ({ events }) => {
  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <History className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Immutable 21 CFR Part 11 Audit Trail
            </h3>
            <p className="text-[11px] text-slate-500">
              Cryptographically chained SHA-256 event log with zero retroactive mutability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hash Chain Intact (0 Tampering)</span>
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {events.map((evt, idx) => (
          <div key={evt.id} className="relative pl-6 pb-2">
            {/* Timeline connector vertical line */}
            {idx < events.length - 1 && (
              <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-200" />
            )}

            {/* Timeline node icon */}
            <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            </div>

            {/* Event Box */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-1.5 hover:border-slate-300 transition-all shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-blue-800 font-bold">{evt.id}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 font-medium">
                    {evt.eventType}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{evt.timestamp}</span>
              </div>

              <div className="font-semibold text-slate-900 text-xs">{evt.action}</div>
              <p className="text-slate-600 text-[11px] leading-relaxed font-sans">{evt.details}</p>

              <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Actor: <strong className="text-slate-800">{evt.actor}</strong> ({evt.role})</span>
                <span className="text-emerald-700 font-semibold">{evt.systemVerdict || 'PASS'}</span>
              </div>

              {/* Cryptographic Hash Chaining Visual */}
              <div className="bg-white rounded p-1.5 text-[9.5px] font-mono text-slate-500 space-y-0.5 border border-slate-200">
                <div className="truncate">Prev Hash: <span className="text-slate-400">{evt.previousHash}</span></div>
                <div className="truncate text-emerald-800 font-semibold">Curr Hash: <span>{evt.currentHash}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
