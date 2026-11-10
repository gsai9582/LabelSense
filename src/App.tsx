import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { MetricsBanner } from './components/common/MetricsBanner';
import { BenchmarkModal } from './components/common/BenchmarkModal';
import { ESignatureModal } from './components/common/ESignatureModal';
import { SystemInfoModal } from './components/common/SystemInfoModal';
import { WhyTraceModal } from './components/audit/WhyTraceModal';

import { SenseModule } from './components/sense/SenseModule';
import { ImpactModule } from './components/impact/ImpactModule';
import { AuthorModule } from './components/author/AuthorModule';
import { ValidateModule } from './components/validate/ValidateModule';
import { AuditModule } from './components/audit/AuditModule';

import {
  DemoScenarioKey,
  LabelArtwork,
  ElectronicSignature
} from './types';
import {
  BASELINE_ARTWORK,
  SCENARIO_A_ARTWORK,
  SCENARIO_B_ARTWORK,
  SCENARIO_C_ARTWORK
} from './data/mockLabelData';
import { INITIAL_SIGNATURES } from './utils/auditTrail';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sense' | 'impact' | 'author' | 'validate' | 'audit'>('sense');
  const [currentScenario, setCurrentScenario] = useState<DemoScenarioKey>('SCENARIO_A');
  const [currentArtwork, setCurrentArtwork] = useState<LabelArtwork>(SCENARIO_A_ARTWORK);

  // Modals state
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);
  const [inspectedWhyTraceId, setInspectedWhyTraceId] = useState<string | null>(null);

  // Signatures store
  const [signatures, setSignatures] = useState<ElectronicSignature[]>(INITIAL_SIGNATURES);

  // Scenario Switcher handler
  const handleSelectScenario = (key: DemoScenarioKey) => {
    setCurrentScenario(key);
    if (key === 'SCENARIO_A') {
      setCurrentArtwork(SCENARIO_A_ARTWORK);
    } else if (key === 'SCENARIO_B') {
      setCurrentArtwork(SCENARIO_B_ARTWORK);
      setActiveTab('validate');
    } else if (key === 'SCENARIO_C') {
      setCurrentArtwork(SCENARIO_C_ARTWORK);
      setActiveTab('validate');
    }
  };

  const handleSignComplete = (sig: ElectronicSignature) => {
    setSignatures([sig, ...signatures]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Sticky Enterprise Header with Breadcrumbs, Live Status & 5-Stage Stepper */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
        onOpenSignModal={() => setIsSignModalOpen(true)}
        onOpenSystemInfo={() => setIsSystemInfoOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 py-3 flex flex-col">
        {/* Compact KPI Metrics Banner */}
        <MetricsBanner
          currentScenario={currentScenario}
          onOpenBenchmark={() => setIsBenchmarkOpen(true)}
        />

        {/* Dynamic Workflow Tab Content */}
        <div className="flex-1">
          {activeTab === 'sense' && <SenseModule />}
          {activeTab === 'impact' && (
            <ImpactModule onNavigateToAuthor={() => setActiveTab('author')} />
          )}
          {activeTab === 'author' && (
            <AuthorModule
              artwork={currentArtwork}
              onUpdateArtwork={setCurrentArtwork}
              onInspectElement={elementId => setInspectedWhyTraceId(elementId)}
            />
          )}
          {activeTab === 'validate' && (
            <ValidateModule
              baselineArtwork={BASELINE_ARTWORK}
              currentArtwork={currentArtwork}
              currentScenario={currentScenario}
              onTriggerSignoff={() => setIsSignModalOpen(true)}
              onNavigateToAudit={() => setActiveTab('audit')}
            />
          )}
          {activeTab === 'audit' && (
            <AuditModule
              artwork={currentArtwork}
              signatures={signatures}
              onOpenWhyTrace={elementId => setInspectedWhyTraceId(elementId)}
            />
          )}
        </div>
      </main>

      {/* Modals & Dialogs */}
      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />

      <ESignatureModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onSignComplete={handleSignComplete}
      />

      <SystemInfoModal
        isOpen={isSystemInfoOpen}
        onClose={() => setIsSystemInfoOpen(false)}
      />

      {inspectedWhyTraceId && (
        <WhyTraceModal
          elementId={inspectedWhyTraceId}
          onClose={() => setInspectedWhyTraceId(null)}
        />
      )}
    </div>
  );
};

export default App;
