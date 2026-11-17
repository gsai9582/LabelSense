import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { DemoScenarioKey } from '../../types';
import {
  ShieldCheck,
  FileCheck2,
  GitCompare,
  History,
  LayoutDashboard,
  Layers,
  ChevronDown,
  Sun,
  Moon,
  Lock,
  ExternalLink,
  Info,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LogOut,
  User,
} from 'lucide-react';

export type AppViewTab =
  | 'dashboard'
  | 'validate'
  | 'compare'
  | 'audit'
  | 'sense'
  | 'impact'
  | 'author';

interface AppShellProps {
  currentTab: AppViewTab;
  onNavigateTab: (tab: AppViewTab) => void;
  currentScenario: DemoScenarioKey;
  onSelectScenario: (scenario: DemoScenarioKey) => void;
  onOpenLogin: () => void;
  onOpenSignModal: () => void;
  onOpenBenchmark: () => void;
  onOpenSystemInfo: () => void;
  onReturnToLanding: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onNavigateTab,
  currentScenario,
  onSelectScenario,
  onOpenLogin,
  onOpenSignModal,
  onOpenBenchmark,
  onOpenSystemInfo,
  onReturnToLanding,
  children,
}) => {
  const { user, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isWorkflowsDropdownOpen, setIsWorkflowsDropdownOpen] = useState(false);

  const workflows = [
    { id: 'sense', step: '1', name: 'Sense', desc: 'Regulatory Radar & RAG' },
    { id: 'impact', step: '2', name: 'Impact', desc: 'Digital Thread Graph' },
    { id: 'author', step: '3', name: 'Author', desc: 'Template Slot Binder' },
    { id: 'validate', step: '4', name: 'Validate', desc: '3-Layer Redline & GS1' },
    { id: 'audit', step: '5', name: 'Release', desc: 'Audit Trail & Signoff' },
  ] as const;

  const isWorkflowActive = ['sense', 'impact', 'author', 'validate', 'audit'].includes(currentTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-xs font-semibold"
      >
        Skip to main content
      </a>

      {/* Top Clinical Utility Bar */}
      <div className="px-4 py-1.5 bg-slate-900 text-slate-300 flex flex-wrap items-center justify-between text-2xs font-mono border-b border-slate-800 select-none">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Project:</span>
          <span className="text-slate-200 font-semibold">CardiaVance-Lead-CS400</span>
          <span className="text-slate-600">/</span>
          <span className="text-teal-400 font-medium">ECO-2026-1042</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-400">Class III Active Implantable</span>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-slate-400">
          <span className="inline-flex items-center gap-1.5 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Verification Engine: Ready
          </span>
          <span className="text-slate-600">|</span>
          <span>GS1 Modulo-10 Deterministic</span>
          <span className="text-slate-600">|</span>
          <span>FIPS 180-4 SHA-256 Chained</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSystemInfo}
            className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors"
          >
            System Specs & Docs
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={onReturnToLanding}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Landing Page
          </button>
        </div>
      </div>

      {/* Main Clinical Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Left: Brand + Main Nav */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div
              onClick={() => onNavigateTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="h-7 w-7 rounded bg-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                LS
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white leading-none">
                    LabelSense
                  </span>
                  <span className="text-2xs font-mono px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    assistive
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onNavigateTab('dashboard')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  currentTab === 'dashboard'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </button>

              <button
                onClick={() => onNavigateTab('validate')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  currentTab === 'validate'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <FileCheck2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                Verify & Ingest
              </button>

              <button
                onClick={() => onNavigateTab('compare')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  currentTab === 'compare'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <GitCompare className="h-3.5 w-3.5" />
                Compare
              </button>

              <button
                onClick={() => onNavigateTab('audit')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  currentTab === 'audit'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <History className="h-3.5 w-3.5" />
                Audit Trail
              </button>

              {/* 5-Workflow Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsWorkflowsDropdownOpen(!isWorkflowsDropdownOpen)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    ['sense', 'impact', 'author'].includes(currentTab)
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Workflows</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {isWorkflowsDropdownOpen && (
                  <div
                    onClick={() => setIsWorkflowsDropdownOpen(false)}
                    className="absolute left-0 mt-1 w-56 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg py-1 z-50 text-xs"
                  >
                    <div className="px-3 py-1.5 text-2xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 font-semibold">
                      Regulated 5-Step Pipeline
                    </div>
                    {workflows.map(wf => (
                      <button
                        key={wf.id}
                        onClick={() => onNavigateTab(wf.id as AppViewTab)}
                        className={`w-full px-3 py-2 text-left flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
                          currentTab === wf.id ? 'bg-teal-50/50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-medium' : ''
                        }`}
                      >
                        <span className="font-mono text-2xs font-bold text-slate-400 mt-0.5">
                          0{wf.step}
                        </span>
                        <div>
                          <div className="font-semibold text-xs text-slate-900 dark:text-white">
                            {wf.name}
                          </div>
                          <div className="text-2xs text-slate-400">{wf.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Center/Right: Scenario Switcher + User Controls */}
          <div className="flex items-center gap-2.5">
            {/* Scenario Quick Selector (Demo presets) */}
            <div className="hidden xl:flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-2xs font-mono text-slate-500 px-2 uppercase tracking-wider">
                Scenario:
              </span>
              <button
                onClick={() => onSelectScenario('SCENARIO_A')}
                className={`px-2 py-1 rounded text-2xs font-medium transition-colors flex items-center gap-1.5 ${
                  currentScenario === 'SCENARIO_A'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                A: Pass
              </button>

              <button
                onClick={() => onSelectScenario('SCENARIO_B')}
                className={`px-2 py-1 rounded text-2xs font-medium transition-colors flex items-center gap-1.5 ${
                  currentScenario === 'SCENARIO_B'
                    ? 'bg-white dark:bg-slate-900 text-red-700 dark:text-red-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                B: Critical Checksum
              </button>

              <button
                onClick={() => onSelectScenario('SCENARIO_C')}
                className={`px-2 py-1 rounded text-2xs font-medium transition-colors flex items-center gap-1.5 ${
                  currentScenario === 'SCENARIO_C'
                    ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                C: Review Expiry
              </button>
            </div>

            {/* Electronic Signoff Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSignModal}
              className="hidden sm:inline-flex text-xs font-mono"
            >
              <Lock className="h-3 w-3 mr-1 text-teal-600 dark:text-teal-400" />
              Sign-off
            </Button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Role & Persona Pill */}
            <div
              onClick={onOpenLogin}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenLogin();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Logged in as ${user?.name}, role ${role}. Click to switch role.`}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
              title="Click to switch persona / role"
            >
              <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-2xs">
                {user?.name.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xs font-semibold text-slate-900 dark:text-white leading-none">
                  {user?.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                  {role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Step Pipeline Sub-Header (When in a workflow view) */}
        {isWorkflowActive && (
          <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 px-4 sm:px-6">
            <div className="max-w-[1720px] mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {workflows.map((wf, idx) => {
                const isActive = currentTab === wf.id;
                return (
                  <button
                    key={wf.id}
                    onClick={() => onNavigateTab(wf.id as AppViewTab)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-semibold shadow-xs border border-slate-200 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-2xs text-slate-400">0{wf.step}</span>
                    <span>{wf.name}</span>
                    <span className="text-2xs text-slate-400 hidden lg:inline">({wf.desc})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Workspace Body with Smooth Subtle Motion */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 py-4 flex flex-col focus:outline-none">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </main>

      {/* Clinical Status Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 sm:px-6 text-2xs text-slate-500 dark:text-slate-400">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span>LabelSense AI v1.2</span>
            <span>•</span>
            <span className="text-slate-400">Assistive Medical Device Verification Engine</span>
            <span>•</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              Deterministic Modulo-10 Active
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <span>FIPS 180-4 SHA-256 Chained</span>
            <span>•</span>
            <button
              onClick={onOpenBenchmark}
              className="text-teal-600 dark:text-teal-400 hover:underline"
            >
              Benchmark Suite
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
