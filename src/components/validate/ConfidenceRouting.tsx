import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, ArrowRight, CheckCircle2, UserCheck, FileSignature } from 'lucide-react';
import { ValidationTier } from '../../types';
import { AbbrTooltip } from '../common/AbbrTooltip';

interface ConfidenceRoutingProps {
  score: number; // 0.0 to 1.0
  tier: ValidationTier;
  onTriggerSignoff: () => void;
  onNavigateToAudit: () => void;
}

export const ConfidenceRouting: React.FC<ConfidenceRoutingProps> = ({
  score,
  tier,
  onTriggerSignoff,
  onNavigateToAudit,
}) => {
  const percentage = Math.round(score * 100);

  const getTierDetails = () => {
    switch (tier) {
      case 'GREEN':
        return {
          title: 'GREEN TIER: FAST-TRACK ELIGIBLE',
          subtitle: 'All deterministic rules, GS1 check digits, and neural translation tokens passed at 100%.',
          color: 'text-emerald-800',
          border: 'border-emerald-300',
          bg: 'bg-emerald-50/70',
          route: 'Single QA Lead E-Signature (21 CFR Part 11 Fast-Track)',
          sla: 'Immediate Release (~ 5 mins)',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
        };
      case 'AMBER':
        return {
          title: 'AMBER TIER: SPECIALIST REVIEW ROUTING',
          subtitle: 'Minor layout shift or translation nuance detected. Requires human verification before release.',
          color: 'text-amber-800',
          border: 'border-amber-300',
          bg: 'bg-amber-50/70',
          route: 'Regulatory Affairs Specialist + Localization Lead Review',
          sla: '24-Hour Review Turnaround',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        };
      case 'RED':
      default:
        return {
          title: 'RED TIER: AUTOMATIC HARD BLOCK',
          subtitle: 'Critical compliance non-conformance (GS1 Modulo-10 mismatch, missing symbol, or clinical warning inversion).',
          color: 'text-rose-800',
          border: 'border-rose-300',
          bg: 'bg-rose-50/70',
          route: 'Triple Sign-off: RA Director + VP QA + Clinical Review Board',
          sla: 'Production Release Suspended',
          icon: <XCircle className="w-5 h-5 text-rose-600" />,
        };
    }
  };

  const details = getTierDetails();

  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Risk-Scored Human-In-The-Loop Routing
            </h3>
            <p className="text-[11px] text-slate-500">
              <AbbrTooltip term="CSA">GAMP 5 CSA</AbbrTooltip> Risk-Categorized Release Workflow
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex-1 flex flex-col justify-between space-y-4">
        {/* Score Dial & Metrics */}
        <div className="flex items-center justify-center py-1">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG Radial Gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#e2e8f0"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={tier === 'GREEN' ? '#059669' : tier === 'AMBER' ? '#d97706' : '#dc2626'}
                strokeWidth="7"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * percentage) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 font-mono">{percentage}%</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
                Confidence
              </span>
            </div>
          </div>
        </div>

        {/* Tier Card */}
        <div className={`p-3.5 rounded border ${details.border} ${details.bg} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className={`font-mono font-bold text-xs flex items-center gap-1.5 ${details.color}`}>
              {details.icon}
              {details.title}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-semibold shadow-2xs">
              Score: {score.toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-sans">{details.subtitle}</p>

          <div className="bg-white p-2.5 rounded border border-slate-200 text-xs font-mono space-y-1 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Routing Path:</span>
              <span className="text-blue-900 font-semibold">{details.route}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">SLA Clearance:</span>
              <span className="text-slate-800">{details.sla}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {tier === 'GREEN' && (
            <button
              onClick={onTriggerSignoff}
              className="w-full py-2.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors font-mono"
            >
              <FileSignature className="w-4 h-4" />
              <span>Fast-Track Part 11 Electronic Signature</span>
            </button>
          )}

          {tier === 'AMBER' && (
            <button
              onClick={onNavigateToAudit}
              className="w-full py-2.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors font-mono"
            >
              <UserCheck className="w-4 h-4" />
              <span>Route to RA & Localization Specialist</span>
            </button>
          )}

          {tier === 'RED' && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-300 text-rose-900 text-xs font-mono text-center leading-relaxed">
              <strong>CRITICAL NON-CONFORMANCE:</strong> Release blocked until GS1 check digit and symbols resolved.
            </div>
          )}

          <button
            onClick={onNavigateToAudit}
            className="w-full py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
          >
            <span>Inspect Immutable Audit Trail & Why-Trace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
