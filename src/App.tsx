import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { AppShell, AppViewTab } from './components/layout/AppShell';
import { DashboardView } from './components/dashboard/DashboardView';
import { CompareView } from './components/compare/CompareView';
import { LoginModal } from './components/auth/LoginModal';

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
  ElectronicSignature,
} from './types';
import {
  BASELINE_ARTWORK,
  SCENARIO_A_ARTWORK,
  SCENARIO_B_ARTWORK,
  SCENARIO_C_ARTWORK,
} from './data/mockLabelData';
import {
  AuditEvent,
  INITIAL_AUDIT_LOGS,
  INITIAL_SIGNATURES,
  createChainedAuditEvent,
} from './utils/auditTrail';

const MainAppContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<AppViewTab>('dashboard');
  const [currentScenario, setCurrentScenario] = useState<DemoScenarioKey>('SCENARIO_A');
  const [currentArtwork, setCurrentArtwork] = useState<LabelArtwork>(SCENARIO_A_ARTWORK);

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);
  const [inspectedWhyTraceId, setInspectedWhyTraceId] = useState<string | null>(null);

  // Signatures and Audit events store
  const [signatures, setSignatures] = useState<ElectronicSignature[]>(INITIAL_SIGNATURES);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);

  // Scenario Switcher handler
  const handleSelectScenario = (key: DemoScenarioKey) => {
    setCurrentScenario(key);
    if (key === 'SCENARIO_A') {
      setCurrentArtwork(SCENARIO_A_ARTWORK);
    } else if (key === 'SCENARIO_B') {
      setCurrentArtwork(SCENARIO_B_ARTWORK);
      setCurrentTab('validate');
    } else if (key === 'SCENARIO_C') {
      setCurrentArtwork(SCENARIO_C_ARTWORK);
      setCurrentTab('validate');
    }
  };

  const handleLaunchApp = (initialTab: AppViewTab = 'dashboard') => {
    setCurrentTab(initialTab);
    setViewMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignComplete = async (sig: ElectronicSignature) => {
    setSignatures(prev => [sig, ...prev]);

    // Append cryptographic audit event for the signature
    const prevHash = auditEvents.length > 0 ? auditEvents[auditEvents.length - 1].currentHash : '0'.repeat(64);
    const newEvt = await createChainedAuditEvent({
      id: `AUD-00${auditEvents.length + 1}`,
      eventType: 'DEMO_SIGNATURE',
      actor: sig.userName,
      role: sig.userRole,
      action: 'Assistive Electronic Signature Captured',
      details: `Meaning: ${sig.meaning}. Signature Digest: ${sig.sha256Hash}`,
      previousHash: prevHash,
      systemVerdict: 'PASS',
    });
    setAuditEvents(prev => [...prev, newEvt]);
  };

  const handleAppendAuditLog = async (action: string, details: string, verdict: 'PASS' | 'REVIEW' | 'FAIL') => {
    const prevHash = auditEvents.length > 0 ? auditEvents[auditEvents.length - 1].currentHash : '0'.repeat(64);
    const newEvt = await createChainedAuditEvent({
      id: `AUD-00${auditEvents.length + 1}`,
      eventType: 'VALIDATION_RUN',
      actor: 'LabelSense Verification Engine',
      role: 'Deterministic Verification System',
      action,
      details,
      previousHash: prevHash,
      systemVerdict: verdict,
    });
    setAuditEvents(prev => [...prev, newEvt]);
  };

  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onLaunchApp={handleLaunchApp}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      </>
    );
  }

  return (
    <AppShell
      currentTab={currentTab}
      onNavigateTab={tab => setCurrentTab(tab)}
      currentScenario={currentScenario}
      onSelectScenario={handleSelectScenario}
      onOpenLogin={() => setIsLoginOpen(true)}
      onOpenSignModal={() => setIsSignModalOpen(true)}
      onOpenBenchmark={() => setIsBenchmarkOpen(true)}
      onOpenSystemInfo={() => setIsSystemInfoOpen(true)}
      onReturnToLanding={() => setViewMode('landing')}
    >
      {/* KPI Metrics Banner for verification workspace */}
      {currentTab !== 'dashboard' && (
        <div className="mb-4">
          <MetricsBanner
            currentScenario={currentScenario}
            onOpenBenchmark={() => setIsBenchmarkOpen(true)}
          />
        </div>
      )}

      {/* Main Tab View Contents */}
      {currentTab === 'dashboard' && (
        <DashboardView
          onSelectScenario={handleSelectScenario}
          onNavigateToTab={tab => setCurrentTab(tab as AppViewTab)}
          onOpenUpload={() => setCurrentTab('validate')}
        />
      )}

      {currentTab === 'compare' && (
        <CompareView
          onTriggerSignoff={() => setIsSignModalOpen(true)}
          onNavigateToAudit={() => setCurrentTab('audit')}
        />
      )}

      {currentTab === 'validate' && (
        <ValidateModule
          baselineArtwork={BASELINE_ARTWORK}
          currentArtwork={currentArtwork}
          currentScenario={currentScenario}
          onTriggerSignoff={() => setIsSignModalOpen(true)}
          onNavigateToAudit={() => setCurrentTab('audit')}
          onApplyUploadedArtwork={art => {
            setCurrentArtwork(art);
            setCurrentTab('validate');
          }}
          onAppendAuditLog={handleAppendAuditLog}
        />
      )}

      {currentTab === 'audit' && (
        <AuditModule
          artwork={currentArtwork}
          signatures={signatures}
          events={auditEvents}
          onOpenWhyTrace={elementId => setInspectedWhyTraceId(elementId)}
        />
      )}

      {currentTab === 'sense' && <SenseModule />}

      {currentTab === 'impact' && (
        <ImpactModule onNavigateToAuthor={() => setCurrentTab('author')} />
      )}

      {currentTab === 'author' && (
        <AuthorModule
          artwork={currentArtwork}
          onUpdateArtwork={setCurrentArtwork}
          onInspectElement={elementId => setInspectedWhyTraceId(elementId)}
        />
      )}

      {/* Modals & Dialogs */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

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
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MainAppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
