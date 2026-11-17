import React, { useState } from 'react';
import { ArrowRightLeft, AlertOctagon, CheckCircle2, ShieldAlert, Sparkles, RefreshCw, Check, X } from 'lucide-react';
import { SEEDED_TRANSLATION_DRIFT_ANOMALY } from '../../data/translationMemory';
import { apiClient, BackendBackTranslationResponse } from '../../utils/apiClient';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface NeuralBackTranslationProps {
  hasAnomaly?: boolean;
}

export const NeuralBackTranslation: React.FC<NeuralBackTranslationProps> = ({
  hasAnomaly = false,
}) => {
  const anomaly = SEEDED_TRANSLATION_DRIFT_ANOMALY;
  const [liveResult, setLiveResult] = useState<BackendBackTranslationResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [decisionRecorded, setDecisionRecorded] = useState<string | null>(null);

  const handleRunLiveCheck = async () => {
    setIsRunning(true);
    setDecisionRecorded(null);
    try {
      const source = hasAnomaly ? anomaly.source : 'Do not re-use. Single use only. Store between 15°C and 25°C. Dimensions: 3.0 mm x 18 mm.';
      const target = hasAnomaly ? anomaly.drifted : '再使用しないでください。単回使用のみ。15°C〜25°Cで保管してください。寸法: 3.0 mm x 18 mm。';
      const res = await apiClient.checkBackTranslation(
        source,
        'Japanese (JA)',
        target,
        ['Do not re-use', '15°C', '25°C', '3.0 mm', '18 mm']
      );
      setLiveResult(res);
    } catch {
      alert('Unable to connect to AI back-translation service.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleDecision = async (decision: 'ACCEPT' | 'REJECT') => {
    try {
      await apiClient.recordReviewerDecision(
        'Neural Back-Translation Audit',
        'TRANS-JA-01',
        decision,
        `Reviewer decision: ${decision} on Japanese translation audit.`
      );
      setDecisionRecorded(decision);
    } catch (e: any) {
      alert(`Failed to record decision: ${e.message}`);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-sm text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Layer 3: Neural Back-Translation & Semantic Drift Engine
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              AI-assisted localization audit with deterministic number & unit guardrails
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunLiveCheck}
            disabled={isRunning}
            className="text-xs font-mono"
          >
            {isRunning ? (
              <RefreshCw className="h-3 w-3 animate-spin mr-1.5 text-teal-600" />
            ) : (
              <Sparkles className="h-3 w-3 mr-1.5 text-teal-600 dark:text-teal-400" />
            )}
            Run Live Audit
          </Button>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              !hasAnomaly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
            }`}
          >
            {!hasAnomaly ? 'DRIFT 0.00% (PASS)' : 'CRITICAL DRIFT DETECTED'}
          </span>
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto space-y-3.5 pr-1">
        {/* Live Result View if triggered */}
        {liveResult && (
          <div className="p-3.5 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/20 dark:bg-teal-950/20 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-teal-100 dark:border-teal-900/40">
              <span className="font-mono text-2xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                LIVE AUDIT RESULT ({liveResult.ai_provider.toUpperCase()})
              </span>
              <span className="text-2xs font-mono font-bold text-slate-700 dark:text-slate-300">
                Semantic Concordance: {(liveResult.semantic_similarity * 100).toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-2xs font-mono">
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400">Deterministic Numbers:</span>{' '}
                <strong className={liveResult.deterministic_number_match ? 'text-emerald-600' : 'text-red-600'}>
                  {liveResult.deterministic_number_match ? 'MATCH (100%)' : 'MISMATCH DETECTED'}
                </strong>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400">Deterministic Units:</span>{' '}
                <strong className={liveResult.deterministic_unit_match ? 'text-emerald-600' : 'text-red-600'}>
                  {liveResult.deterministic_unit_match ? 'MATCH (100%)' : 'MISMATCH DETECTED'}
                </strong>
              </div>
            </div>

            <div className="p-2.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-2xs font-mono text-slate-400 block mb-1">Back-Translated English:</span>
              <p className="text-slate-800 dark:text-slate-200 font-sans italic">
                &ldquo;{liveResult.back_translation}&rdquo;
              </p>
            </div>

            {liveResult.flagged_shifts.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-2xs font-mono text-red-700 dark:text-red-400 font-bold block">
                  Flagged Semantic Meaning Shifts:
                </span>
                {liveResult.flagged_shifts.map((shift, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-2xs text-red-900 dark:text-red-200"
                  >
                    <strong>[{shift.category.toUpperCase()}]:</strong> {shift.description}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-teal-100 dark:border-teal-900/40 flex items-center justify-between">
              <span className="text-2xs text-slate-500 font-mono">Reviewer Sign-off:</span>
              <div className="flex items-center gap-2">
                {decisionRecorded ? (
                  <span className="text-2xs font-mono text-emerald-600 font-bold">
                    Action Logged: {decisionRecorded}
                  </span>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDecision('REJECT')}
                      className="text-xs text-red-600"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Reject Translation
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDecision('ACCEPT')}
                      className="text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Approve Translation
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Existing Baseline Anomaly Display */}
        {hasAnomaly ? (
          <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-rose-900 dark:text-rose-200 font-bold flex items-center gap-1.5 text-xs">
                <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                CRITICAL CLINICAL HAZARD: SEMANTIC INVERSION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900/80 text-rose-900 dark:text-rose-100 font-bold">
                JAPANESE (JA) DRIFT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-rose-200 dark:border-rose-800">
                <div className="text-[10px] font-mono text-slate-500 mb-1">APPROVED SOURCE ENGLISH:</div>
                <p className="text-slate-900 dark:text-white font-medium font-sans">{anomaly.source}</p>
                <div className="mt-2 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                  ISO 15223-1 Ref 5.4.2 (Single Use Only)
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-rose-300 dark:border-rose-800">
                <div className="text-[10px] font-mono text-rose-800 dark:text-rose-300 mb-1 font-semibold">LOCALIZED TEXT (JAPANESE):</div>
                <p className="text-slate-900 dark:text-white font-medium font-sans">{anomaly.drifted}</p>
                <div className="mt-2 text-[10px] font-mono text-rose-700 dark:text-rose-400 font-bold">
                  {anomaly.backTranslated}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 text-[11px] text-slate-700 dark:text-slate-300 border border-rose-200 dark:border-rose-800 space-y-1">
              <div className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Root Cause Analysis & Clinical Risk:
              </div>
              <p className="leading-relaxed font-sans">{anomaly.reason}</p>
              <div className="pt-2 text-[10px] font-mono text-rose-700 dark:text-rose-400 font-bold">
                SYSTEM VERDICT: AUTOMATIC HARD BLOCK ROUTED TO CLINICAL REVIEW BOARD
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-900 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              All 21 Language Translations Parity Checked (No Semantic Drift)
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-sans">
              Neural back-translation across German, French, Spanish, Japanese, and Telugu yielded 100% concordance with source clinical warnings.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
              <div className="bg-white dark:bg-slate-900 p-2 rounded border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="text-slate-500 text-[10px]">GERMAN (DE)</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold">0.99 Score</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="text-slate-500 text-[10px]">FRENCH (FR)</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold">0.98 Score</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="text-slate-500 text-[10px]">SPANISH (ES)</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold">0.99 Score</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="text-slate-500 text-[10px]">JAPANESE (JA)</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold">0.97 Score</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
