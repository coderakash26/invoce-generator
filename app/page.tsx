"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Palette,
  Calculator,
  Download,
  Users,
  Clock,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { LandingNavbar } from "@/components/layout/landing-navbar";
import { LandingFooter } from "@/components/layout/landing-footer";

const FAQS = [
  {
    q: "Can I download real, print-ready PDF invoices?",
    a: "Yes. InvoiceFlow exports high-resolution, vector-accurate A4 PDFs with your chosen layout, company branding, line items, and bank remittance details.",
  },
  {
    q: "How are taxes, discounts, and shipping calculated?",
    a: "All financial totals use decimal-safe arithmetic. Line-level discounts and taxes are computed before invoice-level adjustments, ensuring zero rounding anomalies or double-counting.",
  },
  {
    q: "Where is my invoice data stored?",
    a: "In this standalone version, all data is persisted in your browser's local storage. Your invoices, clients, and settings remain available across browser sessions on your device.",
  },
  {
    q: "Can I back up or transfer my data to another device?",
    a: "Yes. You can export a complete JSON snapshot of all your invoices and clients at any time in the Settings menu, and import it into any browser with validation.",
  },
  {
    q: "Which currencies are supported?",
    a: "InvoiceFlow supports major international currencies including USD ($), EUR (€), GBP (£), BDT (৳), CAD (CA$), AUD (A$), JPY (¥), INR (₹), and SGD (S$).",
  },
  {
    q: "Can I track partial payments from clients?",
    a: "Yes. You can record payments with dates, payment methods, and transaction references. The balance due updates automatically, marking invoices as Partially Paid or Paid.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col font-sans text-zinc-900">
      <LandingNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.12]">
              Professional Invoices. <br />
              <span className="text-indigo-600">Less Admin. More Business.</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              Create beautiful invoices, manage clients, track payments, and download professional PDFs in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/invoices/new"
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Create an Invoice</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/templates"
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl transition-colors shadow-xs"
              >
                Explore Templates
              </Link>
            </div>
          </div>

          {/* REAL INTERACTIVE COMPONENT MOCKUP */}
          <div className="mt-14 max-w-4xl mx-auto bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  IF
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">Apex Studio Ltd.</p>
                  <p className="text-[11px] text-zinc-400">Invoice #INV-2026-0001</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Paid
                </span>
                <p className="text-[11px] text-zinc-400 mt-1">Due Feb 15, 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 text-xs">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider block mb-1">
                  Billed To
                </span>
                <p className="font-bold text-zinc-900 text-sm">Acme Corporation</p>
                <p className="text-zinc-500 mt-0.5">100 Industrial Parkway, Austin, TX</p>
                <p className="text-zinc-500">finance@acmecorp.com</p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider block mb-1">
                  Amount Summary
                </span>
                <p className="text-2xl font-bold text-indigo-600 tabular-nums">$10,147.50</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Design System & Brand Assets</p>
              </div>
            </div>

            <div className="border border-zinc-100 rounded-xl overflow-hidden text-xs">
              <div className="bg-zinc-50/80 px-4 py-2.5 font-semibold text-zinc-500 flex justify-between text-[11px] uppercase tracking-wider">
                <span>Deliverable</span>
                <span>Total</span>
              </div>
              <div className="p-4 divide-y divide-zinc-100">
                <div className="py-2 flex justify-between">
                  <div>
                    <p className="font-semibold text-zinc-900">Design System Architecture & Tokens</p>
                    <p className="text-[11px] text-zinc-500">40 hrs @ $150.00/hr + 10% tax</p>
                  </div>
                  <span className="font-bold text-zinc-900 tabular-nums">$6,600.00</span>
                </div>
                <div className="py-2 flex justify-between">
                  <div>
                    <p className="font-semibold text-zinc-900">Brand Identity Guidelines & Vector Book</p>
                    <p className="text-[11px] text-zinc-500">1 package @ $3,500.00 (5% disc)</p>
                  </div>
                  <span className="font-bold text-zinc-900 tabular-nums">$3,547.50</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs pt-4 border-t border-zinc-100">
              <span className="text-zinc-500">Bank Wire Settled via First Republic</span>
              <div className="flex gap-2">
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-lg transition-colors"
                >
                  View in Dashboard
                </Link>
                <Link
                  href="/invoices/new"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-xs"
                >
                  Create Your Own
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section id="features" className="py-20 bg-white border-y border-zinc-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Built For Professionals
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                Everything you need to bill clients accurately
              </h2>
              <p className="text-sm text-zinc-500">
                Designed to eliminate billing friction so you can focus on delivering great client work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Create invoices in minutes",
                  desc: "Intuitive split-screen editor updates a live document preview in real time with each keystroke.",
                  icon: FileText,
                },
                {
                  title: "Professional invoice templates",
                  desc: "Choose between Modern, Classic, Minimal, and Bold templates tailored for your business domain.",
                  icon: Palette,
                },
                {
                  title: "Automatic calculations",
                  desc: "Decimal-safe rounding for line-level discounts, multiple tax rates, shipping, and withholding tax.",
                  icon: Calculator,
                },
                {
                  title: "Download printable PDFs",
                  desc: "Generate clean A4 portrait PDFs ready to email directly to your clients or print via browser.",
                  icon: Download,
                },
                {
                  title: "Manage client directory",
                  desc: "Save clients once and auto-populate billing addresses, contact info, and tax IDs effortlessly.",
                  icon: Users,
                },
                {
                  title: "Track invoice payment status",
                  desc: "Record partial or full payments with dates and methods. Automatic overdue and balance calculations.",
                  icon: Clock,
                },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.title}
                    className="p-6 bg-zinc-50 border border-zinc-200/70 rounded-xl space-y-3 hover:border-zinc-300 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-indigo-600 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-semibold text-zinc-900">{b.title}</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">{b.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">How InvoiceFlow Works</h2>
            <p className="text-sm text-zinc-500">
              From blank page to professional invoice in under three minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Add your business and client details",
                desc: "Enter your company name, logo, contact information, and select or add the recipient client.",
              },
              {
                step: "02",
                title: "Add line items and configure pricing",
                desc: "List your deliverables, units, hourly rates or package fees, and apply line discounts or tax rates.",
              },
              {
                step: "03",
                title: "Preview, save, and download your invoice",
                desc: "Review your live A4 document, select your favorite layout template, and download your crisp PDF.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-8 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs"
              >
                <span className="text-3xl font-black font-mono text-indigo-600">{s.step}</span>
                <h3 className="text-base font-bold text-zinc-900">{s.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TEMPLATE GALLERY PREVIEW */}
        <section id="templates" className="py-20 bg-white border-y border-zinc-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Design Aesthetics
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                Four Distinct Invoice Templates
              </h2>
              <p className="text-sm text-zinc-500">
                Each style crafted with tailored typography and hierarchy to match your brand.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: "modern", name: "Modern", desc: "Top accent band & total card" },
                { id: "classic", name: "Classic", desc: "Formal serif table formatting" },
                { id: "minimal", name: "Minimal", desc: "Monochrome Swiss design" },
                { id: "bold", name: "Bold", desc: "High-contrast dark header" },
              ].map((t) => (
                <div
                  key={t.id}
                  className="p-6 bg-zinc-50 border border-zinc-200 rounded-xl space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">{t.name} Template</h3>
                    <p className="text-xs text-zinc-500 mt-1">{t.desc}</p>
                  </div>
                  <Link
                    href={`/invoices/new?template=${t.id}`}
                    className="w-full py-2 px-3 text-xs font-semibold text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                  >
                    Use {t.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <span>View Full Template Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* TRUST & PRODUCTIVITY */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 bg-indigo-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Frictionless Billing
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
                Organized client records. Zero spreadsheet headaches.
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                Freelancers and independent studios lose hours each month wrestling with disjointed spreadsheets and manual calculations. InvoiceFlow keeps client records, past deliverables, and payment receipts in one cohesive local workspace.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="px-6 py-3.5 text-xs font-bold text-indigo-900 bg-white hover:bg-indigo-50 rounded-xl transition-colors shrink-0 shadow-md"
            >
              Open Your Dashboard
            </Link>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section id="faq" className="py-20 bg-white border-t border-zinc-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-zinc-500">
                Answers to common inquiries about InvoiceFlow.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="border border-zinc-200 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-zinc-900 bg-white hover:bg-zinc-50"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-400 transition-transform ${
                          isOpen ? "rotate-180 text-indigo-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-zinc-600 leading-relaxed bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
