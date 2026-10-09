"use client";

import React, { useState } from "react";
import { Check, Save } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { useToast } from "@/components/shared/toast";
import { InvoiceTemplateId } from "@/lib/types/invoice";

const PALETTES = [
  { name: "Indigo Modern", hex: "#5B5FEF" },
  { name: "Cobalt Blue", hex: "#2563EB" },
  { name: "Emerald Growth", hex: "#10B981" },
  { name: "Slate Charcoal", hex: "#0F172A" },
  { name: "Deep Violet", hex: "#7C3AED" },
  { name: "Amber Warmth", hex: "#D97706" },
  { name: "Rose Accent", hex: "#E11D48" },
];

export default function AppearancePage() {
  const toast = useToast();

  const [defaultTemplate, setDefaultTemplate] = useState<InvoiceTemplateId>("modern");
  const [accentColor, setAccentColor] = useState("#5B5FEF");
  const [fontFamily, setFontFamily] = useState<"sans" | "serif" | "mono">("sans");
  const [showLogo, setShowLogo] = useState(true);
  const [showBankDetails, setShowBankDetails] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Appearance Preferences Saved", "New invoices will adopt these visual defaults.");
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Appearance & Branding
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Personalize your invoice aesthetics, primary brand accent color, and typography defaults.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Template Choice */}
          <div className="p-6 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
            <h2 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
              Default Invoice Template
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "modern", name: "Modern Geometric", desc: "Top accent bar & total card" },
                { id: "classic", name: "Classic Corporate", desc: "Traditional serif format" },
                { id: "minimal", name: "Minimal Swiss", desc: "Clean hairline borders" },
                { id: "bold", name: "Bold Studio", desc: "High contrast dark header" },
              ].map((t) => (
                <div
                  key={t.id}
                  onClick={() => setDefaultTemplate(t.id as InvoiceTemplateId)}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-all ${
                    defaultTemplate === t.id
                      ? "border-indigo-600 bg-indigo-50/50 shadow-xs"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}
                >
                  <p className="text-xs font-semibold text-zinc-900">{t.name}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Accent Color Palette */}
          <div className="p-6 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
            <h2 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
              Brand Accent Color
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              {PALETTES.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setAccentColor(c.hex)}
                  className="flex items-center gap-2 p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <span
                    className="w-4 h-4 rounded-full shadow-xs flex items-center justify-center text-white"
                    style={{ backgroundColor: c.hex }}
                  >
                    {accentColor === c.hex && <Check className="w-2.5 h-2.5" />}
                  </span>
                  <span className="text-xs text-zinc-700">{c.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-zinc-500">Custom hex:</span>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-8 h-8 rounded border border-zinc-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-24 px-2 py-1 text-xs font-mono border border-zinc-200 rounded-lg"
              />
            </div>
          </div>

          {/* Typography & Display Options */}
          <div className="p-6 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
            <h2 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
              Display & Document Options
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "sans", name: "Sans-Serif", sample: "Clean modern sans font" },
                { id: "serif", name: "Editorial Serif", sample: "Traditional formal serif" },
                { id: "mono", name: "Monospace", sample: "Technical tabular font" },
              ].map((f) => (
                <div
                  key={f.id}
                  onClick={() => setFontFamily(f.id as "sans" | "serif" | "mono")}
                  className={`p-3 border rounded-xl cursor-pointer transition-all ${
                    fontFamily === f.id
                      ? "border-indigo-600 bg-indigo-50/40"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <p className="text-xs font-semibold text-zinc-900">{f.name}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">{f.sample}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-3 border-t border-zinc-100">
              <label className="flex items-center gap-3 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span>Include Business Logo in Invoice Header</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBankDetails}
                  onChange={(e) => setShowBankDetails(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span>Display Wire & Bank Remittance Instructions on default PDFs</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Appearance Defaults</span>
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
