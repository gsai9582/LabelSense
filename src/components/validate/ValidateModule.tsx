import React, { useState } from 'react';
import { GS1Checker } from './GS1Checker';
import { VisionRedline } from './VisionRedline';
import { NeuralBackTranslation } from './NeuralBackTranslation';
import { ConfidenceRouting } from './ConfidenceRouting';
import { DocumentUploadProcessor } from './DocumentUploadProcessor';
import { LabelArtwork, DefectItem, ValidationTier, DemoScenarioKey } from '../../types';
import { executeDynamicValidation } from '../../utils/validationEngine';
import { Barcode, Eye, ArrowRightLeft, Upload } from 'lucide-react';

interface ValidateModuleProps {
  baselineArtwork: LabelArtwork;
  currentArtwork: LabelArtwork;
  currentScenario: DemoScenarioKey;
  onTriggerSignoff: () => void;
  onNavigateToAudit: () => void;
  onApplyUploadedArtwork?: (artwork: LabelArtwork) => void;
  onAppendAuditLog?: (action: string, details: string, verdict: 'PASS' | 'REVIEW' | 'FAIL') => void;
}

export const ValidateModule: React.FC<ValidateModuleProps> = ({
  baselineArtwork,
  currentArtwork,
  currentScenario,
  onTriggerSignoff,
  onNavigateToAudit,
  onApplyUploadedArtwork,
  onAppendAuditLog,
}) => {
  const [activeLayerTab, setActiveLayerTab] = useState<'layer1' | 'layer2' | 'layer3' | 'upload'>('layer1');

  // Execute dynamic multi-layer validation
  const validationRes = executeDynamicValidation(currentArtwork, baselineArtwork, {
    forceSimulatedVisionDefects: currentScenario === 'SCENARIO_B',
    hasTranslationAnomaly: currentScenario === 'SCENARIO_B' || currentScenario === 'SCENARIO_C',
  });

  const { score, tier, defects } = validationRes;
  const hasTranslationAnomaly = currentScenario === 'SCENARIO_B' || currentScenario === 'SCENARIO_C';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-190px)] min-h-[640px]">
      {/* Left Column: 4 Verification Layers (8 cols) */}
      <div className="lg:col-span-8 h-full flex flex-col">
        {/* Verification Layer Switcher Tabs */}
        <div className="flex items-center bg-slate-100 rounded border border-slate-200 p-0.5 mb-2 text-xs font-medium">
          <button
            onClick={() => setActiveLayerTab('layer1')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all ${
              activeLayerTab === 'layer1'
                ? 'bg-white text-blue-900 font-semibold shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Barcode className="w-3.5 h-3.5 text-blue-700" />
            <span>Layer 1: GS1 Modulo-10 & Schema</span>
          </button>

          <button
            onClick={() => setActiveLayerTab('layer2')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all ${
              activeLayerTab === 'layer2'
                ? 'bg-white text-blue-900 font-semibold shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-700" />
            <span>Layer 2: Vision & Auto-Redline</span>
            {defects.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 rounded bg-rose-600 text-white font-bold">
                {defects.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveLayerTab('layer3')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all ${
              activeLayerTab === 'layer3'
                ? 'bg-white text-blue-900 font-semibold shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-700" />
            <span>Layer 3: Neural Back-Translation</span>
          </button>

          <button
            onClick={() => setActiveLayerTab('upload')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all ${
              activeLayerTab === 'upload'
                ? 'bg-white text-blue-900 font-semibold shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-blue-700" />
            <span>Document Processing Pipeline</span>
          </button>
        </div>

        {/* Active Layer Screen */}
        <div className="flex-1 overflow-hidden">
          {activeLayerTab === 'layer1' && (
            <GS1Checker artwork={currentArtwork} />
          )}
          {activeLayerTab === 'layer2' && (
            <VisionRedline
              baselineArtwork={baselineArtwork}
              currentArtwork={currentArtwork}
              defects={defects}
            />
          )}
          {activeLayerTab === 'layer3' && (
            <NeuralBackTranslation hasAnomaly={hasTranslationAnomaly} />
          )}
          {activeLayerTab === 'upload' && (
            <DocumentUploadProcessor
              baselineArtwork={baselineArtwork}
              onApplyArtwork={art => {
                if (onApplyUploadedArtwork) onApplyUploadedArtwork(art);
                setActiveLayerTab('layer1');
              }}
              onAppendAuditLog={onAppendAuditLog}
              onTriggerSignoff={onTriggerSignoff}
              onNavigateToAudit={onNavigateToAudit}
            />
          )}
        </div>
      </div>

      {/* Right Column: Confidence Score Dial & Risk Routing (4 cols) */}
      <div className="lg:col-span-4 h-full">
        <ConfidenceRouting
          score={score}
          tier={tier}
          onTriggerSignoff={onTriggerSignoff}
          onNavigateToAudit={onNavigateToAudit}
        />
      </div>
    </div>
  );
};
