import React from 'react';
import { ShieldCheck, TrendingUp, CheckCircle2, AlertOctagon, ChevronRight, FileCheck } from 'lucide-react';
import { DemoScenarioKey } from '../../types';
import { AbbrTooltip } from './AbbrTooltip';

interface MetricsBannerProps {
  currentScenario: DemoScenarioKey;
  onOpenBenchmark: () => void;
}

export const MetricsBanner: React.FC<MetricsBannerProps> = ({ currentScenario, onOpenBenchmark }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {/* Metric 1 */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
            REGISTERED LABEL SKUS
          </span>
          <span className="p-1 rounded bg-slate-100 text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">148</span>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
            Active DHF Linked
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 truncate">
          Covering <AbbrTooltip term="MDR">EU MDR</AbbrTooltip>, <AbbrTooltip term="UDI">FDA UDI</AbbrTooltip>, PMDA, & MHRA
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
            REGULATORY CONFORMANCE
          </span>
          <span className="p-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-700 tracking-tight">99.4%</span>
          <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
            <AbbrTooltip term="CSA">GAMP 5 CSA</AbbrTooltip>
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 truncate">
          Continuous Modulo-10 & ISO 15223 audit
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
            CHANGE CYCLE REDUCTION
          </span>
          <span className="p-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <TrendingUp className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">65% Faster</span>
          <button
            onClick={onOpenBenchmark}
            className="text-[11px] font-mono text-blue-700 hover:text-blue-900 flex items-center font-medium"
          >
            ROI Detail <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 truncate">
          14-step manual timeline <span className="text-slate-400">➔</span> 5-phase automated flow
        </div>
      </div>

      {/* Metric 4 */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
            DEFECT REJECTION RATE
          </span>
          <span className={`p-1 rounded border ${
            currentScenario === 'SCENARIO_B'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <AlertOctagon className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">100%</span>
          <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
            currentScenario === 'SCENARIO_B'
              ? 'bg-rose-50 text-rose-700 border-rose-300'
              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
          }`}>
            {currentScenario === 'SCENARIO_B' ? 'CRITICAL FAULT BLOCKED' : 'ZERO ESCAPES'}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 truncate">
          Sub-pixel OCR, GS1 Modulo-10, & Neural Drift
        </div>
      </div>
    </div>
  );
};
