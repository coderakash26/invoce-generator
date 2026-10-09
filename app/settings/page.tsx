"use client";

import React, { useState } from "react";
import {
  Save,
  Building,
  CreditCard,
  Settings as SettingsIcon,
  Download,
  Upload,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useBusinessProfile } from "@/lib/hooks/use-business-profile";
import { useToast } from "@/components/shared/toast";
import { CurrencyCode } from "@/lib/types/invoice";
import { CURRENCIES } from "@/lib/utils/currency";
import {
  exportAllData,
  importData,
  resetToDemoData,
  clearAllData,
} from "@/lib/storage/local-storage";

export default function SettingsPage() {
  const { profile, saveProfile } = useBusinessProfile();
  const toast = useToast();

  const [form, setForm] = useState(profile);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [showImportBox, setShowImportBox] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(form);
    toast.success("Settings Saved", "Your business profile and preferences were updated.");
  };

  const handleExportJSON = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoiceflow_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup Downloaded", "All invoices, clients, and settings exported to JSON.");
  };

  const handleImportJSON = () => {
    if (!importText.trim()) return;
    const res = importData(importText);
    if (res.success) {
      toast.success("Import Completed", res.message);
      setShowImportBox(false);
      setImportText("");
      setTimeout(() => window.location.reload(), 500);
    } else {
      toast.error("Import Failed", res.message);
    }
  };

  const handleResetDemo = () => {
    resetToDemoData();
    toast.success("Reset Complete", "Restored standard demo data.");
    setResetConfirmOpen(false);
    setTimeout(() => window.location.reload(), 500);
  };

  const handleClearAll = () => {
    clearAllData();
    toast.info("Data Cleared", "All local application data removed.");
    setClearConfirmOpen(false);
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Business Settings</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure your company identity, payment details, numbering preferences, and manage backups.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Business Identity */}
          <div className="p-6 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Building className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-semibold text-zinc-900">Business Profile</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Business Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Billing Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Website URL</label>
                <input
                  type="text"
                  value={form.website || ""}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Tax ID / VAT Registration</label>
              <input
                type="text"
                value={form.taxId || ""}
                onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Address */}
            <div className="space-y-3 pt-2 border-t border-zinc-100">
              <span className="block text-xs font-semibold text-zinc-900">Physical Address</span>
              <input
                type="text"
                value={form.address.street}
                onChange={(e) =>
                  setForm({ ...form, address: { ...form.address, street: e.target.value } })
                }
                placeholder="Street Address, Suite"
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={form.address.city}
                  onChange={(e) =>
                    setForm({ ...form, address: { ...form.address, city: e.target.value } })
                  }
                  placeholder="City"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={form.address.state}
                  onChange={(e) =>
                    setForm({ ...form, address: { ...form.address, state: e.target.value } })
                  }
                  placeholder="State"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={form.address.postalCode}
                  onChange={(e) =>
                    setForm({ ...form, address: { ...form.address, postalCode: e.target.value } })
                  }
                  placeholder="Postal Code"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <input
                type="text"
                value={form.address.country}
                onChange={(e) =>
                  setForm({ ...form, address: { ...form.address, country: e.target.value } })
                }
                placeholder="Country"
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Payment & Bank Remittance */}
          <div className="p-6 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-zinc-900">Wire & Bank Remittance Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={form.bankDetails.bankName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankDetails: { ...form.bankDetails, bankName: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={form.bankDetails.accountHolder}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankDetails: { ...form.bankDetails, accountHolder: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Account Number / IBAN</label>
                <input
                  type="text"
                  value={form.bankDetails.accountNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankDetails: { ...form.bankDetails, accountNumber: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Routing / Sort Code / SWIFT</label>
                <input
                  type="text"
                  value={form.bankDetails.routingNumber || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankDetails: { ...form.bankDetails, routingNumber: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Payment Instructions</label>
              <textarea
                rows={2}
                value={form.bankDetails.paymentInstructions || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bankDetails: { ...form.bankDetails, paymentInstructions: e.target.value },
                  })
                }
                placeholder="e.g. Please include invoice number in your wire memo. Net 14 days."
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Invoicing Defaults */}
          <div className="p-6 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <SettingsIcon className="w-4 h-4 text-zinc-700" />
              <h2 className="text-sm font-semibold text-zinc-900">Invoicing Defaults</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Default Currency</label>
                <select
                  value={form.defaultCurrency}
                  onChange={(e) =>
                    setForm({ ...form, defaultCurrency: e.target.value as CurrencyCode })
                  }
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Invoice Prefix</label>
                <input
                  type="text"
                  value={form.invoicePrefix}
                  onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Next Number</label>
                <input
                  type="number"
                  min="1"
                  value={form.nextNumber}
                  onChange={(e) => setForm({ ...form, nextNumber: parseInt(e.target.value, 10) || 1 })}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Default Payment Terms</label>
                <select
                  value={form.defaultPaymentTerms}
                  onChange={(e) =>
                    setForm({ ...form, defaultPaymentTerms: parseInt(e.target.value, 10) || 14 })
                  }
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value={0}>Due upon receipt</option>
                  <option value={7}>Net 7 days</option>
                  <option value={14}>Net 14 days</option>
                  <option value={30}>Net 30 days</option>
                  <option value={60}>Net 60 days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Default Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.defaultTaxRate}
                  onChange={(e) =>
                    setForm({ ...form, defaultTaxRate: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Default Notes</label>
              <textarea
                rows={2}
                value={form.defaultNotes}
                onChange={(e) => setForm({ ...form, defaultNotes: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Default Terms</label>
              <textarea
                rows={2}
                value={form.defaultTerms}
                onChange={(e) => setForm({ ...form, defaultTerms: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Business Settings</span>
            </button>
          </div>
        </form>

        {/* Data Persistence, Backups & Reset */}
        <div className="p-6 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
          <h2 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-3">
            Data Persistence & Local Backups
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            InvoiceFlow stores all invoices, clients, and settings locally in your browser. You can export a full JSON backup to transfer data or archive historical records.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export All Data (JSON)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowImportBox(!showImportBox)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>Import JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Reset to Demo Data</span>
            </button>

            <button
              type="button"
              onClick={() => setClearConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Data</span>
            </button>
          </div>

          {/* Import JSON Textbox */}
          {showImportBox && (
            <div className="mt-4 p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3">
              <span className="block text-xs font-semibold text-zinc-800">
                Paste JSON Backup Content Below
              </span>
              <textarea
                rows={4}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='Paste raw JSON backup here, e.g. {"version": 1, "invoices": [...] }'
                className="w-full p-2.5 text-xs font-mono border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImportBox(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportJSON}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Apply & Import
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={resetConfirmOpen}
        title="Reset to Demo Data"
        message="This will replace current local storage with standard sample invoices and clients. Make sure to export a backup if you have changes you wish to preserve."
        confirmLabel="Reset Data"
        onConfirm={handleResetDemo}
        onCancel={() => setResetConfirmOpen(false)}
      />

      {/* Confirm Clear Dialog */}
      <ConfirmDialog
        isOpen={clearConfirmOpen}
        title="Clear All Local Data"
        message="This will completely erase all stored invoices and clients in this browser profile. Are you sure?"
        confirmLabel="Clear Everything"
        isDestructive={true}
        onConfirm={handleClearAll}
        onCancel={() => setClearConfirmOpen(false)}
      />
    </AppLayout>
  );
}
