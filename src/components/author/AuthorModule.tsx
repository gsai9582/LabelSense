import React, { useState } from 'react';
import { AntiHallucinationEditor } from './AntiHallucinationEditor';
import { SymbolPicker } from './SymbolPicker';
import { TranslationMatrix } from './TranslationMatrix';
import { LiveArtworkCanvas } from './LiveArtworkCanvas';
import { LabelArtwork } from '../../types';
import { Layers, ShieldCheck, Languages } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface AuthorModuleProps {
  artwork: LabelArtwork;
  onUpdateArtwork: (updated: LabelArtwork) => void;
  onInspectElement: (elementId: string) => void;
}

export const AuthorModule: React.FC<AuthorModuleProps> = ({
  artwork,
  onUpdateArtwork,
  onInspectElement,
}) => {
  const [leftTab, setLeftTab] = useState<'template' | 'symbols' | 'translations'>('template');

  const handleToggleSymbol = (symbolId: string) => {
    const current = artwork.symbols;
    const next = current.includes(symbolId)
      ? current.filter(id => id !== symbolId)
      : [...current, symbolId];
    onUpdateArtwork({ ...artwork, symbols: next });
  };

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-190px)] min-h-[640px]">
      {/* Honesty Disclosure Banner */}
      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-2xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Module 3: AUTHOR — Anti-Hallucination Template Slot Binder
          </span>
          <Badge variant="neutral">Assistive Authoring</Badge>
        </div>
        <span className="text-slate-500 dark:text-slate-400">
          Template slots bind strictly to ERP/PLM master data; freeform LLM generation prohibited
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">
        {/* Left Column: Authoring Controls (5 cols) */}
        <div className="lg:col-span-5 h-full flex flex-col">
          {/* Navigation Selector for Authoring Panels */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 mb-2 text-xs font-medium">
            <button
              onClick={() => setLeftTab('template')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all ${
                leftTab === 'template'
                  ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 font-semibold shadow-2xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>1. Template Slots</span>
            </button>

            <button
              onClick={() => setLeftTab('symbols')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all ${
                leftTab === 'symbols'
                  ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 font-semibold shadow-2xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>2. ISO Symbols ({artwork.symbols.length})</span>
            </button>

            <button
              onClick={() => setLeftTab('translations')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all ${
                leftTab === 'translations'
                  ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 font-semibold shadow-2xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>3. Translation Memory</span>
            </button>
          </div>

          {/* Panel Screens */}
          <div className="flex-1 overflow-hidden">
            {leftTab === 'template' && (
              <AntiHallucinationEditor
                artwork={artwork}
                onUpdateArtwork={onUpdateArtwork}
              />
            )}
            {leftTab === 'symbols' && (
              <SymbolPicker
                selectedSymbols={artwork.symbols}
                onToggleSymbol={handleToggleSymbol}
                deviceClass={artwork.deviceClass}
              />
            )}
            {leftTab === 'translations' && (
              <TranslationMatrix />
            )}
          </div>
        </div>

        {/* Right Column: High-DPI Real-time Vector Canvas (7 cols) */}
        <div className="lg:col-span-7 h-full">
          <LiveArtworkCanvas
            artwork={artwork}
            onInspectElement={onInspectElement}
          />
        </div>
      </div>
    </div>
  );
};
