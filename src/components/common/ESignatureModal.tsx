import React, { useState } from 'react';
import { X, Lock, KeyRound, CheckCircle2, FileSignature, AlertCircle, ShieldCheck } from 'lucide-react';
import { ElectronicSignature } from '../../types';
import { calculateSha256 } from '../../utils/auditTrail';
import { AbbrTooltip } from './AbbrTooltip';

interface ESignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignComplete: (sig: ElectronicSignature) => void;
  targetEco?: string;
}

export const ESignatureModal: React.FC<ESignatureModalProps> = ({
  isOpen,
  onClose,
  onSignComplete,
  targetEco = 'ECO-2026-1042',
}) => {
  const [userId, setUserId] = useState('USR-8821');
  const [userName, setUserName] = useState('Gowtham Sai Garnepudi');
  const [userRole, setUserRole] = useState<'QA_LEAD' | 'REGULATORY_AFFAIRS' | 'CLINICAL_SPECIALIST' | 'OPERATIONS_DIRECTOR'>('QA_LEAD');
  const [password, setPassword] = useState('GxP-Auth-2026!');
  const [meaning, setMeaning] = useState('I have reviewed and approve this label revision as compliant with EU MDR 2017/745 and FDA 21 CFR 801.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signedRecord, setSignedRecord] = useState<ElectronicSignature | null>(null);

  if (!isOpen) return null;

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsSubmitting(true);
    const timestamp = new Date().toISOString();
    const payloadToHash = `${userId}|${userName}|${userRole}|${targetEco}|${meaning}|${timestamp}|21CFRPart11`;
    const hash = await calculateSha256(payloadToHash);

    const sig: ElectronicSignature = {
      id: `SIG-${Date.now().toString().slice(-6)}`,
      userId,
      userName,
      userRole,
      meaning,
      timestamp,
      sha256Hash: hash,
      ipAddress: '10.240.14.88 (Corporate GxP Secure Subnet)',
      part11Compliant: true,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSignedRecord(sig);
      onSignComplete(sig);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-lg w-full max-w-lg overflow-hidden shadow-xl text-slate-800">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-blue-100 text-blue-800 border border-blue-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                FDA 21 CFR Part 11 Electronic Signature
              </h3>
              <p className="text-[11px] font-mono text-slate-500">
                Bound to Engineering Change Order: <strong className="text-blue-700">{targetEco}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-xs">
          {signedRecord ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Cryptographic Signature Manifest Recorded</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Legally binding electronic signature executed under 21 CFR §11.100.
                </p>
              </div>

              <div className="bg-slate-50 rounded p-3 border border-slate-200 text-left font-mono space-y-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Signer:</span>{' '}
                  <span className="text-slate-900 font-semibold">{signedRecord.userName} ({signedRecord.userRole})</span>
                </div>
                <div>
                  <span className="text-slate-500">Meaning:</span>{' '}
                  <span className="text-blue-800 font-sans">{signedRecord.meaning}</span>
                </div>
                <div>
                  <span className="text-slate-500">Timestamp:</span>{' '}
                  <span className="text-slate-700">{signedRecord.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">SHA-256 Digest:</span>
                  <div className="text-[10px] text-emerald-800 break-all select-all bg-emerald-50 p-1.5 rounded border border-emerald-200">
                    {signedRecord.sha256Hash}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition-colors"
              >
                Done & Return to Workspace
              </button>
            </div>
          ) : (
            <form onSubmit={handleSign} className="space-y-3.5">
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>21 CFR §11.50 Requirement:</strong> Providing your credentials certifies that all validation checks have passed or justified exceptions are documented.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1">USER ID / PIN</label>
                  <input
                    type="text"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1">SIGNER NAME</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 mb-1">SIGNER ROLE</label>
                <select
                  value={userRole}
                  onChange={e => setUserRole(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="QA_LEAD">QA Lead / Quality Systems Manager</option>
                  <option value="REGULATORY_AFFAIRS">Director, Regulatory Affairs</option>
                  <option value="CLINICAL_SPECIALIST">Chief Medical Officer / Clinical Specialist</option>
                  <option value="OPERATIONS_DIRECTOR">VP Manufacturing & Packaging</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 mb-1">STATEMENT OF MEANING</label>
                <select
                  value={meaning}
                  onChange={e => setMeaning(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="I have reviewed and approve this label revision as compliant with EU MDR 2017/745 and FDA 21 CFR 801.">
                    Approval of regulatory compliance (EU MDR & FDA 21 CFR 801)
                  </option>
                  <option value="I approve the updated GS1 UDI-DI and UDI-PI data elements and Modulo-10 parity.">
                    Verification of GS1 UDI check digit & AIDC DataMatrix
                  </option>
                  <option value="I authorize release of ECO-2026-1042 to production cleanroom packaging lines.">
                    Release authorization for Cleanroom packaging
                  </option>
                  <option value="I verify that all neural translation drift and symbol aspect ratio defects are cleared.">
                    Verification of localization & symbol integrity
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 mb-1 flex items-center justify-between">
                  <span>GxP SECURE PASSWORD / BIOMETRIC TOKEN</span>
                  <span className="text-blue-700 text-[10px] font-semibold">Dual-Factor Bound</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono pr-8"
                    placeholder="Enter credentials"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-2.5 top-2" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Computing SHA-256 Digest...' : 'Execute Part 11 Signature'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
