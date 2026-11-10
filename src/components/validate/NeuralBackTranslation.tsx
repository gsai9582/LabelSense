import React from 'react';
import { ArrowRightLeft, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SEEDED_TRANSLATION_DRIFT_ANOMALY } from '../../data/translationMemory';
import { AbbrTooltip } from '../common/AbbrTooltip';

interface NeuralBackTranslationProps {
  hasAnomaly?: boolean;
}

export const NeuralBackTranslation: React.FC<NeuralBackTranslationProps> = ({
  hasAnomaly = false,
}) => {
  const anomaly = SEEDED_TRANSLATION_DRIFT_ANOMALY;

  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <ArrowRightLeft className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Layer 3: Neural Back-Translation & Semantic Drift Detector
            </h3>
            <p className="text-[11px] text-slate-500">
              Bi-directional semantic comparison detecting clinical nuance shifts
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
          !hasAnomaly
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : 'bg-rose-50 text-rose-800 border-rose-300'
        }`}>
          {!hasAnomaly ? 'DRIFT 0.00% (PASS)' : 'CRITICAL DRIFT DETECTED'}
        </span>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
        {hasAnomaly ? (
          <div className="bg-rose-50/70 border border-rose-300 rounded p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-rose-900 font-bold flex items-center gap-1.5 text-xs">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                CRITICAL CLINICAL HAZARD: SEMANTIC INVERSION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold">
                JAPANESE (JA) DRIFT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded border border-rose-200">
                <div className="text-[10px] font-mono text-slate-500 mb-1">APPROVED SOURCE ENGLISH:</div>
                <p className="text-slate-900 font-medium font-sans">{anomaly.source}</p>
                <div className="mt-2 text-[10px] font-mono text-emerald-700 font-semibold">
                  ISO 15223-1 Ref 5.4.2 (Single Use Only)
                </div>
              </div>

              <div className="bg-white p-3 rounded border border-rose-300">
                <div className="text-[10px] font-mono text-rose-800 mb-1 font-semibold">LOCALIZED TEXT (JAPANESE):</div>
                <p className="text-slate-900 font-medium font-sans">{anomaly.drifted}</p>
                <div className="mt-2 text-[10px] font-mono text-rose-700 font-bold">
                  {anomaly.backTranslated}
                </div>
              </div>
            </div>

            <div className="bg-white rounded p-3 text-[11px] text-slate-700 border border-rose-200 space-y-1">
              <div className="font-bold text-rose-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Root Cause Analysis & Clinical Risk:
              </div>
              <p className="leading-relaxed font-sans">{anomaly.reason}</p>
              <div className="pt-2 text-[10px] font-mono text-rose-700 font-bold">
                SYSTEM VERDICT: AUTOMATIC HARD BLOCK ROUTED TO CLINICAL REVIEW BOARD
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/70 border border-emerald-300 rounded p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              All 21 Language Translations Parity Checked (No Semantic Drift)
            </div>
            <p className="text-slate-600 text-xs leading-relaxed font-sans">
              Neural back-translation across German, French, Spanish, Japanese, and Telugu yielded 100% concordance with source clinical warnings.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
              <div className="bg-white p-2 rounded border border-emerald-200 text-center">
                <div className="text-slate-500 text-[10px]">GERMAN (DE)</div>
                <div className="text-emerald-700 font-bold">0.99 Score</div>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200 text-center">
                <div className="text-slate-500 text-[10px]">FRENCH (FR)</div>
                <div className="text-emerald-700 font-bold">0.99 Score</div>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200 text-center">
                <div className="text-slate-500 text-[10px]">SPANISH (ES)</div>
                <div className="text-emerald-700 font-bold">0.99 Score</div>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200 text-center">
                <div className="text-slate-500 text-[10px]">JAPANESE (JA)</div>
                <div className="text-emerald-700 font-bold">0.98 Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Translation Memory Lock Token Audit */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-2">
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider font-bold">
            CLINICAL TOKEN INTEGRITY AUDIT
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <span className="text-blue-800">Locked Token: {'{{STERILE_EO}}'}</span>
              <span className="text-emerald-700 font-bold">100% Preservation</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <span className="text-blue-800">Locked Token: {'{{SINGLE_USE}}'}</span>
              <span className={hasAnomaly ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                {hasAnomaly ? 'FAILED IN JA' : '100% Preservation'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <span className="text-blue-800">Locked Token: {'{{TEMP_MIN_15}}'}</span>
              <span className="text-emerald-700 font-bold">100% Preservation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
