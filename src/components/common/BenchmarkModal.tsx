import React from 'react';
import { X, CheckCircle2, Clock, AlertTriangle, ArrowRight, Zap, TrendingDown } from 'lucide-react';
import { AbbrTooltip } from './AbbrTooltip';

interface BenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BenchmarkModal: React.FC<BenchmarkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const traditionalSteps = [
    { step: 1, title: 'Manual Regulatory Gazette Tracking', duration: '3 Weeks', pain: 'Manual PDF reading across FDA, MDR & PMDA journals' },
    { step: 2, title: 'Spreadsheet Impact Search in ERP/PLM', duration: '2 Weeks', pain: 'Disconnected Excel sheets, missing SKU dependencies' },
    { step: 3, title: 'Manual Artwork Redline (Illustrator)', duration: '2 Weeks', pain: 'Font substitutions, accidental element shifts' },
    { step: 4, title: 'Vendor Translation Agency Routing', duration: '3 Weeks', pain: 'Translation drift, loss of clinical context tokens' },
    { step: 5, title: 'Physical Barcode & Quiet Zone Testing', duration: '1.5 Weeks', pain: 'Slow print runs, manual handheld verifier scans' },
    { step: 6, title: 'Multi-Department Siloed Email Reviews', duration: '4 Weeks', pain: 'Bottlenecks across RA, QA, Clinical and Packaging' },
    { step: 7, title: 'ECO Documentation & Disjointed Sign-off', duration: '3 Weeks', pain: 'Manual paper routing & fragmented audit trails' },
  ];

  const labelsensePhases = [
    { phase: '1. SENSE', title: 'Regulatory Intelligence Radar', duration: '2 Mins', benefit: 'Automated clause extraction & machine-readable rules' },
    { phase: '2. IMPACT', title: 'Knowledge Graph Digital Thread', duration: '15 Secs', benefit: 'Instant SKU-to-Artwork dependency traversal' },
    { phase: '3. AUTHOR', title: 'Template-Bound Anti-Hallucination', duration: '12 Mins', benefit: 'Locked QA phrase blocks & ISO symbol library' },
    { phase: '4. VALIDATE', title: '3-Layer Hybrid Verification', duration: '90 Secs', benefit: 'Modulo-10 GS1 check, pixel redline & neural back-translation' },
    { phase: '5. RELEASE', title: '21 CFR Part 11 E-Signature & Audit', duration: '8 Mins', benefit: 'Immutable hash chain & complete submission packet export' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl text-slate-800">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-blue-100 text-blue-800 border border-blue-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Operational ROI & Verification Lead-Time Benchmark
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                  -65% Lead-Time
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Direct head-to-head comparison: Traditional 14-Step Medical Device Labeling vs. LabelSense 5-Phase Workstation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded p-3.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                TOTAL CHANGE CYCLE TIME
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <div>
                  <div className="text-xs line-through text-rose-600">18 - 24 Weeks</div>
                  <div className="text-xl font-bold text-emerald-700 font-mono">~ 25 Minutes</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold border border-emerald-200">
                  -99.2% Time
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-3.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                INDUSTRY RECALL RISK
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <div>
                  <div className="text-xs line-through text-rose-600">4.8% Industry Avg</div>
                  <div className="text-xl font-bold text-emerald-700 font-mono">0.00% Zero-Escape</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold border border-emerald-200">
                  Deterministic
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-3.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                COST PER LABEL VARIANT <AbbrTooltip term="ECO">ECO</AbbrTooltip>
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <div>
                  <div className="text-xs line-through text-rose-600">$4,200 / SKU</div>
                  <div className="text-xl font-bold text-blue-700 font-mono">$280 / SKU</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-mono font-bold border border-blue-200">
                  93% Savings
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Step Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Traditional Column */}
            <div className="bg-rose-50/50 border border-rose-200 rounded p-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-rose-200 text-xs">
                <span className="font-semibold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Traditional 14-Step Flow
                </span>
                <span className="text-[11px] font-mono text-rose-700 font-semibold">Cumulative: ~18.5 Weeks</span>
              </div>
              <div className="mt-2.5 space-y-2">
                {traditionalSteps.map(item => (
                  <div key={item.step} className="bg-white p-2.5 rounded border border-rose-100 text-xs shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800">
                        {item.step}. {item.title}
                      </span>
                      <span className="text-rose-700 font-mono font-semibold text-[11px]">{item.duration}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.pain}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* LabelSense Automated Column */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded p-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200 text-xs">
                <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-600" /> LabelSense 5-Phase Flow
                </span>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold">Cumulative: ~25 Mins</span>
              </div>
              <div className="mt-2.5 space-y-2">
                {labelsensePhases.map((phase, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded border border-emerald-200 text-xs shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {phase.phase}: {phase.title}
                      </span>
                      <span className="text-emerald-700 font-mono font-semibold text-[11px]">{phase.duration}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{phase.benefit}</p>
                  </div>
                ))}

                <div className="mt-3 p-3 rounded bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Validated under GAMP 5 Category 4 / CSA Guidelines
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    Deterministic checks (GS1 Modulo-10, Symbol Aspect Ratios, Font Height) operate under zero-tolerance rules, guaranteeing 0% hallucinated packaging errors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
};
