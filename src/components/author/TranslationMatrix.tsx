import React, { useState } from 'react';
import { Languages, Lock, ArrowRightLeft } from 'lucide-react';
import { TRANSLATION_MEMORY } from '../../data/translationMemory';
import { TranslationBlock } from '../../types';

export const TranslationMatrix: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<'de' | 'fr' | 'es' | 'ja' | 'te'>('ja');
  const [blocks] = useState<TranslationBlock[]>(TRANSLATION_MEMORY);

  const langNames: Record<string, string> = {
    de: 'German (Deutsch - EU MDR §23.1)',
    fr: 'French (Français - EU MDR §23.1)',
    es: 'Spanish (Español - EU MDR §23.1)',
    ja: 'Japanese (日本語 - PMD Act Art.63)',
    te: 'Telugu (తెలుగు - CDSCO Export Optional)',
  };

  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <Languages className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Multi-Language Translation Memory (TM)
            </h3>
            <p className="text-[11px] text-slate-500">
              Synchronized translation memory with locked clinical terminology tokens
            </p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center bg-slate-100 rounded p-0.5 border border-slate-200 text-xs">
          {(['de', 'fr', 'es', 'ja', 'te'] as const).map(l => (
            <button
              key={l}
              onClick={() => setSelectedLang(l)}
              className={`px-2 py-0.5 rounded uppercase font-mono transition-all text-[11px] ${
                selectedLang === l ? 'bg-white text-blue-900 font-bold shadow-2xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        <div className="text-[11px] font-mono text-slate-600 flex items-center justify-between pb-1 border-b border-slate-200">
          <span>Target Language: <strong className="text-slate-900">{langNames[selectedLang]}</strong></span>
          <span className="text-emerald-700 font-semibold font-mono">100% Token Parity</span>
        </div>

        {blocks.map(block => {
          const translation = block.translations[selectedLang] || 'Translation pending in TM database...';
          const backInfo = block.backTranslations?.[selectedLang];

          return (
            <div key={block.key} className="bg-slate-50/70 border border-slate-200 rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{block.label}</span>
                <div className="flex items-center gap-1">
                  {block.lockedTokens.map(tok => (
                    <span key={tok} className="px-1.5 py-0.2 rounded bg-white text-slate-700 text-[10px] font-mono border border-slate-200 shadow-2xs">
                      {tok}
                    </span>
                  ))}
                </div>
              </div>

              {/* Source English vs Target Localized */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {/* Source English */}
                <div className="bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
                  <div className="text-[10px] font-mono text-slate-500 mb-1 flex items-center justify-between">
                    <span>SOURCE (ENGLISH)</span>
                    <Lock className="w-3 h-3 text-slate-400" />
                  </div>
                  <p className="text-slate-700 leading-relaxed font-sans">{block.sourceEn}</p>
                </div>

                {/* Target Localized */}
                <div className="bg-white p-2.5 rounded border border-blue-200 shadow-2xs">
                  <div className="text-[10px] font-mono text-blue-800 mb-1 flex items-center justify-between font-semibold">
                    <span>TARGET ({selectedLang.toUpperCase()})</span>
                    <span className="text-emerald-700 text-[10px]">TM Match 100%</span>
                  </div>
                  <p className="text-slate-900 font-medium leading-relaxed font-sans">{translation}</p>
                </div>
              </div>

              {/* Neural Back-Translation Drift Bar */}
              {backInfo && (
                <div className="bg-white rounded p-2 border border-slate-200 text-[11px] space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <ArrowRightLeft className="w-3 h-3 text-blue-600" /> Neural Back-Translation to English:
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${
                      backInfo.driftScore >= 0.98 ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      Parity: {(backInfo.driftScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-slate-700 italic font-sans">
                    &ldquo;{backInfo.backText}&rdquo;
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
