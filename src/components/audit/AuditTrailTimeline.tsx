import React, { useState } from 'react';
import { History, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Search, Filter, Hash, Copy } from 'lucide-react';
import { AuditEvent, verifyAuditChain, AuditChainVerificationResult } from '../../utils/auditTrail';
import { apiClient } from '../../utils/apiClient';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface AuditTrailTimelineProps {
  events: AuditEvent[];
}

export const AuditTrailTimeline: React.FC<AuditTrailTimelineProps> = ({ events }) => {
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    totalEvents: number;
    message: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');
  const [verdictFilter, setVerdictFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    try {
      // First attempt live backend API verification
      const apiRes = await apiClient.verifyAuditChain();
      setVerificationResult({
        isValid: apiRes.is_valid,
        totalEvents: apiRes.total_blocks,
        message: apiRes.details,
      });
    } catch {
      // Fallback to client-side verification
      const localResult = await verifyAuditChain(events);
      setVerificationResult({
        isValid: localResult.isValid,
        totalEvents: localResult.totalEvents,
        message: localResult.message,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopy = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredEvents = events.filter(evt => {
    if (eventTypeFilter !== 'ALL' && evt.eventType !== eventTypeFilter) return false;
    if (verdictFilter !== 'ALL' && evt.systemVerdict !== verdictFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        evt.id.toLowerCase().includes(q) ||
        evt.actor.toLowerCase().includes(q) ||
        evt.action.toLowerCase().includes(q) ||
        evt.details.toLowerCase().includes(q) ||
        evt.currentHash.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-sm">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              FIPS 180-4 Cryptographic Audit Trail
            </h3>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Chained SHA-256 event log with sequential block integrity verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="text-xs font-mono"
          >
            {isVerifying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600 mr-1.5" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mr-1.5" />
            )}
            Verify SHA-256 Chain
          </Button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <div
          className={`mt-2.5 p-3 rounded-lg border text-xs flex items-center justify-between ${
            verificationResult.isValid
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {verificationResult.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span className="font-mono text-2xs sm:text-xs">{verificationResult.message}</span>
          </div>
          <span className="text-2xs font-mono text-slate-500 shrink-0 ml-2">
            {verificationResult.totalEvents} Blocks Checked
          </span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search action, actor, hash..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500/40"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="h-3 w-3 text-slate-400" />
          <select
            value={eventTypeFilter}
            onChange={e => setEventTypeFilter(e.target.value)}
            className="py-1 px-2 text-2xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Event Types</option>
            <option value="VALIDATION_RUN">Validation Runs</option>
            <option value="DOCUMENT_INGEST">Document Ingestion</option>
            <option value="OCR_EXTRACTION">OCR Extraction</option>
            <option value="DEMO_SIGNATURE">Electronic Signatures</option>
            <option value="SYSTEM_BOOT">System Boot</option>
          </select>

          <select
            value={verdictFilter}
            onChange={e => setVerdictFilter(e.target.value)}
            className="py-1 px-2 text-2xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Verdicts</option>
            <option value="PASS">PASS</option>
            <option value="REVIEW">REVIEW</option>
            <option value="FAIL">FAIL</option>
          </select>
        </div>
      </div>

      {/* Assistive Notice */}
      <div className="mt-2 p-2 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded text-2xs text-slate-500 leading-relaxed">
        <strong>Traceability Notice:</strong> Audit blocks are chained sequentially via SHA-256.
        Designed to assist GAMP 5 CSA Category 4 compliance. Full commercial release requires designated qualified human review.
      </div>

      {/* Timeline Events List */}
      <div className="mt-3 flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No audit records match the selected filter.
          </div>
        ) : (
          filteredEvents.map((evt, idx) => (
            <div key={evt.id} className="relative pl-6 pb-2">
              {/* Timeline connector vertical line */}
              {idx < filteredEvents.length - 1 && (
                <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
              )}

              {/* Timeline node icon */}
              <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-teal-600 dark:border-teal-400 flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
              </div>

              {/* Event Box */}
              <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs space-y-1.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-teal-700 dark:text-teal-300 font-bold text-2xs">
                      {evt.id}
                    </span>
                    <Badge variant="neutral">{evt.eventType}</Badge>
                  </div>
                  <span className="text-2xs font-mono text-slate-400">{evt.timestamp}</span>
                </div>

                <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                  {evt.action}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-2xs leading-relaxed font-sans">
                  {evt.details}
                </p>

                <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-2xs font-mono text-slate-500">
                  <span>
                    Actor: <strong className="text-slate-800 dark:text-slate-200">{evt.actor}</strong> ({evt.role})
                  </span>
                  <Badge
                    variant={
                      evt.systemVerdict === 'PASS'
                        ? 'pass'
                        : evt.systemVerdict === 'REVIEW'
                        ? 'review'
                        : 'critical'
                    }
                  >
                    {evt.systemVerdict || 'PASS'}
                  </Badge>
                </div>

                {/* Cryptographic Hash Chaining Visual */}
                <div className="bg-white dark:bg-slate-900 rounded p-2 text-2xs font-mono text-slate-500 space-y-1 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 truncate">
                      Prev Hash: {evt.previousHash}
                    </span>
                    <button
                      onClick={() => handleCopy(evt.previousHash)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500"
                      title="Copy previous hash"
                      aria-label="Copy previous hash"
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-emerald-800 dark:text-emerald-400 font-semibold">
                    <span className="truncate">
                      Curr Hash: {evt.currentHash}
                    </span>
                    <button
                      onClick={() => handleCopy(evt.currentHash)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500"
                      title="Copy block hash"
                      aria-label="Copy current block hash"
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
