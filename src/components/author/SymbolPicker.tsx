import React from 'react';
import { ShieldCheck, Plus, Check } from 'lucide-react';
import { ISO_SYMBOLS } from '../../data/isoSymbols';
import { ISOSymbol, DeviceClass } from '../../types';

interface SymbolPickerProps {
  selectedSymbols: string[];
  onToggleSymbol: (symbolId: string) => void;
  deviceClass: DeviceClass;
}

export const SymbolPicker: React.FC<SymbolPickerProps> = ({
  selectedSymbols,
  onToggleSymbol,
  deviceClass,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              ISO 15223-1 Vector Symbol Library
            </h3>
            <p className="text-[11px] text-slate-500">
              Harmonized graphical symbols with enforced standard aspect ratios
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
        {ISO_SYMBOLS.map(sym => {
          const isSelected = selectedSymbols.includes(sym.id);
          const isMandatory = sym.isMandatoryFor.includes(deviceClass);

          return (
            <div
              key={sym.id}
              onClick={() => onToggleSymbol(sym.id)}
              className={`p-2.5 rounded border text-xs cursor-pointer transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-600 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Symbol Vector Preview - Crisp Black & White */}
                <div className="w-14 h-9 bg-white rounded border border-slate-300 flex items-center justify-center p-1 text-slate-900 flex-shrink-0 shadow-2xs">
                  <svg
                    viewBox="0 0 70 30"
                    className="w-full h-full max-h-7"
                    dangerouslySetInnerHTML={{ __html: sym.svgCode }}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{sym.name}</span>
                    {isMandatory && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-300 font-semibold">
                        Mandatory {deviceClass}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-blue-700 font-medium mt-0.5">{sym.standardRef}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
                    <span>Ratio: 1 : {sym.aspectRatio}</span>
                    <span>| Cat: {sym.category}</span>
                  </div>
                </div>
              </div>

              {/* Selection Checkbox Pill */}
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-400 border border-slate-300'
              }`}>
                {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
