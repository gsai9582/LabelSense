import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Sparkles,
  Bot,
  MessageSquare,
  ShieldCheck,
  Check,
  X,
  Edit3,
  RefreshCw,
  Send,
  AlertTriangle,
  FileSearch,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  apiClient,
  BackendFindingItem,
  BackendFindingExplanationResponse,
  BackendChatResponse,
} from '../../utils/apiClient';

interface AiAssistantPanelProps {
  findings: BackendFindingItem[];
  extractedFields: Record<string, any>;
  documentName: string;
  sha256Hash: string;
  verdict: string;
  overallScore: number;
}

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({
  findings,
  extractedFields,
  documentName,
  sha256Hash,
  verdict,
  overallScore,
}) => {
  const [activeTab, setActiveTab] = useState<'explainer' | 'chat'>('explainer');
  const [aiStatus, setAiStatus] = useState<{
    status: string;
    provider: string;
    is_demo_mode: boolean;
  } | null>(null);

  // Finding Explainer State
  const [selectedFinding, setSelectedFinding] = useState<BackendFindingItem | null>(
    findings.length > 0 ? findings[0] : null
  );
  const [explanation, setExplanation] = useState<BackendFindingExplanationResponse | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [decisionRecorded, setDecisionRecorded] = useState<string | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; citedFindings?: string[] }[]
  >([
    {
      role: 'assistant',
      text: `Hello, I am **Ask LabelSense**, an assistive verification assistant grounded in report **${documentName}**. Ask me about the deterministic rule findings, evidence coordinates, or clinical defect risks.`,
      citedFindings: [],
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  // Check AI Provider Status
  useEffect(() => {
    apiClient
      .getAiStatus()
      .then(res => setAiStatus(res))
      .catch(() => setAiStatus({ status: 'unavailable', provider: 'none', is_demo_mode: false }));
  }, []);

  // Auto-fetch explanation when selected finding changes
  useEffect(() => {
    if (!selectedFinding) {
      setExplanation(null);
      return;
    }

    let isMounted = true;
    setIsExplaining(true);
    setDecisionRecorded(null);

    apiClient
      .explainFinding(
        selectedFinding.id,
        selectedFinding.rule_id,
        selectedFinding.evidence_value || selectedFinding.field,
        selectedFinding.message,
        selectedFinding.severity
      )
      .then(res => {
        if (isMounted) {
          setExplanation(res);
          setIsExplaining(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsExplaining(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedFinding]);

  const handleDecision = async (decision: 'ACCEPT' | 'EDIT' | 'REJECT') => {
    if (!selectedFinding) return;
    try {
      await apiClient.recordReviewerDecision(
        'Finding Explanation',
        selectedFinding.id,
        decision,
        `Reviewer selected ${decision} on recommendation.`
      );
      setDecisionRecorded(decision);
    } catch (e: any) {
      alert(`Failed to record decision: ${e.message}`);
    }
  };

  const handleSendMessage = async (queryToSend?: string) => {
    const q = queryToSend || userInput;
    if (!q.trim() || isChatting) return;

    const newMsgs = [...chatMessages, { role: 'user' as const, text: q }];
    setChatMessages(newMsgs);
    setUserInput('');
    setIsChatting(true);

    const reportContext = {
      documentName,
      sha256Hash,
      verdict,
      overallScore,
      extractedFields,
      findings,
    };

    try {
      const resp = await apiClient.chatWithReport(q, reportContext);
      setChatMessages([
        ...newMsgs,
        {
          role: 'assistant',
          text: resp.response,
          citedFindings: resp.cited_finding_ids,
        },
      ]);
    } catch {
      setChatMessages([
        ...newMsgs,
        {
          role: 'assistant',
          text: 'Unable to process query at this time. AI assistant is operating in offline fallback mode.',
        },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <Card className="border-teal-200/80 dark:border-teal-900/60 shadow-sm bg-gradient-to-b from-teal-50/20 via-white to-white dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-900">
      {/* Top Clinical Header */}
      <CardHeader className="py-3 px-4 flex-row items-center justify-between border-b border-teal-100 dark:border-teal-900/40 space-y-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">
                AI-Assisted Verification Insights
              </CardTitle>
              <Badge variant="teal" dot>
                {aiStatus?.is_demo_mode ? 'Demo Mode (Mock Engine)' : 'Assistive AI'}
              </Badge>
            </div>
            <CardDescription className="text-2xs text-slate-500 dark:text-slate-400">
              Deterministic rules decide final verdict • AI provides clinical explanation and context Q&A
            </CardDescription>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-2xs">
          <button
            onClick={() => setActiveTab('explainer')}
            className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'explainer'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSearch className="h-3 w-3" />
            Finding Explainer
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="h-3 w-3" />
            Ask LabelSense
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Tab 1: Finding Explainer */}
        {activeTab === 'explainer' && (
          <div className="space-y-4">
            {findings.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                <Check className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Zero Non-Conformances Detected
                </p>
                <p className="text-2xs text-slate-400 mt-1">
                  All GS1 Modulo-10 checksums, shelf-life dates, and mandatory symbols comply with Class III regulations.
                </p>
              </div>
            ) : (
              <div>
                {/* Finding Selector Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <span className="text-2xs font-mono uppercase tracking-wider text-slate-400">
                    Select Finding:
                  </span>
                  {findings.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFinding(f)}
                      className={`px-2.5 py-1 rounded text-2xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        selectedFinding?.id === f.id
                          ? 'bg-teal-600 text-white font-bold shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          f.severity === 'CRITICAL' ? 'bg-red-400' : 'bg-amber-400'
                        }`}
                      />
                      <span>{f.id}</span>
                    </button>
                  ))}
                </div>

                {/* Explanation Card */}
                {selectedFinding && (
                  <div className="mt-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300">
                          {selectedFinding.id}
                        </span>
                        <Badge variant={selectedFinding.severity === 'CRITICAL' ? 'critical' : 'review'}>
                          {selectedFinding.severity}
                        </Badge>
                        <span className="text-2xs font-mono text-slate-400">
                          Rule: {selectedFinding.rule_id}
                        </span>
                      </div>
                      {explanation && (
                        <span className="text-2xs font-mono text-emerald-600 dark:text-emerald-400">
                          AI Confidence: {(explanation.confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>

                    {isExplaining ? (
                      <div className="py-8 flex flex-col items-center justify-center text-xs text-slate-500 space-y-2">
                        <RefreshCw className="h-5 w-5 animate-spin text-teal-600" />
                        <span>Synthesizing plain-language clinical explanation...</span>
                      </div>
                    ) : explanation ? (
                      <div className="space-y-3 text-xs">
                        <div>
                          <h4 className="text-2xs font-mono font-bold uppercase tracking-wider text-slate-400">
                            Plain-Language Summary
                          </h4>
                          <p className="text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                            {explanation.plain_summary}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-red-50/40 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40">
                          <h4 className="text-2xs font-mono font-bold uppercase tracking-wider text-red-800 dark:text-red-300">
                            Clinical & Patient Safety Significance
                          </h4>
                          <p className="text-red-900/90 dark:text-red-200/90 mt-0.5 leading-relaxed">
                            {explanation.clinical_impact}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-teal-50/40 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40">
                          <h4 className="text-2xs font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                            Recommended Engineering Fix
                          </h4>
                          <p className="text-teal-900/90 dark:text-teal-200/90 mt-0.5 leading-relaxed">
                            {explanation.suggested_fix}
                          </p>
                        </div>

                        <div className="text-2xs font-mono text-slate-500">
                          Statutory Reference: <strong>{explanation.regulatory_reference}</strong>
                        </div>

                        {/* Human Reviewer Decision Actions (Accept / Edit / Reject) */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                          <div className="text-2xs font-mono text-slate-500">
                            Reviewer Action on AI Recommendation:
                          </div>
                          <div className="flex items-center gap-2">
                            {decisionRecorded ? (
                              <span className="text-2xs font-mono px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                Action Logged: {decisionRecorded}
                              </span>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDecision('REJECT')}
                                  className="text-xs text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDecision('EDIT')}
                                  className="text-xs text-amber-600 hover:text-amber-700"
                                >
                                  <Edit3 className="h-3 w-3 mr-1" />
                                  Edit Fix
                                </Button>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleDecision('ACCEPT')}
                                  className="text-xs"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Accept Fix
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs text-slate-400">
                        Unable to load AI explanation. Engine operating in deterministic rules mode.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Ask LabelSense (Report Context Chat) */}
        {activeTab === 'chat' && (
          <div className="space-y-3">
            {/* Quick Prompt Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-2xs">
              <span className="text-slate-400 font-mono">Suggested:</span>
              <button
                onClick={() =>
                  handleSendMessage('Why did the GS1 Modulo-10 checksum fail on this label?')
                }
                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-700 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
              >
                Why did Modulo-10 fail?
              </button>
              <button
                onClick={() =>
                  handleSendMessage('What ISO 15223-1 packaging symbols are mandatory for Class III?')
                }
                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-700 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
              >
                Mandatory Class III symbols
              </button>
              <button
                onClick={() =>
                  handleSendMessage('Summarize the clinical risks identified in this report.')
                }
                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-700 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
              >
                Clinical risk summary
              </button>
            </div>

            {/* Chat Transcript Box */}
            <div className="h-56 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 space-y-3 text-xs font-sans">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.citedFindings && msg.citedFindings.length > 0 && (
                      <div className="mt-1.5 pt-1 border-t border-slate-200 dark:border-slate-700/60 flex items-center gap-1 text-[10px] font-mono text-teal-700 dark:text-teal-300">
                        <span>Cites:</span>
                        {msg.citedFindings.map(id => (
                          <span
                            key={id}
                            className="px-1 rounded bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 font-bold"
                          >
                            {id}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isChatting && (
                <div className="flex items-center gap-2 text-2xs text-slate-400 font-mono">
                  <RefreshCw className="h-3 w-3 animate-spin text-teal-600" />
                  <span>Ask LabelSense is typing...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="Ask a question about this inspection report..."
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                disabled={isChatting}
                className="text-xs"
              />
              <Button type="submit" size="sm" disabled={isChatting || !userInput.trim()}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
