import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import {
  FileCheck2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowUpRight,
  UploadCloud,
  FileText,
  Search,
  Filter,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { DemoScenarioKey } from '../../types';

interface DashboardViewProps {
  onSelectScenario: (scenario: DemoScenarioKey) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenUpload: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectScenario,
  onNavigateToTab,
  onOpenUpload,
}) => {
  const stats = [
    {
      title: 'Total Verifications',
      value: '1,428',
      change: '+12% this month',
      icon: <FileCheck2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />,
      subtext: 'Deterministic pipelines',
    },
    {
      title: 'Automated Pass Rate',
      value: '94.2%',
      change: 'Confidence >= 0.95',
      icon: <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      subtext: '1,345 dossiers approved',
    },
    {
      title: 'Under Human Review',
      value: '58',
      change: 'Amber Tier Flags',
      icon: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      subtext: 'Bilingual/OCR drift',
    },
    {
      title: 'Critical Defects Blocked',
      value: '25',
      change: '0 escapes to release',
      icon: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
      subtext: 'Bad GTIN check digits',
    },
  ];

  const recentVerifications = [
    {
      id: 'DOS-2026-084',
      productName: 'CardiaVance™ Bipolar Pacing Lead',
      deviceClass: 'Class III Implantable',
      gtin: '00840123456786',
      verdict: 'PASS' as const,
      score: '0.98',
      date: 'Today, 14:22',
      scenarioKey: 'SCENARIO_A' as DemoScenarioKey,
      flags: '0 critical • 0 review',
    },
    {
      id: 'DOS-2026-083',
      productName: 'NeuroPulse™ Deep Brain Stimulator Lead',
      deviceClass: 'Class III Active Implantable',
      gtin: '00840123456789',
      verdict: 'FAIL' as const,
      score: '0.38',
      date: 'Today, 11:05',
      scenarioKey: 'SCENARIO_B' as DemoScenarioKey,
      flags: 'GTIN Check Digit Mismatch (Calc: 6, Found: 9)',
    },
    {
      id: 'DOS-2026-082',
      productName: 'EndoGrip™ Laparoscopic Trocar 12mm',
      deviceClass: 'Class IIa Surgical',
      gtin: '00764012345674',
      verdict: 'REVIEW' as const,
      score: '0.78',
      date: 'Yesterday, 16:40',
      scenarioKey: 'SCENARIO_C' as DemoScenarioKey,
      flags: 'Expiry discrepancy (7 months past shelf-life limit)',
    },
    {
      id: 'DOS-2026-081',
      productName: 'Vascuflex™ Nitinol Stent System 6x40mm',
      deviceClass: 'Class III Cardiovascular',
      gtin: '00840123456786',
      verdict: 'PASS' as const,
      score: '0.99',
      date: '16 Nov 2026',
      scenarioKey: 'SCENARIO_A' as DemoScenarioKey,
      flags: 'Full GS1 Modulo-10 verified',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Verification Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time status of automated labeling dossiers, Modulo-10 checks, and regulatory signoffs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigateToTab('compare')}>
            Compare Labels
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigateToTab('validate')}>
            <UploadCloud className="h-3.5 w-3.5 mr-1.5" />
            New Label Verification
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {s.title}
                </span>
                <div className="p-1 rounded bg-slate-100 dark:bg-slate-800">{s.icon}</div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                  {s.value}
                </span>
                <span className="text-2xs font-medium text-slate-500">{s.change}</span>
              </div>
              <p className="text-2xs text-slate-400 mt-1">{s.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Upload Banner & Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="py-3.5 px-4 flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm">Recent Packaging Verifications</CardTitle>
              <CardDescription className="text-2xs">
                Audited dossiers evaluated against GS1 General Specifications & ISO 15223-1
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigateToTab('validate')}>
              View All
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dossier / Product</TableHead>
                  <TableHead>GTIN-14</TableHead>
                  <TableHead>Deterministic Score</TableHead>
                  <TableHead>Verdict</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentVerifications.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div>
                        <span className="font-semibold text-xs text-slate-900 dark:text-white block">
                          {row.productName}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-2xs text-slate-400">{row.id}</span>
                          <span className="text-2xs text-slate-500">• {row.deviceClass}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="font-mono text-2xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                        {row.gtin}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-semibold tabular-nums">
                        {row.score}
                      </span>
                    </TableCell>
                    <TableCell>
                      {row.verdict === 'PASS' && (
                        <Badge variant="pass" dot>PASS</Badge>
                      )}
                      {row.verdict === 'REVIEW' && (
                        <Badge variant="review" dot>REVIEW</Badge>
                      )}
                      {row.verdict === 'FAIL' && (
                        <Badge variant="critical" dot>CRITICAL</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-2xs text-slate-500 font-mono">
                      {row.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onSelectScenario(row.scenarioKey);
                          onNavigateToTab('validate');
                        }}
                      >
                        Inspect
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Action Card: Quick Scenarios */}
        <Card className="flex flex-col">
          <CardHeader className="py-3.5 px-4 space-y-0">
            <CardTitle className="text-sm">Judge & Auditor Scenarios</CardTitle>
            <CardDescription className="text-2xs">
              Instant evaluation presets for Round 3 verification testing
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 space-y-3 flex-1">
            <div
              onClick={() => {
                onSelectScenario('SCENARIO_A');
                onNavigateToTab('validate');
              }}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-500/60 cursor-pointer transition-colors bg-white dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Scenario A: Perfect Compliant Baseline
                </span>
                <Badge variant="pass">PASS</Badge>
              </div>
              <p className="text-2xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Valid GTIN-14 (00840123456786, Check digit 6 matches sum 104), correct ISO 15223-1 symbols.
              </p>
            </div>

            <div
              onClick={() => {
                onSelectScenario('SCENARIO_B');
                onNavigateToTab('validate');
              }}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-red-500/60 dark:hover:border-red-500/60 cursor-pointer transition-colors bg-white dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Scenario B: Modulo-10 Checksum Failure
                </span>
                <Badge variant="critical">CRITICAL</Badge>
              </div>
              <p className="text-2xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Bad GTIN-14 (ends in 9 instead of calculated 6). Deterministically caught and quarantined.
              </p>
            </div>

            <div
              onClick={() => {
                onSelectScenario('SCENARIO_C');
                onNavigateToTab('validate');
              }}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-500/60 dark:hover:border-amber-500/60 cursor-pointer transition-colors bg-white dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Scenario C: Expiry Drift Flag
                </span>
                <Badge variant="review">REVIEW</Badge>
              </div>
              <p className="text-2xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                AI (17) date exceeds approved product master shelf-life. Flagged for human review.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
