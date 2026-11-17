import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import {
  ShieldCheck,
  CheckCircle2,
  FileSearch,
  Hash,
  GitCompare,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Layers,
  Lock,
  Cpu,
  Moon,
  Sun,
  AlertTriangle,
  FileCheck2,
  FileSpreadsheet,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LandingPageProps {
  onLaunchApp: (initialTab?: 'dashboard' | 'validate' | 'compare' | 'audit') => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onOpenLogin }) => {
  const { theme, toggleTheme } = useTheme();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is LabelSense officially certified by the US FDA or EU Notified Bodies?',
      a: 'No. LabelSense is an assistive software tool engineered to support Regulatory Affairs and QA teams in automating tedious cross-checks. It is not an autonomous medical device, nor does it hold independent regulatory clearance. Designated human responsible persons must review and sign off on all production releases.',
    },
    {
      q: 'How does LabelSense prevent LLM hallucinations during GTIN verification?',
      a: 'GS1 identification keys (GTIN-8, GTIN-12, GTIN-13, GTIN-14) are evaluated using a deterministic GS1 Modulo-10 mathematical engine. Check digit verification, AI prefix boundaries (01, 17, 10, 21), and ISO 8601 expiry dates are processed via algorithmic rules rather than probabilistic generative models.',
    },
    {
      q: 'What occurs when OCR extraction confidence is marginal or unreadable?',
      a: 'LabelSense utilizes Confidence-Tier Routing: extractions with confidence >= 95% route to automated Green pass, between 70% and 94% trigger an Amber human-in-the-loop review flag, and values below 70% or with invalid checksums trigger a Red critical block.',
    },
    {
      q: 'How are audit records and electronic signatures protected from alteration?',
      a: 'Audit entries are chained sequentially using FIPS 180-4 SHA-256 digests. Each record hashes its internal payload combined with the preceding block’s SHA-256 digest, providing an immutable, tamper-evident cryptographic trail for post-market inspection.',
    },
    {
      q: 'Can LabelSense operate on-premise without exposing sensitive artwork to public clouds?',
      a: 'Yes. The core validation pipeline, Tesseract OCR, PyMuPDF engine, and deterministic rules run completely air-gapped on local or private cloud infrastructure without sending proprietary artwork to external third-party endpoints.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Clinical Nav */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <span className="tracking-tighter">LS</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-white">
                LabelSense
              </span>
              <span className="text-2xs font-mono text-slate-400 dark:text-slate-500">
                v1.2-assistive
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Verification Engine
            </a>
            <a href="#standards" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Standards & GS1
            </a>
            <a href="#preview" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Product Preview
            </a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Compliance FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button variant="outline" size="sm" onClick={onOpenLogin}>
              Switch Role
            </Button>
            <Button variant="primary" size="sm" onClick={() => onLaunchApp('validate')}>
              Launch Workspace
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800/80 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-medium mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>Assistive Verification Engine for Regulated Medical Device Packaging</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-[1.15]">
            Deterministic label verification for clinical and UDI compliance.
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate human oversight errors across GS1 Modulo-10 barcodes, ISO 15223-1 symbols,
            and bilingual packaging. Built to support QA teams with mathematical precision
            and tamper-evident audit trails.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onLaunchApp('validate')}
              className="w-full sm:w-auto"
            >
              Launch Interactive Demo
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onLaunchApp('dashboard')}
              className="w-full sm:w-auto"
            >
              View Verification Dashboard
            </Button>
          </div>

          {/* Clinical Assurance Strip */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-2xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              GS1 Modulo-10 Checksum Engine
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              ISO 15223-1 Symbol Taxonomy
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              FIPS 180-4 SHA-256 Audit Chain
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              EU MDR & FDA 21 CFR 801 Ready
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Mockup / Product Preview */}
      <section id="preview" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Inspection Interface: Precision at a Glance
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              High-density regulatory inspection workspace with OCR overlay, deterministic checksums,
              and synchronized evidence links.
            </p>
          </div>

          {/* Interactive Inspection Frame */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            {/* Top Frame Bar */}
            <div className="h-10 px-4 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="ml-2 font-mono text-2xs text-slate-500 dark:text-slate-400">
                  dossier://CARDIA-LEAD-2026-REV3.pdf
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="pass" dot>PASS: 0.98 SCORE</Badge>
                <span className="text-2xs text-slate-400 font-mono">100% Deterministic</span>
              </div>
            </div>

            {/* Split Inspection View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
              {/* Left: Label Visual Redline Canvas */}
              <div className="lg:col-span-7 p-6 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Primary Sterile Barrier Label
                    </span>
                    <span className="text-2xs font-mono text-slate-400">Dim: 120mm x 75mm</span>
                  </div>

                  {/* Rendered Label Sample */}
                  <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-5 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                    <div className="flex items-start justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          CardiaVance™ Bipolar Pacing Lead
                        </h4>
                        <p className="text-2xs text-slate-500">Sterile Active Implantable Lead • 58cm</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          REF 8401-LEAD
                        </span>
                        <p className="text-2xs text-slate-400 font-mono">LOT 2026L482</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-2 rounded bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                        <span className="text-2xs font-sans text-emerald-800 dark:text-emerald-300 font-medium block">
                          UDI GTIN-14 (Deterministic Check)
                        </span>
                        <span className="font-bold text-emerald-900 dark:text-emerald-200">
                          (01) 00840123456786
                        </span>
                        <span className="text-2xs text-emerald-600 dark:text-emerald-400 block mt-0.5">
                          ✓ Modulo-10 Check Digit: 6 (Valid)
                        </span>
                      </div>

                      <div className="p-2 rounded bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                        <span className="text-2xs font-sans text-emerald-800 dark:text-emerald-300 font-medium block">
                          Expiry Date (17)
                        </span>
                        <span className="font-bold text-emerald-900 dark:text-emerald-200">
                          281130 (2028-11-30)
                        </span>
                        <span className="text-2xs text-emerald-600 dark:text-emerald-400 block mt-0.5">
                          ✓ Unexpired • ISO 8601 Valid
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-2xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                      <span>Manufacturer: MedTech Innovations Europe Ltd.</span>
                      <div className="flex items-center gap-2">
                        <span className="border border-slate-300 dark:border-slate-700 px-1 py-0.5 rounded font-mono">
                          STERILE EO
                        </span>
                        <span className="border border-slate-300 dark:border-slate-700 px-1 py-0.5 rounded font-mono">
                          CE 0123
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-2xs text-slate-400">
                  <span>SHA-256: d4f9...83a1</span>
                  <span>Extracted via Tesseract + PyMuPDF</span>
                </div>
              </div>

              {/* Right: Validation Rule Findings */}
              <div className="lg:col-span-5 p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Automated Findings & Evidence
                  </h4>

                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-md border border-emerald-200/90 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                          GS1 Modulo-10 Checksum
                        </span>
                        <Badge variant="pass">PASSED</Badge>
                      </div>
                      <p className="text-2xs text-slate-600 dark:text-slate-400 mt-1">
                        GTIN-14 <code className="font-mono">00840123456786</code> verified. Sum 104; Check digit 6 matches payload.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-md border border-emerald-200/90 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                          ISO 8601 Expiry Sequencing
                        </span>
                        <Badge variant="pass">PASSED</Badge>
                      </div>
                      <p className="text-2xs text-slate-600 dark:text-slate-400 mt-1">
                        AI (17) date <code className="font-mono">2028-11-30</code> is 742 days in future. No expired shelf-life risk.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-md border border-emerald-200/90 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                          Mandatory ISO 15223-1 Symbols
                        </span>
                        <Badge variant="pass">4 / 4 PRESENT</Badge>
                      </div>
                      <p className="text-2xs text-slate-600 dark:text-slate-400 mt-1">
                        Manufacturer, Sterilization method, Do not re-use, and CE mark verified.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => onLaunchApp('validate')}
                  >
                    Open Live Validation Workspace
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section id="how-it-works" className="py-16 sm:py-24 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              Four stages of deterministic verification
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Replacing error-prone manual spreadsheets with automated, cryptographically chained checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="h-full flex flex-col">
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="h-8 w-8 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-xs mb-4">
                  01
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Document Ingestion
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  Upload PDF vector artwork or high-resolution PNG/JPG scans. Generates an immediate
                  SHA-256 fingerprint for document integrity.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-2xs font-mono text-slate-400">
                  PyMuPDF • Tesseract OCR
                </div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="h-8 w-8 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-xs mb-4">
                  02
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  OCR & Field Extraction
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  Extracts GTIN, Lot Numbers, Expiry Dates, Manufacturer addresses, and ISO 15223-1 symbols
                  with per-token confidence metrics.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-2xs font-mono text-slate-400">
                  Token Confidence Routing
                </div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="h-8 w-8 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-xs mb-4">
                  03
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Deterministic Validation
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  Executes GS1 Modulo-10 checksum validation, AI delimiter checks, expiry math,
                  and multilingual translation memory matching.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-2xs font-mono text-slate-400">
                  GS1 General Specs v23.0
                </div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="h-8 w-8 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-xs mb-4">
                  04
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Audit Release & Log
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  Generates an immutable FIPS 180-4 SHA-256 chained audit record and structured
                  dossier PDF with electronic signatures.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-2xs font-mono text-slate-400">
                  FIPS 180-4 Hash Chaining
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Standards & Compliance Disclaimer Section */}
      <section id="standards" className="py-14 bg-slate-100/60 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start gap-4">
            <div className="h-8 w-8 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Regulatory Positioning & Assistive Disclaimer
              </h4>
              <p className="text-2xs sm:text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                LabelSense is designed to assist manufacturers in complying with EU MDR (2017/745) Article 7,
                FDA 21 CFR Part 801 UDI rules, and ISO 15223-1 standards. <strong>LabelSense is not a certified medical device and does not perform autonomous regulatory approvals.</strong> Final release authority remains strictly with the manufacturer’s qualified regulatory personnel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Honest Compliance FAQ */}
      <section id="faq" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Transparency First
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Frequently Asked Technical Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clinical Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
              LS
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              LabelSense AI • CodeQuest 2026 Round 3 Reference Implementation
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono text-2xs">FIPS 180-4 SHA-256 Chained</span>
            <a
              href="https://github.com/gsai9582/LabelSense"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
            >
              GitHub Repository
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
