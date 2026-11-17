import React, { useState, useMemo } from 'react';
import { Search, BookOpen, CheckCircle2, Shield, ArrowRight, ExternalLink, Database, Sparkles, RefreshCw } from 'lucide-react';
import { RegulatoryUpdate } from '../../types';
import { apiClient, BackendClauseSearchResponse } from '../../utils/apiClient';

interface ClauseRAGViewerProps {
  selectedUpdate: RegulatoryUpdate | null;
  onPromoteRule: (ruleCode: string) => void;
  promotedRules: string[];
}

export const ClauseRAGViewer: React.FC<ClauseRAGViewerProps> = ({
  selectedUpdate,
  onPromoteRule,
  promotedRules,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ragResult, setRagResult] = useState<BackendClauseSearchResponse | null>(null);
  const [isSearchingRag, setIsSearchingRag] = useState(false);
  const [searchMode, setSearchMode] = useState<'filter' | 'rag'>('rag');

  const handleRagSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || isSearchingRag) return;
    setIsSearchingRag(true);
    try {
      const res = await apiClient.searchClausesRAG(searchQuery);
      setRagResult(res);
    } catch {
      setRagResult({
        query: searchQuery,
        matched_clauses: [],
        synthesized_answer: 'Unable to connect to regulatory RAG index.',
        disclaimer: 'Note: Regulatory clause dataset is a curated sample for assistive verification, not the full statutory legal text.',
      });
    } finally {
      setIsSearchingRag(false);
    }
  };

  // Real-time client-side semantic keyword search across extracted rules
  const filteredRules = useMemo(() => {
    if (!selectedUpdate) return [];
    if (!searchQuery.trim()) return selectedUpdate.extractedRules;

    const q = searchQuery.toLowerCase();
    return selectedUpdate.extractedRules.filter(
      r =>
        r.ruleCode.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.clauseRef.toLowerCase().includes(q) ||
        r.assertionType.toLowerCase().includes(q) ||
        r.machineLogic.toLowerCase().includes(q)
    );
  }, [selectedUpdate, searchQuery]);

  if (!selectedUpdate) {
    return (
      <div className="bg-white border border-slate-200 rounded p-8 flex flex-col items-center justify-center text-center h-full shadow-xs">
        <BookOpen className="w-10 h-10 text-slate-300 mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">No Regulatory Clause Selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Select a regulatory feed item from the Radar on the left to inspect statutory clauses and extract executable rules.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <BookOpen className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Statutory Clause & Retrieval Inspector
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Standard: <strong className="text-slate-800">{selectedUpdate.standard}</strong> | Clause:{' '}
              <span className="text-blue-700 font-semibold">{selectedUpdate.clause}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authority Verified ({selectedUpdate.authority})</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Demonstration Corpus
          </span>
        </div>
      </div>

      {/* RAG Search / Semantic Query */}
      <div className="mt-3 space-y-2">
        <form onSubmit={handleRagSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search regulatory database (e.g. 'sterile ethylene oxide', 'modulo 10 check digit', 'rx only')..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-slate-400 font-sans"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            disabled={isSearchingRag || !searchQuery.trim()}
            className="px-3 py-1.5 rounded-md bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            {isSearchingRag ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            <span>Search RAG</span>
          </button>
        </form>

        {/* Live RAG Output Box */}
        {ragResult && (
          <div className="p-3 rounded-lg border border-teal-200 dark:border-teal-900/60 bg-teal-50/30 dark:bg-teal-950/20 text-xs space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-teal-100 dark:border-teal-900/40">
              <span className="font-mono text-2xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-teal-600" />
                RAG RETRIEVAL RESULT ({ragResult.matched_clauses.length} Matched)
              </span>
              <button
                onClick={() => setRagResult(null)}
                className="text-2xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            </div>

            <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans bg-white dark:bg-slate-900 p-2.5 rounded border border-teal-100 dark:border-teal-900/40">
              {ragResult.synthesized_answer}
            </div>

            {ragResult.matched_clauses.map(clause => (
              <div
                key={clause.clause_id}
                className="p-2 bg-white/80 dark:bg-slate-900/80 rounded border border-slate-200 dark:border-slate-800 text-2xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {clause.source_name} • {clause.section}
                  </span>
                  <span className="font-mono text-teal-700 dark:text-teal-400">
                    Relevance: {(clause.relevance_score * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  &ldquo;{clause.excerpt}&rdquo;
                </p>
              </div>
            ))}

            <p className="text-[10px] text-slate-500 font-mono italic">
              {ragResult.disclaimer}
            </p>
          </div>
        )}
      </div>

      {/* Official Legal Text / Prose Viewer */}
      <div className="mt-3 flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
        <div className="bg-slate-50 border border-slate-200 rounded p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-wider">
              OFFICIAL REGULATORY TEXT ({selectedUpdate.authority})
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Effective Date: {selectedUpdate.effectiveDate}
            </span>
          </div>

          <div className="text-xs text-slate-800 leading-relaxed font-sans border-l-2 border-blue-600 pl-3 italic bg-white p-2.5 rounded-r border-y border-r border-slate-200">
            &ldquo;{selectedUpdate.summary} Devices placed on the market within target jurisdictions must guarantee that all mandatory human-readable interpretation and machine-readable AIDC elements conform strictly to internationally recognized harmonized standards. Failure to display mandatory symbols or check digits constitutes a critical non-conformance.&rdquo;
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-mono text-slate-500">Applicable Classes:</span>
            {selectedUpdate.deviceClasses.map(cls => (
              <span
                key={cls}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-medium"
              >
                {cls}
              </span>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>Jurisdictions: {selectedUpdate.markets.join(', ')}</span>
            <span className="text-slate-400">Source: Official Harmonized Standard Publication</span>
          </div>
        </div>

        {/* Machine-Extracted Rules from Prose */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-900 font-mono uppercase tracking-wider">
              Executable Validation Assertions ({filteredRules.length} of {selectedUpdate.extractedRules.length})
            </span>
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <Database className="w-3 h-3 text-blue-600" />
              <span>Grounded Rule Synthesizer</span>
            </span>
          </div>

          <div className="space-y-2">
            {filteredRules.map(rule => {
              const isPromoted = promotedRules.includes(rule.ruleCode);
              return (
                <div
                  key={rule.id}
                  className="bg-white border border-slate-200 rounded p-3 text-xs hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{rule.ruleCode}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                        {rule.assertionType}
                      </span>
                    </div>

                    <button
                      onClick={() => onPromoteRule(rule.ruleCode)}
                      className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                        isPromoted
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      }`}
                    >
                      {isPromoted ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active Rule</span>
                        </>
                      ) : (
                        <>
                          <span>Promote to Validation Suite</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-slate-700 text-xs mt-1.5 leading-relaxed">{rule.description}</p>

                  <div className="mt-2 bg-slate-900 rounded p-2 font-mono text-[11px] text-emerald-400">
                    <div className="text-[10px] text-slate-400 mb-0.5">Automated Execution Logic:</div>
                    <code>{rule.machineLogic}</code>
                  </div>

                  <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                    <span>Citation: {rule.clauseRef}</span>
                    <span className="text-blue-700 font-medium">Deterministic Rule Gate</span>
                  </div>
                </div>
              );
            })}

            {filteredRules.length === 0 && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded text-center text-xs text-slate-500">
                No rules match query &quot;{searchQuery}&quot;. Clear search to view all rules.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
