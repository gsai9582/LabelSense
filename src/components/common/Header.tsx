import React from 'react';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { DemoScenarioKey } from '../../types';

interface HeaderProps {
  activeTab: 'sense' | 'impact' | 'author' | 'validate' | 'audit';
  setActiveTab: (tab: 'sense' | 'impact' | 'author' | 'validate' | 'audit') => void;
  currentScenario: DemoScenarioKey;
  onSelectScenario: (scenario: DemoScenarioKey) => void;
  onOpenBenchmark: () => void;
  onOpenSignModal: () => void;
  onOpenSystemInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentScenario,
  onSelectScenario,
  onOpenBenchmark,
  onOpenSignModal,
  onOpenSystemInfo,
}) => {
  const steps = [
    { id: 'sense', step: '1', name: 'SENSE', title: 'Regulatory Intelligence', time: '12ms' },
    { id: 'impact', step: '2', name: 'IMPACT', title: 'Digital Thread Graph', time: '34ms' },
    { id: 'author', step: '3', name: 'AUTHOR', title: 'Template Slot Binder', time: '8ms' },
    { id: 'validate', step: '4', name: 'VALIDATE', title: '3-Layer Redline', time: '45ms' },
    { id: 'audit', step: '5', name: 'AUDIT / RELEASE', title: '21 CFR Part 11', time: '16ms' },
  ] as const;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 text-slate-800 shadow-xs">
      {/* Top Ribbon / Hackathon & Project Attribution Bar */}
      <div className="px-4 py-1.5 bg-slate-900 text-white flex flex-wrap items-center justify-between text-[11px] font-mono border-b border-slate-800">
        {/* Left: Clean Breadcrumb */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-400">Projects</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">Cardiac-Stents</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-200 font-semibold">Stent-CS400</span>
          <span className="text-slate-500">/</span>
          <span className="text-blue-400 font-semibold">Label Verification #ECO-2026-1042</span>
        </div>

        {/* Center: Live Status Indicator */}
        <div className="hidden md:flex items-center gap-2 text-slate-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live Validation Engine: <strong className="text-emerald-400">Online</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Ruleset: EU MDR Annex I & FDA 21 CFR §801</span>
        </div>

        {/* Right: Team Tag & System Specs Link */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            <strong className="text-white">Team MarkRight</strong> • CodeQuest 2026 Round 2
          </span>
          <span className="text-slate-600">|</span>
          <button
            onClick={onOpenSystemInfo}
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
          >
            [System Info & Architecture Specs]
          </button>
        </div>
      </div>

      {/* Main Bar: Clean Logo + Preset Scenarios + Signoff CTA */}
      <div className="px-5 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-slate-200/80 bg-white">
        {/* Modern Minimalist Medical Logo */}
        <div className="flex items-center gap-3">
          {/* Dual-Tone Geometric Medical Badge SVG */}
          <div className="w-9 h-9 rounded bg-slate-900 border border-slate-800 p-1.5 flex items-center justify-center text-white flex-shrink-0 shadow-xs">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white">
              {/* Packaging tag silhouette */}
              <path
                d="M4 4C4 2.89543 4.89543 2 6 2H14.5858C15.1162 2 15.6249 2.21071 16 2.58579L20.4142 7C20.7893 7.37511 21 7.88378 21 8.41421V20C21 21.1046 20.1046 22 19 22H6C4.89543 22 4 21.1046 4 20V4Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* GS1 DataMatrix grid hint */}
              <rect x="7" y="6" width="3" height="3" fill="#38bdf8" />
              <rect x="11" y="6" width="3" height="3" fill="#ffffff" />
              <rect x="7" y="10" width="3" height="3" fill="#ffffff" />
              <rect x="11" y="10" width="3" height="3" fill="#38bdf8" />
              {/* Verification checkmark */}
              <path
                d="M7 16L10 19L17 12"
                stroke="#10b981"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Label<span className="text-blue-700">Sense</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-300 font-semibold">
                v2.4-pilot
              </span>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                • MedTech Regulatory & Label Verification Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              GAMP 5 CSA Category 4 Automated UDI & Artwork Assurance Workstation
            </p>
          </div>
        </div>

        {/* Right Utility: Jury Evaluation Presets Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded border border-slate-200 text-xs">
            <span className="text-[11px] font-mono font-semibold text-slate-600 px-2 uppercase tracking-wider">
              Jury Evaluation Presets:
            </span>
            <button
              onClick={() => onSelectScenario('SCENARIO_A')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                currentScenario === 'SCENARIO_A'
                  ? 'bg-white text-emerald-800 border border-emerald-300 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Scenario 1: Green Tier (Clean ECN)
            </button>

            <button
              onClick={() => onSelectScenario('SCENARIO_C')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                currentScenario === 'SCENARIO_C'
                  ? 'bg-white text-amber-800 border border-amber-300 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Scenario 3: Amber Tier (Review Flag)
            </button>

            <button
              onClick={() => onSelectScenario('SCENARIO_B')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                currentScenario === 'SCENARIO_B'
                  ? 'bg-white text-rose-800 border border-rose-300 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              Scenario 2: Red Tier (Critical Fault)
            </button>
          </div>

          <button
            onClick={onOpenSignModal}
            className="px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors font-mono"
          >
            <Lock className="w-3.5 h-3.5" />
            21 CFR Part 11 Sign-off
          </button>
        </div>
      </div>

      {/* 5-Stage Medical Engineering Workflow Bar */}
      <nav className="px-5 bg-slate-50 border-b border-slate-200 flex items-center overflow-x-auto">
        <div className="flex items-center space-x-1 py-1 w-full text-xs">
          {steps.map((st, idx) => {
            const isActive = activeTab === st.id;
            const isCompleted = steps.findIndex(s => s.id === activeTab) > idx;

            return (
              <React.Fragment key={st.id}>
                <button
                  onClick={() => setActiveTab(st.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 border-b-2 font-medium transition-all whitespace-nowrap rounded-t ${
                    isActive
                      ? 'border-blue-700 text-blue-900 bg-white font-semibold shadow-xs'
                      : isCompleted
                      ? 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isCompleted ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold border border-emerald-300">
                      ✓
                    </span>
                  ) : (
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {st.step}
                    </span>
                  )}

                  <span className="font-semibold">{st.name}</span>
                  <span className="text-[11px] text-slate-500 hidden xl:inline">({st.title})</span>

                  {isCompleted && (
                    <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200">
                      {st.time}
                    </span>
                  )}
                </button>

                {idx < steps.length - 1 && (
                  <span className="text-slate-300 select-none">──&gt;</span>
                )}
              </React.Fragment>
            );
          })}

          <div className="ml-auto pl-4 hidden md:flex items-center gap-2">
            <button
              onClick={onOpenBenchmark}
              className="text-[11px] font-mono text-slate-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 shadow-xs"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Pilot ROI Timeline (-65% Cycle)</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
