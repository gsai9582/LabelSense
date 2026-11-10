import React from 'react';
import { FileCheck, Globe2, Layers, Users, ArrowRight } from 'lucide-react';
import { ImpactAssessment } from '../../types';
import { AbbrTooltip } from '../common/AbbrTooltip';

interface TraversalResultsProps {
  assessment: ImpactAssessment;
  onProceedToAuthor: () => void;
}

export const TraversalResults: React.FC<TraversalResultsProps> = ({
  assessment,
  onProceedToAuthor,
}) => {
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
              Auto-Drafted Change Order (<AbbrTooltip term="ECO">{assessment.ecoNumber}</AbbrTooltip>)
            </h3>
            <p className="text-[11px] text-slate-500">
              Deterministic Traversal Output | 100% Graph Lineage Resolved
            </p>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
          assessment.riskRating === 'HIGH' ? 'bg-rose-50 text-rose-800 border-rose-300' :
          assessment.riskRating === 'MEDIUM' ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
        }`}>
          Risk: {assessment.riskRating}
        </span>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
        {/* Impact Scope Badges */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
            <span className="text-[10px] font-mono text-slate-600 font-semibold flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-700" /> IMPACTED SKUS ({assessment.impactedSkus.length})
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {assessment.impactedSkus.map(s => (
                <span key={s} className="px-1.5 py-0.5 rounded bg-white text-slate-800 text-[10px] font-mono border border-slate-200 shadow-2xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
            <span className="text-[10px] font-mono text-slate-600 font-semibold flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-emerald-700" /> AFFECTED JURISDICTIONS
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {assessment.affectedMarkets.map(m => (
                <span key={m} className="px-1.5 py-0.5 rounded bg-white text-emerald-800 text-[10px] font-mono border border-emerald-200 font-semibold shadow-2xs">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 20+ Languages Impacted */}
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-slate-600 font-semibold">
              SYNCHRONIZED LOCALIZATION VARIANTS ({assessment.affectedLanguages.length} Languages)
            </span>
            <span className="text-[10px] font-mono text-blue-700 font-semibold">Locked Translation Memory</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {assessment.affectedLanguages.map(lang => (
              <span key={lang} className="px-1.5 py-0.2 rounded bg-white text-slate-700 text-[10px] font-mono border border-slate-200">
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Auto-Drafted Action Items */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-700" />
              Auto-Assigned Action Items (GxP Roles)
            </span>
            <span className="text-[10px] font-mono text-slate-500">21 CFR §820.70</span>
          </div>

          <div className="space-y-1.5">
            {assessment.actionItems.map(item => (
              <div key={item.id} className="bg-white border border-slate-200 p-2.5 rounded text-xs shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-[11px]">{item.role}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                    item.status === 'DONE' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                    item.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-800 border-blue-300' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{item.task}</p>
                <div className="mt-1 text-[10px] font-mono text-slate-400">Target SLA: {item.dueDate}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Justification Text */}
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-1 font-bold">
            COMPLIANCE JUSTIFICATION & CLINICAL RATIONALE
          </div>
          <p className="text-[11px] text-slate-700 leading-relaxed italic border-l-2 border-emerald-600 pl-2">
            &ldquo;{assessment.justification}&rdquo;
          </p>
        </div>

        {/* Forward to Author Module */}
        <button
          onClick={onProceedToAuthor}
          className="w-full py-2.5 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors mt-2"
        >
          <span>Auto-Populate Template-Bound GenAI Author</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
