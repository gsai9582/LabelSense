import React, { useState } from 'react';
import { Network, ZoomIn, ZoomOut, RotateCcw, Filter, CheckCircle2, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { DigitalThreadNode } from '../../types';

interface KnowledgeGraphProps {
  highlightedNodeId?: string;
  onSelectNode: (node: DigitalThreadNode | null) => void;
  selectedNode: DigitalThreadNode | null;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  onSelectNode,
  selectedNode,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'IMPACTED' | 'COMPLIANT'>('ALL');

  // Structured left-to-right hierarchical flow
  const columns = [
    {
      stage: '1. ECN TRIGGER',
      subtitle: 'Upstream Engineering Change',
      nodes: [
        {
          id: 'ecn-trigger',
          label: 'ECN-2026-S01',
          subtext: 'Shelf Life 24m ➔ 36m',
          type: 'TRIGGER',
          status: 'FLAGGED' as const,
          badge: 'ASTM F1980',
          count: '1 ECN',
        }
      ]
    },
    {
      stage: '2. PRODUCT SKU',
      subtitle: 'PLM Master Records',
      nodes: [
        {
          id: 'sku-stent',
          label: 'Stent-CS400',
          subtext: 'EverCor™ Coronary Stent',
          type: 'SKU',
          status: 'COMPLIANT' as const,
          badge: 'Class III Imp',
          count: '3 Packaging Lvls',
        },
        {
          id: 'sku-knee',
          label: 'OrthoKnee-XR2',
          subtext: 'Total Knee Femoral',
          type: 'SKU',
          status: 'COMPLIANT' as const,
          badge: 'Class III',
          count: '2 Packaging Lvls',
        }
      ]
    },
    {
      stage: '3. PACKAGING',
      subtitle: 'Sterile Barrier Boundaries',
      nodes: [
        {
          id: 'pack-primary',
          label: 'Primary Pouch',
          subtext: 'Single Sterile Barrier Tyvek',
          type: 'PACKAGING',
          status: 'FLAGGED' as const,
          badge: 'ISO 11607',
          count: '4 Markets',
        },
        {
          id: 'pack-secondary',
          label: 'Secondary Carton',
          subtext: 'Folding Box with IFU',
          type: 'PACKAGING',
          status: 'COMPLIANT' as const,
          badge: 'SBS Box',
          count: '4 Markets',
        },
        {
          id: 'pack-shipper',
          label: 'Shipper Case',
          subtext: 'Corrugated Pallet Shipper',
          type: 'PACKAGING',
          status: 'COMPLIANT' as const,
          badge: 'GS1-128',
          count: 'Global',
        }
      ]
    },
    {
      stage: '4. MARKETS & LANGS',
      subtitle: 'Regulatory Jurisdictions',
      nodes: [
        {
          id: 'mkt-us',
          label: 'United States',
          subtext: 'FDA 21 CFR §801 (English)',
          type: 'MARKET',
          status: 'COMPLIANT' as const,
          badge: 'US FDA',
          count: 'EN IFU',
        },
        {
          id: 'mkt-eu',
          label: 'European Union',
          subtext: 'EU MDR Annex I (20+ Langs)',
          type: 'MARKET',
          status: 'COMPLIANT' as const,
          badge: 'CE 0123',
          count: 'DE/FR/ES',
        },
        {
          id: 'mkt-jp',
          label: 'Japan PMDA',
          subtext: 'PMD Act Art.63 (Japanese)',
          type: 'MARKET',
          status: 'NEEDS_REVIEW' as const,
          badge: 'PMDA',
          count: 'JA IFU',
        }
      ]
    },
    {
      stage: '5. ARTWORK REVISIONS',
      subtitle: 'Synchronized Artwork Masters',
      nodes: [
        {
          id: 'art-lbl-001',
          label: 'ART-EU-POUCH-400',
          subtext: 'Rev 4.3 (Sync AI 17)',
          type: 'ARTWORK',
          status: 'COMPLIANT' as const,
          badge: 'SVG Master',
          count: 'Approved',
        },
        {
          id: 'art-lbl-002',
          label: 'ART-US-BOX-400',
          subtext: 'Rev 4.3 (Carton Label)',
          type: 'ARTWORK',
          status: 'COMPLIANT' as const,
          badge: 'GUDID Sync',
          count: 'Approved',
        },
        {
          id: 'art-lbl-003',
          label: 'ART-JP-POUCH-400',
          subtext: 'Rev 5.0 (Audit Flagged)',
          type: 'ARTWORK',
          status: 'FLAGGED' as const,
          badge: 'Hold',
          count: 'Blocked',
        }
      ]
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <Network className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Label Digital Thread Explorer (Knowledge Graph)
            </h3>
            <p className="text-[11px] text-slate-500">
              Deterministic lineage flow: ECN Trigger ➔ SKU ➔ Packaging ➔ Markets ➔ Artwork Masters
            </p>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] font-mono text-slate-500">Filter View:</span>
          <div className="flex items-center bg-slate-100 rounded p-0.5 border border-slate-200">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                activeFilter === 'ALL' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600'
              }`}
            >
              All Nodes
            </button>
            <button
              onClick={() => setActiveFilter('IMPACTED')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                activeFilter === 'IMPACTED' ? 'bg-white text-rose-700 font-semibold shadow-2xs' : 'text-slate-600'
              }`}
            >
              Impacted Only
            </button>
          </div>
        </div>
      </div>

      {/* Structured Left-to-Right Hierarchical Canvas */}
      <div className="flex-1 w-full bg-slate-50/80 rounded border border-slate-200 mt-3 p-3 overflow-x-auto overflow-y-auto">
        <div className="min-w-[840px] flex items-start gap-4">
          {columns.map((col, colIdx) => (
            <div key={col.stage} className="flex-1 flex flex-col min-w-[155px]">
              {/* Column Stage Header */}
              <div className="pb-2 border-b-2 border-slate-300 mb-3">
                <div className="font-mono font-bold text-[11px] text-slate-900">{col.stage}</div>
                <div className="text-[10px] text-slate-500 truncate">{col.subtitle}</div>
              </div>

              {/* Column Nodes */}
              <div className="space-y-2.5">
                {col.nodes.map(node => {
                  if (activeFilter === 'IMPACTED' && node.status !== 'FLAGGED') return null;

                  const isSelected = selectedNode?.id === node.id;
                  const isFlagged = node.status === 'FLAGGED';
                  const isReview = node.status === 'NEEDS_REVIEW';

                  return (
                    <div
                      key={node.id}
                      onClick={() => onSelectNode(isSelected ? null : (node as any))}
                      className={`p-2.5 rounded border text-left cursor-pointer transition-all shadow-2xs relative ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20'
                          : isFlagged
                          ? 'bg-rose-50/60 border-rose-300 hover:border-rose-400'
                          : isReview
                          ? 'bg-amber-50/60 border-amber-300 hover:border-amber-400'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold border ${
                          isFlagged ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          isReview ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {node.badge}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          {node.count}
                        </span>
                      </div>

                      {/* Title & Subtext */}
                      <div className="font-semibold text-slate-900 text-xs truncate">
                        {node.label}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate font-sans">
                        {node.subtext}
                      </div>

                      {/* Status indicator line */}
                      <div className={`mt-2 pt-1 border-t text-[10px] font-mono flex items-center justify-between ${
                        isFlagged ? 'border-rose-200 text-rose-700' :
                        isReview ? 'border-amber-200 text-amber-700' : 'border-slate-100 text-emerald-700'
                      }`}>
                        <span>{isFlagged ? 'Impacted' : isReview ? 'Review' : 'Verified'}</span>
                        <span>➔</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Node Details Bar */}
      {selectedNode && (
        <div className="mt-3 bg-slate-50 border border-slate-200 rounded p-2.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-slate-900 uppercase text-[11px]">
              Inspected Node:
            </span>
            <span className="font-semibold text-blue-800">{selectedNode.label}</span>
            <span className="text-slate-500 font-mono text-[11px]">Code: {selectedNode.code}</span>
          </div>
          <button
            onClick={() => onSelectNode(null)}
            className="text-[11px] text-slate-500 hover:text-slate-900 font-mono"
          >
            [Close Selection]
          </button>
        </div>
      )}
    </div>
  );
};
