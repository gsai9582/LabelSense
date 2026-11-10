import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Eye, Printer, Grid, Search, FileText } from 'lucide-react';
import { LabelArtwork } from '../../types';
import { ISO_SYMBOLS } from '../../data/isoSymbols';

interface LiveArtworkCanvasProps {
  artwork: LabelArtwork;
  onInspectElement: (elementId: string) => void;
  scale?: number;
}

export const LiveArtworkCanvas: React.FC<LiveArtworkCanvasProps> = ({
  artwork,
  onInspectElement,
  scale: externalScale,
}) => {
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [showQuietZone, setShowQuietZone] = useState(true);

  const currentScale = externalScale !== undefined ? externalScale : scale;
  const activeSymbols = ISO_SYMBOLS.filter(s => artwork.symbols.includes(s.id));

  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      {/* Header & Standard Engineering Tools */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <Eye className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Primary Packaging Label Stock Inspector (Tyvek Pouch)
            </h3>
            <p className="text-[11px] text-slate-500">
              True 1:1 Medical Blister Pouch Artwork (Click any element to audit Why-Trace)
            </p>
          </div>
        </div>

        {/* Engineering Inspection Tools */}
        <div className="flex items-center gap-2">
          {/* Grid Overlay Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 py-1 rounded border text-xs font-mono flex items-center gap-1 transition-colors ${
              showGrid ? 'bg-blue-50 text-blue-800 border-blue-300 font-semibold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle CAD Alignment Grid"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid Overlay</span>
          </button>

          {/* Quiet Zone Boundary Guide */}
          <button
            onClick={() => setShowQuietZone(!showQuietZone)}
            className={`px-2 py-1 rounded border text-xs font-mono flex items-center gap-1 transition-colors ${
              showQuietZone ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle GS1 Quiet Zone Boundary"
          >
            <span>QZ Guides</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-white rounded border border-slate-300 text-slate-700 text-xs">
            <button
              onClick={() => setScale(prev => Math.min(prev + 0.1, 1.4))}
              className="p-1 hover:bg-slate-100 rounded-l"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-700 font-medium">
              {(currentScale * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setScale(prev => Math.max(prev - 0.1, 0.7))}
              className="p-1 hover:bg-slate-100 rounded-r"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="p-1.5 rounded bg-slate-900 text-white hover:bg-slate-800 text-xs flex items-center gap-1 transition-colors"
            title="Print Physical Proof"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Realistic Packaging Canvas Frame */}
      <div className="flex-1 w-full h-full overflow-auto flex items-center justify-center p-6 bg-slate-100/80 rounded border border-slate-200 mt-3 relative">
        {/* Physical Blister Pouch Artwork Card */}
        <div
          style={{
            transform: `scale(${currentScale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
          }}
          className={`relative bg-white text-black w-[540px] h-[350px] shadow-sm p-6 border border-slate-400 flex flex-col justify-between font-sans select-none overflow-hidden ${
            showGrid ? 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px]' : ''
          }`}
        >
          {/* Top Section */}
          <div>
            <div className="flex items-start justify-between border-b-2 border-black pb-2">
              <div>
                <h2
                  onClick={() => onInspectElement('REF')}
                  className="text-base font-black tracking-tight cursor-pointer hover:bg-blue-50 px-0.5 rounded transition-colors text-black uppercase"
                  title="Click to view PLM Trace"
                >
                  {artwork.tradeName}
                </h2>
                <p className="text-[11px] font-bold text-black tracking-tight">
                  {artwork.productName}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono font-black border-2 border-black px-1.5 py-0.2">
                  {artwork.deviceClass}
                </span>
                <div className="text-[9px] font-mono text-black mt-1 font-bold">{artwork.revision}</div>
              </div>
            </div>

            {/* Middle Metadata Columns */}
            <div className="grid grid-cols-12 gap-3 mt-3">
              {/* Left Column: Dimensions, REF, LOT, EXP */}
              <div className="col-span-7 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-black">DIMENSIONS:</span>
                  <span
                    onClick={() => onInspectElement('REF')}
                    className="text-xs font-mono font-black text-black cursor-pointer hover:bg-blue-50 px-0.5 rounded"
                  >
                    {artwork.dimensions}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* REF Block */}
                  <div
                    onClick={() => onInspectElement('REF')}
                    className="flex items-center gap-1.5 p-1 rounded hover:bg-blue-50 cursor-pointer border border-black"
                  >
                    <div className="bg-black text-white font-mono font-bold text-[9px] px-1 py-0.2">
                      REF
                    </div>
                    <span className="font-mono font-bold text-[11px] text-black">{artwork.sku}</span>
                  </div>

                  {/* LOT Block */}
                  <div
                    onClick={() => onInspectElement('LOT')}
                    className="flex items-center gap-1.5 p-1 rounded hover:bg-blue-50 cursor-pointer border border-black"
                  >
                    <div className="bg-black text-white font-mono font-bold text-[9px] px-1 py-0.2">
                      LOT
                    </div>
                    <span className="font-mono font-bold text-[11px] text-black">{artwork.lot}</span>
                  </div>
                </div>

                {/* EXP / USE BY Date */}
                <div
                  onClick={() => onInspectElement('UDI_DATAMATRIX')}
                  className="flex items-center gap-2 text-xs p-1 rounded hover:bg-blue-50 cursor-pointer border border-black"
                >
                  <span className="text-[10px] font-black text-black">USE BY:</span>
                  <span className="font-mono font-black text-black">{artwork.expDate}</span>
                  <span className="text-[9px] font-mono text-slate-600 font-semibold">(YYYY-MM-DD)</span>
                </div>

                {/* Storage Instructions */}
                <div className="text-[10px] text-black leading-tight pt-0.5">
                  <strong>Storage:</strong> {artwork.storageTemp}
                </div>
              </div>

              {/* Right Column: 2D DataMatrix UDI Barcode Simulation */}
              <div
                onClick={() => onInspectElement('UDI_DATAMATRIX')}
                className="col-span-5 flex flex-col items-center justify-center p-2 border border-black bg-white hover:bg-blue-50/50 cursor-pointer transition-colors relative"
                title="Click to inspect GS1 UDI Modulo-10 Check"
              >
                {/* Quiet Zone Guide Overlay */}
                {showQuietZone && (
                  <div className="absolute inset-1 border border-dashed border-emerald-600 pointer-events-none opacity-80" />
                )}

                {/* 2D DataMatrix Visual Canvas */}
                <div className="w-18 h-18 bg-white border border-black p-0.5 flex items-center justify-center relative">
                  <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-0.5 bg-black p-0.5">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${
                          (i * 7 + 13) % 3 === 0 || (i % 2 === 0 && i > 12)
                            ? 'bg-white'
                            : 'bg-black'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Human Readable Interpretation (HRI) */}
                <div className="mt-1 text-center font-mono text-[8px] text-black leading-tight">
                  <div className="font-bold">{artwork.udiDi}</div>
                  <div className="text-[7.5px] truncate max-w-[170px]">{artwork.udiPi}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: ISO 15223-1 Graphical Symbol Bar & Legal Manufacturer */}
          <div>
            {/* Symbol Row */}
            <div className="flex flex-wrap items-center gap-1.5 py-1.5 border-t-2 border-b-2 border-black">
              {activeSymbols.map(sym => (
                <div
                  key={sym.id}
                  onClick={() => onInspectElement(sym.id)}
                  className="h-7 px-1.5 py-0.5 border border-black rounded-none bg-white hover:bg-blue-100 cursor-pointer flex items-center justify-center text-black transition-colors"
                  title={`${sym.name} (${sym.standardRef}) - Click to Inspect`}
                >
                  <svg
                    viewBox="0 0 70 30"
                    className="h-5 w-auto max-w-[54px]"
                    dangerouslySetInnerHTML={{ __html: sym.svgCode }}
                  />
                </div>
              ))}
            </div>

            {/* Manufacturer & EC REP Details */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[8.5px] text-black leading-tight font-sans">
              <div>
                <strong>Manufacturer:</strong> {artwork.manufacturerName}, {artwork.manufacturerAddress}
              </div>
              <div>
                <strong>EC REP:</strong> {artwork.euRepName}, {artwork.euRepAddress}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
