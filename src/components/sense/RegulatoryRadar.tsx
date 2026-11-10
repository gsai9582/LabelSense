import React from 'react';
import { Radio, ArrowUpRight, Search } from 'lucide-react';
import { RegulatoryUpdate, DeviceClass, TargetMarket } from '../../types';
import { AbbrTooltip } from '../common/AbbrTooltip';

interface RegulatoryRadarProps {
  updates: RegulatoryUpdate[];
  selectedUpdate: RegulatoryUpdate | null;
  onSelectUpdate: (update: RegulatoryUpdate) => void;
  selectedClass: DeviceClass | 'ALL';
  setSelectedClass: (cls: DeviceClass | 'ALL') => void;
  selectedMarket: TargetMarket | 'ALL';
  setSelectedMarket: (mkt: TargetMarket | 'ALL') => void;
}

export const RegulatoryRadar: React.FC<RegulatoryRadarProps> = ({
  updates,
  selectedUpdate,
  onSelectUpdate,
  selectedClass,
  setSelectedClass,
  selectedMarket,
  setSelectedMarket,
}) => {
  const filtered = updates.filter(u => {
    const classMatch = selectedClass === 'ALL' || u.deviceClasses.includes(selectedClass);
    const marketMatch = selectedMarket === 'ALL' || u.markets.includes(selectedMarket);
    return classMatch && marketMatch;
  });

  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <Radio className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Global Regulatory Surveillance Radar
            </h3>
            <p className="text-[11px] text-slate-500">
              Live crawler tracking FDA, <AbbrTooltip term="MDR">EU MDR</AbbrTooltip>, ISO 15223-1, & ISO 20417
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
          ACTIVE INGESTION
        </span>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-2 mt-3 mb-3">
        <div>
          <label className="block text-[10px] font-mono text-slate-600 mb-1">DEVICE CLASS</label>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">All Risk Classes (I, IIa, IIb, III, Imp)</option>
            <option value="Class I">Class I (General)</option>
            <option value="Class IIa">Class IIa (Moderate)</option>
            <option value="Class IIb">Class IIb (High)</option>
            <option value="Class III">Class III (Critical)</option>
            <option value="Implantable">Class III Implantable</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono text-slate-600 mb-1">TARGET MARKET</label>
          <select
            value={selectedMarket}
            onChange={e => setSelectedMarket(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">Global Harmonized (All)</option>
            <option value="US">United States (FDA)</option>
            <option value="EU">European Union (MDR)</option>
            <option value="JP">Japan (PMDA / PAL)</option>
            <option value="UK">United Kingdom (MHRA)</option>
          </select>
        </div>
      </div>

      {/* List of Incoming Regulatory Intelligence */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.map(item => {
          const isSelected = selectedUpdate?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectUpdate(item)}
              className={`p-3 rounded border text-xs cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-600 shadow-xs ring-1 ring-blue-600/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    item.authority === 'EU MDR' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                    item.authority === 'FDA' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    item.authority === 'ISO' ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {item.authority}
                  </span>
                  <span className="font-mono text-slate-600 text-[11px] font-semibold">{item.clause}</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                  item.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                  item.severity === 'MAJOR' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {item.severity}
                </span>
              </div>

              <h4 className="font-semibold text-slate-900 mt-1.5 line-clamp-1">{item.title}</h4>
              <p className="text-slate-600 text-[11px] mt-1 line-clamp-2 leading-relaxed">{item.summary}</p>

              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1.5 border-t border-slate-200">
                <span>Effective: {item.effectiveDate}</span>
                <span className="text-blue-700 font-medium flex items-center gap-0.5">
                  {item.extractedRules.length} Rules Bound <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">
            No regulatory feeds match selected filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
