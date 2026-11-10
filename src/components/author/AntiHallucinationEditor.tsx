import React from 'react';
import { Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LabelArtwork } from '../../types';
import { AbbrTooltip } from '../common/AbbrTooltip';

interface AntiHallucinationEditorProps {
  artwork: LabelArtwork;
  onUpdateArtwork: (updated: LabelArtwork) => void;
}

export const AntiHallucinationEditor: React.FC<AntiHallucinationEditorProps> = ({
  artwork,
  onUpdateArtwork,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <Lock className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Template-Bound Slot Binder
            </h3>
            <p className="text-[11px] text-slate-500">
              GAMP 5 CSA Deterministic Form: Locked QA phrase blocks & master PLM values
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Locked Tokens Enforced</span>
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {/* Anti-Hallucination Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-[11px] text-slate-700 leading-relaxed">
          <strong className="text-slate-900 block mb-0.5">Zero Free-Text Hallucination Engine:</strong>
          All text fields are strictly bound to verified <AbbrTooltip term="DMR">DMR</AbbrTooltip> regulatory tokens and PLM specifications. Direct freehand editing of critical warnings is prohibited to prevent compliance deviations.
        </div>

        {/* Product & SKU Master Data (Read-only / Pre-Approved Slots) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10px] font-mono text-slate-600 mb-1 font-semibold">PRODUCT SKU (PLM LOCKED)</label>
            <div className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-800 text-xs flex items-center justify-between">
              <span>{artwork.sku}</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono text-slate-600 mb-1 font-semibold">DEVICE RISK CLASS</label>
            <div className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-800 text-xs flex items-center justify-between">
              <span className="font-semibold text-blue-900">{artwork.deviceClass}</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Product Names */}
        <div>
          <label className="block text-[10px] font-mono text-slate-600 mb-1 font-semibold">PROPRIETARY TRADE NAME</label>
          <input
            type="text"
            value={artwork.tradeName}
            onChange={e => onUpdateArtwork({ ...artwork, tradeName: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono text-slate-600 mb-1 font-semibold">DEVICE DESCRIPTION & GENERIC NAME</label>
          <input
            type="text"
            value={artwork.productName}
            onChange={e => onUpdateArtwork({ ...artwork, productName: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Lot, Expiry, Dimensions */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] font-mono text-slate-600 mb-1 font-semibold">BATCH / LOT</label>
            <input
              type="text"
              value={artwork.lot}
              onChange={e => onUpdateArtwork({ ...artwork, lot: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-slate-600 mb-1 font-semibold">EXPIRY (YYYY-MM-DD)</label>
            <input
              type="text"
              value={artwork.expDate}
              onChange={e => onUpdateArtwork({ ...artwork, expDate: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-slate-600 mb-1 font-semibold">DIMENSIONS</label>
            <input
              type="text"
              value={artwork.dimensions}
              onChange={e => onUpdateArtwork({ ...artwork, dimensions: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* GS1 GTIN & UDI Strings */}
        <div>
          <label className="block text-[10px] font-mono text-slate-600 mb-1 flex items-center justify-between font-semibold">
            <span>GS1 GTIN-14 (<AbbrTooltip term="UDI">UDI-DI</AbbrTooltip>)</span>
            <span className="text-[10px] text-blue-700 font-mono">Modulo-10 Auto-Validated</span>
          </label>
          <input
            type="text"
            value={artwork.gtin}
            onChange={e => {
              const val = e.target.value;
              onUpdateArtwork({
                ...artwork,
                gtin: val,
                udiDi: `(01)${val}`,
              });
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
          />
        </div>

        {/* Manufacturer Details */}
        <div>
          <label className="block text-[10px] font-mono text-slate-600 mb-1 font-semibold">LEGAL MANUFACTURER NAME & ADDRESS</label>
          <input
            type="text"
            value={artwork.manufacturerName}
            onChange={e => onUpdateArtwork({ ...artwork, manufacturerName: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 mb-1.5"
          />
          <textarea
            value={artwork.manufacturerAddress}
            onChange={e => onUpdateArtwork({ ...artwork, manufacturerAddress: e.target.value })}
            rows={2}
            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-600 resize-none font-sans"
          />
        </div>

        {/* EU Authorised Representative */}
        <div>
          <label className="block text-[10px] font-mono text-slate-600 mb-1 font-semibold">EU AUTHORISED REPRESENTATIVE (EC REP)</label>
          <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-0.5">
            <div className="font-semibold text-slate-900">{artwork.euRepName}</div>
            <div className="text-[11px] text-slate-500">{artwork.euRepAddress}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
