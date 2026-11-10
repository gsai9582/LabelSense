import React, { useState } from 'react';
import { AntiHallucinationEditor } from './AntiHallucinationEditor';
import { SymbolPicker } from './SymbolPicker';
import { TranslationMatrix } from './TranslationMatrix';
import { LiveArtworkCanvas } from './LiveArtworkCanvas';
import { LabelArtwork } from '../../types';
import { Layers, ShieldCheck, Languages } from 'lucide-react';

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-190px)] min-h-[640px]">
      {/* Left Column: Authoring Controls (5 cols) */}
      <div className="lg:col-span-5 h-full flex flex-col">
        {/* Navigation Selector for Authoring Panels */}
        <div className="flex items-center bg-slate-100 rounded border border-slate-200 p-0.5 mb-2 text-xs font-medium">
          <button
            onClick={() => setLeftTab('template')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all ${
              leftTab === 'template'
                ? 'bg-white text-blue-900 font-semibold shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-700" />
            <span>1. Template Slot Binder</span>
          </button>

          <button
            onClick={() => setLeftTab('symbols')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all ${
              leftTab === 'symbols'
                ? 'bg-white text-blue-900 font-semibold shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>2. ISO Symbols ({artwork.symbols.length})</span>
          </button>

          <button
            onClick={() => setLeftTab('translations')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded transition-all ${
              leftTab === 'translations'
                ? 'bg-white text-blue-900 font-semibold shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-blue-700" />
            <span>3. Translations (TM)</span>
          </button>
        </div>

        {/* Tab Content */}
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

      {/* Right Column: Live Interactive Artwork Canvas (7 cols) */}
      <div className="lg:col-span-7 h-full">
        <LiveArtworkCanvas
          artwork={artwork}
          onInspectElement={onInspectElement}
        />
      </div>
    </div>
  );
};
