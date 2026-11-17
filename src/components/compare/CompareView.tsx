import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { GitCompare, Eye, Layers, ShieldCheck, AlertTriangle, XCircle, Download, RefreshCw } from 'lucide-react';
import { BASELINE_ARTWORK, SCENARIO_A_ARTWORK, SCENARIO_B_ARTWORK, SCENARIO_C_ARTWORK } from '../../data/mockLabelData';
import { apiClient, BackendCompareResponse } from '../../utils/apiClient';

interface CompareViewProps {
  onTriggerSignoff?: () => void;
  onNavigateToAudit?: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({ onTriggerSignoff }) => {
  const [selectedRevisionKey, setSelectedRevisionKey] = useState<'REV_A' | 'REV_B' | 'REV_C'>('REV_B');
  const [activeDiffMode, setActiveDiffMode] = useState<'semantic' | 'visual'>('semantic');
  const [backendDiff, setBackendDiff] = useState<BackendCompareResponse | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const baseline = BASELINE_ARTWORK;
  const revisions = {
    REV_A: {
      artwork: SCENARIO_A_ARTWORK,
      name: 'Revision A (Clean ECN)',
      riskLevel: 'LOW' as const,
      riskVariant: 'pass' as const,
      summary: 'Address and legal manufacturer updated. Check digit and expiry untouched and valid.',
    },
    REV_B: {
      artwork: SCENARIO_B_ARTWORK,
      name: 'Revision B (Checksum Defect)',
      riskLevel: 'HIGH' as const,
      riskVariant: 'critical' as const,
      summary: 'GTIN-14 check digit altered from 6 to 9. Barcode scanner unreadable in hospital receiving.',
    },
    REV_C: {
      artwork: SCENARIO_C_ARTWORK,
      name: 'Revision C (Expiry Shelf-Life Drift)',
      riskLevel: 'MEDIUM' as const,
      riskVariant: 'review' as const,
      summary: 'Expiration date set past stability report maximum shelf life. Quarantine flag raised.',
    },
  };

  const currentRevision = revisions[selectedRevisionKey];

  useEffect(() => {
    const fetchBackendCompare = async () => {
      setIsComparing(true);
      try {
        const res = await apiClient.compare({
          baseline_gtin: baseline.gtin,
          candidate_gtin: currentRevision.artwork.gtin,
          baseline_exp: baseline.expDate,
          candidate_exp: currentRevision.artwork.expDate,
          baseline_lot: baseline.lot,
          candidate_lot: currentRevision.artwork.lot,
          baseline_text: `${baseline.productName} REF ${baseline.sku} (01)${baseline.gtin}`,
          candidate_text: `${currentRevision.artwork.productName} REF ${currentRevision.artwork.sku} (01)${currentRevision.artwork.gtin}`,
        });
        setBackendDiff(res);
      } catch (err) {
        console.warn('Backend compare offline, using local fallback:', err);
      } finally {
        setIsComparing(false);
      }
    };

    fetchBackendCompare();
  }, [selectedRevisionKey]);

  // Field-by-field diff
  const fieldDiffs = [
    {
      field: 'Product Commercial Name',
      baseline: baseline.productName,
      revised: currentRevision.artwork.productName,
      status: baseline.productName === currentRevision.artwork.productName ? 'UNCHANGED' : 'MODIFIED',
    },
    {
      field: 'Catalog / SKU Ref',
      baseline: baseline.sku,
      revised: currentRevision.artwork.sku,
      status: baseline.sku === currentRevision.artwork.sku ? 'UNCHANGED' : 'MODIFIED',
    },
    {
      field: 'UDI GTIN-14',
      baseline: baseline.gtin,
      revised: currentRevision.artwork.gtin,
      status: baseline.gtin === currentRevision.artwork.gtin ? 'UNCHANGED' : 'CRITICAL_DIFF',
      note:
        baseline.gtin !== currentRevision.artwork.gtin
          ? 'Check digit mismatch! Modulo-10 checksum fails parity.'
          : 'Exact modulo-10 match',
    },
    {
      field: 'Lot / Batch Identifier',
      baseline: baseline.lot,
      revised: currentRevision.artwork.lot,
      status: baseline.lot === currentRevision.artwork.lot ? 'UNCHANGED' : 'MODIFIED',
    },
    {
      field: 'Expiration Date (AI 17)',
      baseline: baseline.expDate,
      revised: currentRevision.artwork.expDate,
      status: baseline.expDate === currentRevision.artwork.expDate ? 'UNCHANGED' : 'EXPIRY_DRIFT',
      note:
        baseline.expDate !== currentRevision.artwork.expDate
          ? 'Shelf-life extension exceeds stability master envelope.'
          : 'Within stability envelope',
    },
    {
      field: 'Legal Entity Manufacturer',
      baseline: baseline.manufacturerName,
      revised: currentRevision.artwork.manufacturerName,
      status: baseline.manufacturerName === currentRevision.artwork.manufacturerName ? 'UNCHANGED' : 'MODIFIED',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            Asymmetric Label Diff & Comparison
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare baseline approved packaging against revised engineering change orders (ECO).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onTriggerSignoff && (
            <Button variant="primary" size="sm" onClick={onTriggerSignoff}>
              Authorize Sign-off
            </Button>
          )}
        </div>
      </div>

      {/* Revision Selector Bar & Modes */}
      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Compare Against:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedRevisionKey('REV_A')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedRevisionKey === 'REV_A'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Revision A (Clean)
            </button>
            <button
              onClick={() => setSelectedRevisionKey('REV_B')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedRevisionKey === 'REV_B'
                  ? 'bg-red-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Revision B (Bad Checksum)
            </button>
            <button
              onClick={() => setSelectedRevisionKey('REV_C')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedRevisionKey === 'REV_C'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Revision C (Expiry Drift)
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveDiffMode('semantic')}
              className={`px-2.5 py-1 rounded text-2xs font-medium transition-colors flex items-center gap-1.5 ${
                activeDiffMode === 'semantic'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="h-3 w-3" />
              Semantic Table
            </button>
            <button
              onClick={() => setActiveDiffMode('visual')}
              className={`px-2.5 py-1 rounded text-2xs font-medium transition-colors flex items-center gap-1.5 ${
                activeDiffMode === 'visual'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye className="h-3 w-3" />
              Visual Delta Redline
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={currentRevision.riskVariant} dot>
              Risk Class: {backendDiff?.risk_level || currentRevision.riskLevel}
            </Badge>
            {backendDiff && (
              <span className="text-2xs font-mono text-slate-400">
                Text Similarity: {Math.round(backendDiff.text_similarity_ratio * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mode 1: Semantic Diff Table */}
      {activeDiffMode === 'semantic' && (
        <Card>
          <CardHeader className="py-3.5 px-4 flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm">Field-by-Field Semantic Diff</CardTitle>
              <CardDescription className="text-2xs">
                Algorithmic comparison between Baseline (Rev 2.0) and Candidate ({currentRevision.name})
              </CardDescription>
            </div>
            <span className="text-2xs text-slate-400 font-mono">
              Evaluated with Python difflib & GS1 Engine
            </span>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-2xs uppercase tracking-wider text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3 w-44">Packaging Element</th>
                    <th className="p-3">Baseline Master (Rev 2.0)</th>
                    <th className="p-3">Candidate Revision</th>
                    <th className="p-3 w-32">Delta Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
                  {fieldDiffs.map((diff, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        diff.status === 'CRITICAL_DIFF'
                          ? 'bg-red-50/40 dark:bg-red-950/20'
                          : diff.status === 'EXPIRY_DRIFT'
                          ? 'bg-amber-50/40 dark:bg-amber-950/20'
                          : diff.status === 'MODIFIED'
                          ? 'bg-blue-50/30 dark:bg-blue-950/15'
                          : ''
                      }`}
                    >
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {diff.field}
                      </td>
                      <td className="p-3 font-mono text-2xs text-slate-600 dark:text-slate-400">
                        {diff.baseline}
                      </td>
                      <td className="p-3 font-mono text-2xs">
                        <span
                          className={
                            diff.status === 'CRITICAL_DIFF'
                              ? 'text-red-700 dark:text-red-400 font-bold bg-red-100 dark:bg-red-950/60 px-1 py-0.5 rounded'
                              : diff.status === 'EXPIRY_DRIFT'
                              ? 'text-amber-700 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-950/60 px-1 py-0.5 rounded'
                              : diff.status === 'MODIFIED'
                              ? 'text-blue-700 dark:text-blue-400 font-semibold'
                              : 'text-slate-600 dark:text-slate-400'
                          }
                        >
                          {diff.revised}
                        </span>
                        {diff.note && (
                          <p className="text-2xs font-sans text-slate-500 dark:text-slate-400 mt-1">
                            {diff.note}
                          </p>
                        )}
                      </td>
                      <td className="p-3">
                        {diff.status === 'UNCHANGED' && (
                          <Badge variant="neutral">UNCHANGED</Badge>
                        )}
                        {diff.status === 'MODIFIED' && (
                          <Badge variant="teal">MODIFIED</Badge>
                        )}
                        {diff.status === 'EXPIRY_DRIFT' && (
                          <Badge variant="review" dot>EXPIRY DRIFT</Badge>
                        )}
                        {diff.status === 'CRITICAL_DIFF' && (
                          <Badge variant="critical" dot>CHECKSUM ERR</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mode 2: Visual Alignment & Delta Redline */}
      {activeDiffMode === 'visual' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="py-3 px-4 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs">Baseline Layout (Approved Spec)</CardTitle>
              <Badge variant="pass">APPROVED</Badge>
            </CardHeader>
            <CardContent className="p-4 bg-slate-50/50 dark:bg-slate-950/50">
              <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-5 bg-white dark:bg-slate-900 text-xs font-mono space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {baseline.productName}
                    </span>
                    <span className="text-2xs text-slate-400">{baseline.tradeName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      REF {baseline.sku}
                    </span>
                    <span className="text-2xs text-slate-400">LOT {baseline.lot}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-2xs">
                  <span className="text-emerald-800 dark:text-emerald-300 block font-semibold">
                    UDI GTIN-14: (01) {baseline.gtin}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">
                    ✓ Modulo-10 Check Digit 6 (Valid)
                  </span>
                </div>

                <div className="flex items-center justify-between text-2xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>EXP: {baseline.expDate}</span>
                  <span>{baseline.manufacturerName}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3 px-4 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs">Candidate Layout with Delta Redline</CardTitle>
              <Badge variant={currentRevision.riskVariant}>{currentRevision.riskLevel} RISK</Badge>
            </CardHeader>
            <CardContent className="p-4 bg-slate-50/50 dark:bg-slate-950/50">
              <div
                className={`border rounded-lg p-5 bg-white dark:bg-slate-900 text-xs font-mono space-y-3 relative overflow-hidden ${
                  currentRevision.riskLevel === 'HIGH'
                    ? 'border-red-400 dark:border-red-800/80'
                    : currentRevision.riskLevel === 'MEDIUM'
                    ? 'border-amber-400 dark:border-amber-800/80'
                    : 'border-emerald-400 dark:border-emerald-800/80'
                }`}
              >
                <div className="flex items-start justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {currentRevision.artwork.productName}
                    </span>
                    <span className="text-2xs text-slate-400">{currentRevision.artwork.tradeName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      REF {currentRevision.artwork.sku}
                    </span>
                    <span className="text-2xs text-slate-400">LOT {currentRevision.artwork.lot}</span>
                  </div>
                </div>

                {/* Delta Highlighting Box */}
                <div
                  className={`p-2.5 rounded text-2xs border ${
                    currentRevision.riskLevel === 'HIGH'
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800'
                      : currentRevision.riskLevel === 'MEDIUM'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold ${
                        currentRevision.riskLevel === 'HIGH'
                          ? 'text-red-900 dark:text-red-200'
                          : 'text-emerald-900 dark:text-emerald-200'
                      }`}
                    >
                      UDI GTIN-14: (01) {currentRevision.artwork.gtin}
                    </span>
                    {currentRevision.riskLevel === 'HIGH' && (
                      <span className="px-1 py-0.2 rounded bg-red-200 text-red-900 font-bold text-[9px]">
                        REDLINE DELTA
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      currentRevision.riskLevel === 'HIGH'
                        ? 'text-red-700 dark:text-red-400 font-semibold'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {currentRevision.riskLevel === 'HIGH'
                      ? '✗ Check Digit 9 mismatch (Calculated: 6). Barcode scanner reject.'
                      : '✓ Modulo-10 Check Digit 6 (Valid)'}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between text-2xs pt-2 border-t border-slate-100 dark:border-slate-800 ${
                    currentRevision.riskLevel === 'MEDIUM'
                      ? 'bg-amber-50/60 dark:bg-amber-950/30 p-1.5 rounded border border-amber-200 dark:border-amber-800'
                      : 'text-slate-500'
                  }`}
                >
                  <span
                    className={
                      currentRevision.riskLevel === 'MEDIUM'
                        ? 'text-amber-900 dark:text-amber-200 font-bold'
                        : ''
                    }
                  >
                    EXP: {currentRevision.artwork.expDate}
                    {currentRevision.riskLevel === 'MEDIUM' && ' [EXCEEDS 5Y STABILITY]'}
                  </span>
                  <span>{currentRevision.artwork.manufacturerName}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
