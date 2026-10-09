"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, ArrowRight, Check, Palette } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { InvoiceTemplateId, Invoice } from "@/lib/types/invoice";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { INITIAL_INVOICES } from "@/lib/storage/demo-data";

interface TemplateMeta {
  id: InvoiceTemplateId;
  name: string;
  category: string;
  description: string;
  features: string[];
  accentColor: string;
}

const TEMPLATES: TemplateMeta[] = [
  {
    id: "modern",
    name: "Modern Geometric",
    category: "Tech & Agency",
    description: "Sleek geometric typography with top accent band and prominent total card.",
    features: ["Accent top stripe", "3-column metadata card", "Card-based total summary"],
    accentColor: "#5B5FEF",
  },
  {
    id: "classic",
    name: "Classic Corporate",
    category: "Legal & Consulting",
    description: "Traditional formal typography with structured dual-column address headers.",
    features: ["Formal serif styling", "Bordered table grids", "Structured bank remittance block"],
    accentColor: "#1E293B",
  },
  {
    id: "minimal",
    name: "Minimal Swiss",
    category: "Architecture & Design",
    description: "Ultra-clean monochrome layout emphasizing typography and financial figures.",
    features: ["Swiss grid system", "Hairline dividers", "Monospace tabular alignment"],
    accentColor: "#0F172A",
  },
  {
    id: "bold",
    name: "Bold Studio",
    category: "Creative & Production",
    description: "Striking high-contrast header banner and punchy primary total callout.",
    features: ["Full-width dark header", "Accent badge callout", "High-contrast visual hierarchy"],
    accentColor: "#2563EB",
  },
];

export function TemplatesPage() {
  const [selectedPreview, setSelectedPreview] = useState<InvoiceTemplateId | null>(null);

  // Sample invoice for previewing templates
  const sampleInvoice: Invoice = {
    ...INITIAL_INVOICES[0],
    branding: {
      templateId: selectedPreview || "modern",
      accentColor: TEMPLATES.find((t) => t.id === selectedPreview)?.accentColor || "#5B5FEF",
      fontFamily: "sans",
      showLogo: true,
      showBankDetails: true,
    },
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Invoice Templates Gallery
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Choose from four distinct, professional layout styles for your client invoices.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 block mb-0.5">
                      {tmpl.category}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900">{tmpl.name}</h3>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full border border-zinc-200 shadow-xs"
                    style={{ backgroundColor: tmpl.accentColor }}
                  />
                </div>

                <p className="text-xs text-zinc-600">{tmpl.description}</p>

                {/* Miniature Visual Layout Mockup */}
                <div
                  onClick={() => setSelectedPreview(tmpl.id)}
                  className="h-44 bg-zinc-50 border border-zinc-200/80 rounded-lg p-3 overflow-hidden cursor-pointer relative group flex flex-col justify-between"
                >
                  {/* Decorative Mini Layout Representation */}
                  {tmpl.id === "modern" && (
                    <div className="space-y-2 pointer-events-none">
                      <div className="h-1.5 w-full bg-indigo-600 rounded" />
                      <div className="flex justify-between items-center pt-2">
                        <div className="w-16 h-3 bg-zinc-300 rounded" />
                        <div className="w-10 h-3 bg-zinc-200 rounded" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-2">
                        <div className="h-10 bg-zinc-100 rounded" />
                        <div className="h-10 bg-zinc-100 rounded" />
                        <div className="h-10 bg-indigo-50 border border-indigo-100 rounded" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-zinc-200 rounded w-full" />
                        <div className="h-2 bg-zinc-100 rounded w-5/6" />
                      </div>
                    </div>
                  )}

                  {tmpl.id === "classic" && (
                    <div className="space-y-2 font-serif pointer-events-none">
                      <div className="flex justify-between border-b pb-2 border-zinc-400">
                        <div className="w-16 h-4 bg-zinc-800 rounded-xs" />
                        <div className="w-12 h-3 bg-zinc-300 rounded-xs" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 py-1">
                        <div className="h-8 bg-zinc-50 border border-zinc-200 rounded-xs" />
                        <div className="h-8 bg-zinc-50 border border-zinc-200 rounded-xs" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-zinc-300 rounded-xs w-full" />
                        <div className="h-2 bg-zinc-200 rounded-xs w-4/5" />
                      </div>
                    </div>
                  )}

                  {tmpl.id === "minimal" && (
                    <div className="space-y-2 font-mono pointer-events-none">
                      <div className="grid grid-cols-2 gap-2 border-b border-zinc-200 pb-2">
                        <div className="w-20 h-3 bg-zinc-400 rounded-xs" />
                        <div className="w-10 h-2 bg-zinc-200 rounded-xs ml-auto" />
                      </div>
                      <div className="grid grid-cols-4 gap-1 py-1">
                        <div className="h-4 bg-zinc-100 rounded-xs col-span-2" />
                        <div className="h-4 bg-zinc-100 rounded-xs" />
                        <div className="h-4 bg-zinc-100 rounded-xs" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-zinc-300 rounded-xs w-full" />
                        <div className="h-1.5 bg-zinc-200 rounded-xs w-3/4" />
                      </div>
                    </div>
                  )}

                  {tmpl.id === "bold" && (
                    <div className="space-y-2 pointer-events-none">
                      <div className="h-10 bg-zinc-900 rounded-t p-2 flex justify-between items-center">
                        <div className="w-14 h-3 bg-blue-500 rounded-xs" />
                        <div className="w-10 h-2 bg-zinc-400 rounded-xs" />
                      </div>
                      <div className="p-2 space-y-2">
                        <div className="h-6 bg-zinc-50 border-l-2 border-blue-600 rounded-r-xs" />
                        <div className="h-2 bg-zinc-200 rounded-xs w-full" />
                        <div className="h-4 bg-zinc-900 rounded-xs w-28 ml-auto" />
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs">
                    <span className="px-3 py-1.5 text-xs font-semibold bg-white text-zinc-900 rounded-lg shadow-sm flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Full Layout</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  {tmpl.features.map((feat) => (
                    <p key={feat} className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPreview(tmpl.id)}
                  className="flex-1 py-2 px-3 text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors text-center"
                >
                  Live Preview
                </button>
                <Link
                  href={`/invoices/new?template=${tmpl.id}`}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-center shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 px-6 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-zinc-900">
                  {TEMPLATES.find((t) => t.id === selectedPreview)?.name} Preview
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/invoices/new?template=${selectedPreview}`}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg shadow-xs"
                >
                  Use This Template
                </Link>
                <button
                  onClick={() => setSelectedPreview(null)}
                  className="text-xs text-zinc-500 hover:text-zinc-800 p-1 font-medium"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-zinc-100 flex justify-center">
              <InvoicePreview invoice={sampleInvoice} scale={0.8} />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default TemplatesPage;
