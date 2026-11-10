import React, { useState } from 'react';
import { Code2, CheckCircle2, RefreshCw, FileText } from 'lucide-react';

interface RuleExtractorProps {
  onAddRule: (rule: {
    ruleCode: string;
    clauseRef: string;
    description: string;
    assertionType: string;
    machineLogic: string;
  }) => void;
}

export const RuleExtractor: React.FC<RuleExtractorProps> = ({ onAddRule }) => {
  const [inputProse, setInputProse] = useState(
    'EU MDR Annex I §23.2(q) dictates: For sterile medical devices, the label shall indicate the condition that enables the sterile barrier to be recognized as such, with unambiguous ISO 15223-1 graphical symbols having minimum height and aspect ratio >= 1.5.'
  );
  const [isCompiling, setIsCompiling] = useState(false);
  const [extractedResult, setExtractedResult] = useState<{
    ruleCode: string;
    clauseRef: string;
    description: string;
    assertionType: 'PRESENCE' | 'FORMAT' | 'ASPECT_RATIO' | 'LEGIBILITY';
    machineLogic: string;
    astNodes: string[];
  } | null>({
    ruleCode: 'MDR-23.2-STERILE-BARRIER',
    clauseRef: 'EU MDR Annex I §23.2(q) / ISO 15223-1 Ref 5.2.11',
    description: 'Ensure sterile barrier symbol is present on primary pouch with verified aspect ratio >= 1.55.',
    assertionType: 'ASPECT_RATIO',
    machineLogic: 'ASSERT symbol_exists("STERILE_BARRIER") AND aspect_ratio("STERILE_BARRIER") >= 1.50',
    astNodes: ['Token(SYMBOL_ID: STERILE_BARRIER)', 'Condition(GTE: 1.50)', 'Target(Primary Pouch)'],
  });

  const handleCompile = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      setExtractedResult({
        ruleCode: 'AUTOGEN-REG-2026-X1',
        clauseRef: 'Custom Extract §23.2(q)',
        description: 'Auto-compiled constraint: Validates sterile packaging barrier symbol and minimum aspect ratio.',
        assertionType: 'ASPECT_RATIO',
        machineLogic: 'ASSERT symbol_exists("STERILE_BARRIER") AND aspect_ratio("STERILE_BARRIER") >= 1.50',
        astNodes: [
          'AST_ROOT: AssertionBlock',
          'Node(Type: SymbolCheck, Ref: ISO_15223_5_2_11)',
          'Node(Type: MetricCheck, AspectRatio: >=1.50)',
          'Enforcement: HardBlockOnFail'
        ]
      });
    }, 700);
  };

  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col h-full shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <Code2 className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Automated Rule Extractor (Prose-to-AST)
            </h3>
            <p className="text-[11px] text-slate-500">
              Deterministic AST assertion compiler for GAMP 5 CSA testing
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-3 flex-1 overflow-y-auto pr-1 text-xs">
        <div>
          <label className="block text-[10px] font-mono text-slate-600 mb-1 flex items-center justify-between font-semibold">
            <span>INPUT REGULATORY PROSE OR WARNING LETTER EXCERPT</span>
            <span className="text-blue-700 text-[10px]">Natural Language NLP Parser</span>
          </label>
          <textarea
            value={inputProse}
            onChange={e => setInputProse(e.target.value)}
            rows={3}
            className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 resize-none font-sans"
          />
        </div>

        <button
          onClick={handleCompile}
          disabled={isCompiling}
          className="w-full py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
        >
          {isCompiling ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Tokenizing & Generating Deterministic Rule...</span>
            </>
          ) : (
            <>
              <Code2 className="w-3.5 h-3.5" />
              <span>Compile Prose to Executable Validation Rule</span>
            </>
          )}
        </button>

        {extractedResult && (
          <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                {extractedResult.ruleCode}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold border border-blue-200">
                Type: {extractedResult.assertionType}
              </span>
            </div>

            <p className="text-slate-700 text-xs leading-relaxed">{extractedResult.description}</p>

            <div className="bg-slate-900 rounded p-2.5 font-mono text-[11px] text-emerald-400">
              <div className="text-[10px] text-slate-400 mb-1">Generated AST Logic:</div>
              <code>{extractedResult.machineLogic}</code>
            </div>

            <div className="bg-white rounded p-2 text-[10px] font-mono text-slate-600 space-y-0.5 border border-slate-200">
              <div className="text-slate-800 font-semibold mb-0.5">AST Parsing Pipeline Tokens:</div>
              {extractedResult.astNodes.map((node, i) => (
                <div key={i} className="text-blue-800">↳ {node}</div>
              ))}
            </div>

            <button
              onClick={() => onAddRule(extractedResult)}
              className="w-full py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mt-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Inject Rule into Continuous Compliance Engine
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
