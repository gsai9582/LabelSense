import React, { useState } from 'react';
import { GS1Checker } from './GS1Checker';
import { VisionRedline } from './VisionRedline';
import { NeuralBackTranslation } from './NeuralBackTranslation';
import { ConfidenceRouting } from './ConfidenceRouting';
import { LabelArtwork, DefectItem, ValidationTier, DemoScenarioKey } from '../../types';
import { Barcode, Eye, ArrowRightLeft } from 'lucide-react';

interface ValidateModuleProps {
  baselineArtwork: LabelArtwork;
  currentArtwork: LabelArtwork;
  currentScenario: DemoScenarioKey;
  onTriggerSignoff: () => void;
  onNavigateToAudit: () => void;
}

export const ValidateModule: React.FC<ValidateModuleProps> = ({
  baselineArtwork,
  currentArtwork,
  currentScenario,
  onTriggerSignoff,
  onNavigateToAudit,
}) => {
  const [activeLayerTab, setActiveLayerTab] = useState<'layer1' | 'layer2' | 'layer3'>('layer2');

  let score = 0.99;
  let tier: ValidationTier = 'GREEN';
  let defects: DefectItem[] = [];
  let hasTranslationAnomaly = false;

  if (currentScenario === 'SCENARIO_B') {
    score = 0.72;
    tier = 'RED';
    hasTranslationAnomaly = true;
    defects = [
      {
        id: 'DEF-01',
        type: 'DECIMAL_SHIFT',
        title: 'Decimal Shift Defect (Coronary Stent Perforation Risk)',
        description: 'Stent diameter shifted from 3.0 mm to 30 mm (10x expansion hazard). Injected defect detected via OCR bounding box analysis.',
        severity: 'CRITICAL',
        x: 18,
        y: 28,
        width: 32,
        height: 12,
        expected: '3.0 mm x 18 mm',
        actual: '30 mm x 18 mm',
        regulatoryRef: 'ISO 25539-2 / 21 CFR §820.30',
      },
      {
        id: 'DEF-02',
        type: 'MISSING_FIELD',
        title: 'Missing Mandatory Notified Body CE Mark',
        description: 'Class III medical device marketed in EU must carry CE mark accompanied by 4-digit Notified Body ID (0123).',
        severity: 'CRITICAL',
        x: 75,
        y: 80,
        width: 22,
        height: 15,
        expected: 'CE 0123 (TÜV SÜD)',
        actual: 'MISSING',
        regulatoryRef: 'EU MDR Annex V',
      },
      {
        id: 'DEF-03',
        type: 'ASPECT_RATIO',
        title: 'Distorted Symbol Aspect Ratio',
        description: 'Single sterile barrier symbol distorted below minimum ISO 15223-1 ratio (1:1 actual vs 1.6:1 required).',
        severity: 'MAJOR',
        x: 40,
        y: 78,
        width: 25,
        height: 14,
        expected: 'Aspect Ratio >= 1.55',
        actual: 'Aspect Ratio 1.02 (Distorted)',
        regulatoryRef: 'ISO 15223-1 Ref 5.2.11',
      }
    ];
  } else if (currentScenario === 'SCENARIO_C') {
    score = 0.91;
    tier = 'AMBER';
    defects = [
      {
        id: 'DEF-04',
        type: 'DECIMAL_SHIFT',
        title: 'Minor Storage Temperature Threshold Variance',
        description: 'Upper temperature changed from 30°C to 25°C without updated stability test protocol citation.',
        severity: 'MAJOR',
        x: 20,
        y: 60,
        width: 40,
        height: 14,
        expected: '15°C - 30°C',
        actual: '15°C - 25°C',
        regulatoryRef: 'ISO 15223-1 Ref 5.3.7',
      }
    ];
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-190px)] min-h-[640px]">
      {/* Left Column: 3 Verification Layers (8 cols) */}
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
            <span>Layer 2: Vision & OCR Auto-Redline</span>
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
