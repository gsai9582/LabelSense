import React from 'react';
import { X, ShieldCheck, Terminal, Award, FileCode, CheckCircle2, Cpu } from 'lucide-react';

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-lg w-full max-w-2xl overflow-hidden shadow-xl text-slate-800 text-xs">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">System Architecture & GxP Compliance Specs</h3>
              <p className="text-[11px] text-slate-400 font-mono">LabelSense Platform v2.4-pilot | Team MarkRight</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5 text-xs">
              <Award className="w-4 h-4 text-blue-600" /> Hackathon Submission Context
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Built for <strong>CodeQuest 2026 National Tech Hackathon (Round 2)</strong> by Team <strong>MarkRight</strong>. Designed as an authentic clinical engineering and regulatory compliance workstation mirroring tier-1 enterprise platforms (Veeva Vault RIM, MasterControl, Palantir Foundry).
            </p>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5 text-xs">
              <Cpu className="w-4 h-4 text-blue-600" /> Core Deterministic Engines
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="font-mono font-bold text-slate-900 block mb-0.5">GS1 Modulo-10 Engine</span>
                <span className="text-slate-600">Pure mathematical check-digit calculator ($x_3, x_1$ weights) enforcing GS1 General Specs Release 24.0.</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="font-mono font-bold text-slate-900 block mb-0.5">Computer Vision Redline</span>
                <span className="text-slate-600">Sub-pixel matrix homography comparator detecting shifted decimal points (3.0mm &rarr; 30mm) and aspect ratio anomalies.</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="font-mono font-bold text-slate-900 block mb-0.5">Neural Back-Translation</span>
                <span className="text-slate-600">Bi-directional semantic drift verification across EN, DE, FR, ES, JA, and TE preventing clinical warning inversion.</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="font-mono font-bold text-slate-900 block mb-0.5">21 CFR Part 11 Audit Trail</span>
                <span className="text-slate-600">Immutable SHA-256 Merkle hash chain recording user ID, role, meaning of signature, and client IP timestamp.</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5 text-xs">
              <FileCode className="w-4 h-4 text-blue-600" /> Regulatory Alignment Matrix
            </h4>
            <table className="w-full text-left text-[11px] border border-slate-200">
              <thead className="bg-slate-100 font-mono text-slate-700">
                <tr>
                  <th className="p-1.5 border-b border-r border-slate-200">Standard</th>
                  <th className="p-1.5 border-b border-slate-200">Implementation Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600 font-mono">
                <tr>
                  <td className="p-1.5 font-semibold text-slate-800 border-r border-slate-200">FDA 21 CFR Part 11</td>
                  <td className="p-1.5 font-sans">Cryptographic electronic signatures, non-repudiation role bindings, and audit trail hash chaining.</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-semibold text-slate-800 border-r border-slate-200">FDA 21 CFR Part 801</td>
                  <td className="p-1.5 font-sans">UDI AIDC DataMatrix simulation & HRI synchronisation with Modulo-10 parity.</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-semibold text-slate-800 border-r border-slate-200">EU MDR 2017/745</td>
                  <td className="p-1.5 font-sans">Annex I §23.2 mandatory sterile barrier indicators, CE 0123 Notified Body, and MD symbol.</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-semibold text-slate-800 border-r border-slate-200">ISO 15223-1:2021</td>
                  <td className="p-1.5 font-sans">Enforced aspect ratios for STERILE EO, REF, LOT, Consult IFU, and Single Use vector symbols.</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-semibold text-slate-800 border-r border-slate-200">GAMP 5 Category 4</td>
                  <td className="p-1.5 font-sans">Deterministic rule assertions eliminating GenAI free-text hallucination on clinical master data.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-slate-500 font-mono text-[11px]">
          <span>Build: 2026.11-RELEASE-R2</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium text-xs transition-colors"
          >
            Close Specs
          </button>
        </div>
      </div>
    </div>
  );
};
