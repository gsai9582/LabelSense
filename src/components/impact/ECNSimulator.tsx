import React, { useState } from 'react';
import { GitPullRequest, Play, RefreshCw, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { ECNScenario } from '../../types';
import { ECN_SCENARIOS } from '../../data/mockLabelData';
import { AbbrTooltip } from '../common/AbbrTooltip';
import { apiClient, BackendImpactSummaryResponse } from '../../utils/apiClient';

interface ECNSimulatorProps {
  onRunTraversal: (scenario: ECNScenario) => void;
  isTraversing: boolean;
  activeScenario: ECNScenario;
  setActiveScenario: (scenario: ECNScenario) => void;
}

export const ECNSimulator: React.FC<ECNSimulatorProps> = ({
  onRunTraversal,
  isTraversing,
  activeScenario,
  setActiveScenario,
}) => {
  const [impactSummary, setImpactSummary] = useState<BackendImpactSummaryResponse | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleGenerateAiSummary = async () => {
    setIsSummarizing(true);
    try {
      const diffText = activeScenario.changes
        .map(c => `Field: ${c.field} | Old: ${c.oldValue} -> New: ${c.newValue} (Reason: ${c.reason})`)
        .join('\n');
      const res = await apiClient.getImpactSummary(activeScenario.id, diffText, [
        { id: activeScenario.targetSku, type: 'Target SKU' },
        { id: 'PRIMARY_BLISTER', type: 'Packaging Level' },
        { id: 'EU_MDR', type: 'Jurisdiction' },
      ]);
      setImpactSummary(res);
    } catch {
      alert('Unable to generate AI impact summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-sm text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
            <GitPullRequest className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Engineering Change Notice (<AbbrTooltip term="ECN">ECN</AbbrTooltip>)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select or model an upstream PLM/MES change to run graph impact analysis
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateAiSummary}
          disabled={isSummarizing}
          className="px-2.5 py-1 text-2xs font-mono font-medium rounded-md border border-teal-300 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 hover:bg-teal-100 flex items-center gap-1 transition-colors"
        >
          {isSummarizing ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3 text-teal-600" />
          )}
          <span>AI Impact Brief</span>
        </button>
      </div>

      <div className="mt-3 space-y-3 flex-1 overflow-y-auto pr-1">
        {/* AI Executive Summary Card if triggered */}
        {impactSummary && (
          <div className="p-3 rounded-lg border border-teal-200 dark:border-teal-900/60 bg-teal-50/30 dark:bg-teal-950/20 text-xs space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-teal-100 dark:border-teal-900/40">
              <span className="font-mono text-2xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-teal-600" />
                EXECUTIVE IMPACT BRIEF ({impactSummary.ecn_id})
              </span>
              <button
                onClick={() => setImpactSummary(null)}
                className="text-2xs text-slate-400 hover:text-slate-600"
              >
                Dismiss
              </button>
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
              {impactSummary.executive_brief}
            </p>
            <div className="text-2xs font-mono text-slate-600 dark:text-slate-400">
              Filing Pathway: <strong>{impactSummary.regulatory_filing_pathway}</strong>
            </div>
          </div>
        )}

        {/* Scenario Selector */}
        <div>
          <label className="block text-[10px] font-mono text-slate-500 mb-1 font-semibold">
            SELECT ACTIVE ECN SCENARIO
          </label>
          <div className="space-y-2">
            {ECN_SCENARIOS.map(sc => {
              const isSelected = activeScenario.id === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => {
                    setActiveScenario(sc);
                    setImpactSummary(null);
                  }}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50/50 border-teal-600 dark:border-teal-500 dark:bg-teal-950/30 ring-1 ring-teal-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-teal-700 dark:text-teal-300 font-bold">{sc.id}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      SKU: {sc.targetSku}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mt-1">{sc.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                    {sc.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Change Specification Details */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs space-y-2">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
            PROPOSED FIELD-LEVEL MODIFICATIONS
          </div>
          {activeScenario.changes.map((ch, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-700 space-y-1 shadow-2xs"
            >
              <div className="font-mono text-[11px] text-teal-800 dark:text-teal-300 font-semibold">
                {ch.field}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="text-rose-700 line-through truncate font-mono">
                  Old: {ch.oldValue}
                </div>
                <div className="text-emerald-700 font-semibold truncate font-mono">
                  New: {ch.newValue}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                Reason: {ch.reason}
              </div>
            </div>
          ))}
        </div>

        {/* Run Traversal CTA */}
        <button
          onClick={() => onRunTraversal(activeScenario)}
          disabled={isTraversing}
          className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
        >
          {isTraversing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Traversing Graph Across 148 SKUs & 21 Languages...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Execute Deterministic Graph Traversal</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
