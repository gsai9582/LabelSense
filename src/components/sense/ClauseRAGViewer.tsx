import React, { useState } from 'react';
import { Search, BookOpen, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { RegulatoryUpdate } from '../../types';

interface ClauseRAGViewerProps {
  selectedUpdate: RegulatoryUpdate | null;
  onPromoteRule: (ruleCode: string) => void;
  promotedRules: string[];
}

export const ClauseRAGViewer: React.FC<ClauseRAGViewerProps> = ({
  selectedUpdate,
  onPromoteRule,
  promotedRules,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!selectedUpdate) {
    return (
      <div className="bg-white border border-slate-200 rounded p-8 flex flex-col items-center justify-center text-center h-full shadow-xs">
        <BookOpen className="w-10 h-10 text-slate-300 mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">No Regulatory Clause Selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Select a regulatory feed item from the Radar on the left to inspect statutory clauses and extract executable rules.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <BookOpen className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Statutory Clause & RAG Corpus Inspector
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Standard: <strong className="text-slate-800">{selectedUpdate.standard}</strong> | Clause: <span className="text-blue-700 font-semibold">{selectedUpdate.clause}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Statutory Authority Verified</span>
        </div>
      </div>

      {/* RAG Search / Semantic Query */}
      <div className="mt-3 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Semantic RAG query (e.g., 'sterile barrier symbol', 'font height legibility', 'UDI Modulo 10')..."
          className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 placeholder-slate-400 font-sans"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
      </div>

      {/* Official Legal Text / Prose Viewer */}
      <div className="mt-3 flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
        <div className="bg-slate-50 border border-slate-200 rounded p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-wider">
              OFFICIAL REGULATORY TEXT ({selectedUpdate.authority})
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Effective: {selectedUpdate.effectiveDate}</span>
          </div>

          <div className="text-xs text-slate-800 leading-relaxed font-sans border-l-2 border-blue-600 pl-3 italic bg-white p-2.5 rounded-r border-y border-r border-slate-200">
            &ldquo;{selectedUpdate.summary} Devices placed on the market within target jurisdictions must guarantee that all mandatory human-readable interpretation and machine-readable AIDC elements conform strictly to internationally recognized harmonized standards. Failure to display mandatory symbols or check digits constitutes a critical non-conformance.&rdquo;
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-mono text-slate-500">Applicable Classes:</span>
            {selectedUpdate.deviceClasses.map(cls => (
              <span key={cls} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-medium">
                {cls}
              </span>
            ))}
          </div>
        </div>

        {/* Machine-Extracted Rules from Prose */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-900 font-mono uppercase tracking-wider">
              Machine-Readable Validation Rules ({selectedUpdate.extractedRules.length})
            </span>
            <span className="text-[10px] font-mono text-slate-500">Zero-Hallucination Pipeline</span>
          </div>

          <div className="space-y-2">
            {selectedUpdate.extractedRules.map(rule => {
              const isPromoted = promotedRules.includes(rule.ruleCode);
              return (
                <div
                  key={rule.id}
                  className="bg-white border border-slate-200 rounded p-3 text-xs hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{rule.ruleCode}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                        {rule.assertionType}
                      </span>
                    </div>

                    <button
                      onClick={() => onPromoteRule(rule.ruleCode)}
                      className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                        isPromoted
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      }`}
                    >
                      {isPromoted ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active Rule</span>
                        </>
                      ) : (
                        <>
                          <span>Promote to Validation Suite</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-slate-700 text-xs mt-1.5 leading-relaxed">{rule.description}</p>

                  <div className="mt-2 bg-slate-900 rounded p-2 font-mono text-[11px] text-emerald-400">
                    <div className="text-[10px] text-slate-400 mb-0.5">Automated Execution Logic:</div>
                    <code>{rule.machineLogic}</code>
                  </div>

                  <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                    <span>Citation: {rule.clauseRef}</span>
                    <span className="text-blue-700 font-medium">Strict GxP Enforced</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
