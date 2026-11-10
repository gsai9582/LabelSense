import React from 'react';
import { GitPullRequest, Play, RefreshCw, FileText } from 'lucide-react';
import { ECNScenario } from '../../types';
import { ECN_SCENARIOS } from '../../data/mockLabelData';
import { AbbrTooltip } from '../common/AbbrTooltip';

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
  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <GitPullRequest className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Engineering Change Notice (<AbbrTooltip term="ECN">ECN</AbbrTooltip>)
            </h3>
            <p className="text-[11px] text-slate-500">
              Select or model an upstream PLM/MES change to run graph impact analysis
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-3 flex-1 overflow-y-auto pr-1 text-xs">
        {/* Scenario Selector */}
        <div>
          <label className="block text-[10px] font-mono text-slate-600 mb-1 font-semibold">
            SELECT ACTIVE ECN SCENARIO
          </label>
          <div className="space-y-2">
            {ECN_SCENARIOS.map(sc => {
              const isSelected = activeScenario.id === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => setActiveScenario(sc)}
                  className={`p-2.5 rounded border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-blue-700 font-bold">{sc.id}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      SKU: {sc.targetSku}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mt-1">{sc.title}</h4>
                  <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">{sc.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Change Specification Details */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2">
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider font-bold">
            PROPOSED FIELD-LEVEL MODIFICATIONS
          </div>
          {activeScenario.changes.map((ch, idx) => (
            <div key={idx} className="bg-white p-2 rounded border border-slate-200 space-y-1 shadow-2xs">
              <div className="font-mono text-[11px] text-blue-800 font-semibold">
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
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                Reason: {ch.reason}
              </div>
            </div>
          ))}
        </div>

        {/* Run Traversal CTA */}
        <button
          onClick={() => onRunTraversal(activeScenario)}
          disabled={isTraversing}
          className="w-full py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
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
