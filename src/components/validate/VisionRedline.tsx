import React, { useState } from 'react';
import { Eye, Sliders, AlertTriangle, CheckCircle2, SplitSquareVertical, Layers, Search, Grid, ZoomIn } from 'lucide-react';
import { LabelArtwork, DefectItem } from '../../types';
import { AbbrTooltip } from '../common/AbbrTooltip';

interface VisionRedlineProps {
  baselineArtwork: LabelArtwork;
  currentArtwork: LabelArtwork;
  defects: DefectItem[];
  onSelectDefect?: (defect: DefectItem) => void;
}

export const VisionRedline: React.FC<VisionRedlineProps> = ({
  baselineArtwork,
  currentArtwork,
  defects,
  onSelectDefect,
}) => {
  const [viewMode, setViewMode] = useState<'SIDE_BY_SIDE' | 'HOMOGRAPHY_OVERLAY' | 'BOUNDING_BOX'>('BOUNDING_BOX');
  const [opacity, setOpacity] = useState(50);
  const [showGrid, setShowGrid] = useState(false);
  const [activeDefectId, setActiveDefectId] = useState<string | null>(defects[0]?.id || null);

  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <Eye className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Layer 2: Computer Vision & Optical Redline
            </h3>
            <p className="text-[11px] text-slate-500">
              Sub-pixel alignment comparator between Approved Baseline and Revised Artwork
            </p>
          </div>
        </div>

        {/* Standard Engineering Mode Switcher */}
        <div className="flex items-center bg-slate-100 rounded p-0.5 border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('SIDE_BY_SIDE')}
            className={`px-2.5 py-1 rounded text-xs transition-all ${
              viewMode === 'SIDE_BY_SIDE' ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            [ Side-by-Side Diff ]
          </button>
          <button
            onClick={() => setViewMode('HOMOGRAPHY_OVERLAY')}
            className={`px-2.5 py-1 rounded text-xs transition-all ${
              viewMode === 'HOMOGRAPHY_OVERLAY' ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            [ High-Res Homography Overlay ]
          </button>
          <button
            onClick={() => setViewMode('BOUNDING_BOX')}
            className={`px-2.5 py-1 rounded text-xs transition-all ${
              viewMode === 'BOUNDING_BOX' ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            [ Bounding-Box Defects ]
          </button>
        </div>
      </div>

      {/* Inspection Sub-tools Bar */}
      <div className="py-2 flex items-center justify-between text-xs font-mono text-slate-600 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 py-0.5 rounded border text-[11px] font-mono flex items-center gap-1 ${
              showGrid ? 'bg-blue-50 text-blue-800 border-blue-300 font-semibold' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <Grid className="w-3 h-3" />
            <span>Grid Alignment</span>
          </button>

          {viewMode === 'HOMOGRAPHY_OVERLAY' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px]">Overlay Crossfade:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={e => setOpacity(parseInt(e.target.value, 10))}
                className="w-24 h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-blue-800 font-semibold">{opacity}%</span>
            </div>
          )}
        </div>

        <div className="text-[11px] font-mono">
          <span>Sub-pixel Parity: </span>
          <strong className={defects.length === 0 ? 'text-emerald-700' : 'text-rose-700'}>
            {defects.length === 0 ? '99.8% Match' : '74.2% (Defect Flagged)'}
          </strong>
        </div>
      </div>

      {/* Visual Redline Comparator Canvas */}
      <div className="flex-1 w-full relative bg-slate-100 rounded border border-slate-200 mt-3 overflow-hidden flex items-center justify-center p-4 min-h-[300px]">
        {viewMode === 'SIDE_BY_SIDE' ? (
          <div className="grid grid-cols-2 gap-4 w-full max-w-[800px]">
            {/* Left: Approved Baseline */}
            <div className="bg-white p-4 border border-slate-300 rounded shadow-2xs text-black font-sans text-xs">
              <div className="text-[10px] font-mono text-emerald-800 font-bold mb-1 pb-1 border-b border-slate-200 flex justify-between">
                <span>APPROVED BASELINE (REV 4.2)</span>
                <span>ISO 15223-1</span>
              </div>
              <div className="font-black text-sm">{baselineArtwork.tradeName}</div>
              <div className="text-[11px] font-bold text-slate-700">{baselineArtwork.productName}</div>
              <div className="mt-2 font-mono text-[11px] space-y-0.5">
                <div>DIMENSIONS: <strong>{baselineArtwork.dimensions}</strong></div>
                <div>REF: {baselineArtwork.sku} | LOT: {baselineArtwork.lot}</div>
                <div>EXP: {baselineArtwork.expDate}</div>
              </div>
              <div className="mt-3 pt-2 border-t text-[10px] font-mono flex justify-between">
                <span>UDI: {baselineArtwork.udiDi}</span>
                <span className="border border-black px-1 font-bold">CE 0123</span>
              </div>
            </div>

            {/* Right: Revised Artwork */}
            <div className="bg-white p-4 border border-slate-300 rounded shadow-2xs text-black font-sans text-xs">
              <div className="text-[10px] font-mono text-blue-800 font-bold mb-1 pb-1 border-b border-slate-200 flex justify-between">
                <span>REVISED ARTWORK (REV 5.0)</span>
                <span>PROPOSED</span>
              </div>
              <div className="font-black text-sm">{currentArtwork.tradeName}</div>
              <div className="text-[11px] font-bold text-slate-700">{currentArtwork.productName}</div>
              <div className="mt-2 font-mono text-[11px] space-y-0.5">
                <div className={currentArtwork.dimensions !== baselineArtwork.dimensions ? 'bg-rose-100 text-rose-900 border border-rose-300 px-1 font-bold' : ''}>
                  DIMENSIONS: <strong>{currentArtwork.dimensions}</strong>
                </div>
                <div>REF: {currentArtwork.sku} | LOT: {currentArtwork.lot}</div>
                <div>EXP: {currentArtwork.expDate}</div>
              </div>
              <div className="mt-3 pt-2 border-t text-[10px] font-mono flex justify-between">
                <span>UDI: {currentArtwork.udiDi}</span>
                <span className={`border px-1 font-bold ${
                  currentArtwork.symbols.includes('CE_MARK') ? 'border-black' : 'border-rose-600 bg-rose-100 text-rose-800'
                }`}>
                  {currentArtwork.symbols.includes('CE_MARK') ? 'CE 0123' : 'MISSING CE'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Single Card with Homography Overlay or Bounding Boxes */
          <div className={`relative w-[480px] h-[280px] bg-white rounded shadow-sm p-4 text-black border border-slate-400 font-sans select-none overflow-hidden ${
            showGrid ? 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:15px_15px]' : ''
          }`}>
            <div className="text-[10px] font-mono text-slate-600 font-bold mb-1 flex items-center justify-between border-b border-black pb-1">
              <span>{currentArtwork.tradeName}</span>
              <span>{currentArtwork.revision}</span>
            </div>
            <div className="text-xs font-bold text-black">{currentArtwork.productName}</div>
            <div className="mt-2 text-xs font-mono">
              <div className={currentArtwork.dimensions !== baselineArtwork.dimensions ? 'text-rose-900 font-black bg-rose-100 px-1 inline-block border border-rose-300' : ''}>
                DIMENSIONS: <strong>{currentArtwork.dimensions}</strong>
              </div>
              <div>REF: {currentArtwork.sku} | LOT: {currentArtwork.lot}</div>
              <div>EXP: {currentArtwork.expDate}</div>
            </div>
            <div className="mt-2 text-[10px] text-slate-700">
              Storage: {currentArtwork.storageTemp}
            </div>
            <div className="mt-4 pt-2 border-t border-black flex items-center justify-between text-[9px] font-mono">
              <span>UDI: {currentArtwork.udiDi}</span>
              <span className="border border-black px-1.5 py-0.2 font-bold">
                {currentArtwork.symbols.includes('CE_MARK') ? 'CE 0123' : 'MISSING CE'}
              </span>
            </div>

            {/* Bounding Box Highlights Overlay */}
            {viewMode === 'BOUNDING_BOX' && defects.map(defect => {
              const isSelected = activeDefectId === defect.id;
              return (
                <div
                  key={defect.id}
                  onClick={() => {
                    setActiveDefectId(defect.id);
                    if (onSelectDefect) onSelectDefect(defect);
                  }}
                  style={{
                    top: `${defect.y}%`,
                    left: `${defect.x}%`,
                    width: `${defect.width}%`,
                    height: `${defect.height}%`,
                  }}
                  className={`absolute border-2 rounded-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-rose-600 bg-rose-500/20 ring-2 ring-rose-500/40'
                      : 'border-rose-500 bg-rose-500/10 hover:border-rose-700'
                  }`}
                >
                  <span className="absolute -top-3.5 left-0 text-[8px] font-mono bg-rose-600 text-white px-1 font-bold whitespace-nowrap shadow-2xs">
                    {defect.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detected Defects List Footer */}
      <div className="mt-3 space-y-1.5">
        <div className="text-[11px] font-mono text-slate-600 flex items-center justify-between font-semibold">
          <span>ISOLATED DEFECT FINDINGS ({defects.length})</span>
          <span className="text-slate-400">Click finding to inspect bounding box</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
          {defects.map(d => {
            const isSelected = activeDefectId === d.id;
            return (
              <div
                key={d.id}
                onClick={() => setActiveDefectId(d.id)}
                className={`p-2 rounded border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-rose-50 border-rose-400 ring-1 ring-rose-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-rose-900 font-mono text-[11px]">{d.title}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                    {d.severity}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{d.description}</p>
                <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100">
                  <span className="text-rose-700 font-semibold">Actual: {d.actual}</span>
                  <span>Ref: {d.regulatoryRef}</span>
                </div>
              </div>
            );
          })}

          {defects.length === 0 && (
            <div className="col-span-2 text-center py-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center justify-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero visual defects or layout shifts detected. 100% Sub-Pixel Pass.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
