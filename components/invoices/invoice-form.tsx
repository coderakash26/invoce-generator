"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  Download,
  Printer,
  Eye,
  Edit3,
  UserPlus,
  Palette,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  Invoice,
  InvoiceItem,
  CurrencyCode,
  InvoiceTemplateId,
  InvoiceStatus,
} from "@/lib/types/invoice";
import { useInvoices } from "@/lib/hooks/use-invoices";
import { useClients } from "@/lib/hooks/use-clients";
import { useBusinessProfile } from "@/lib/hooks/use-business-profile";
import { useToast } from "@/components/shared/toast";
import { InvoicePreview } from "./invoice-preview";
import { InvoiceItemsEditor } from "./invoice-items-editor";
import { ClientFormModal } from "@/components/clients/client-form-modal";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice-calculations";
import { formatCurrency, CURRENCIES } from "@/lib/utils/currency";
import { getTodayDateString, addDaysToDate } from "@/lib/utils/dates";
import { formatInvoiceNumber } from "@/lib/utils/invoice-number";
import { generateInvoicePDF } from "@/lib/pdf/generate-invoice-pdf";
import { generateId } from "@/lib/utils/ids";

interface InvoiceFormProps {
  initialInvoice?: Invoice;
  isEditMode?: boolean;
}

export function InvoiceForm({ initialInvoice, isEditMode = false }: InvoiceFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateQuery = searchParams.get("template") as InvoiceTemplateId | null;
  const clientQuery = searchParams.get("client");

  const { saveInvoice, invoices } = useInvoices();
  const { clients, saveClient } = useClients();
  const { profile } = useBusinessProfile();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoiceNumber ||
      formatInvoiceNumber(profile.invoicePrefix || "INV", profile.nextNumber || 1)
  );
  const [title, setTitle] = useState(initialInvoice?.title || "");
  const [poNumber, setPoNumber] = useState(initialInvoice?.poNumber || "");
  const [referenceNumber, setReferenceNumber] = useState(initialInvoice?.referenceNumber || "");
  const [issueDate, setIssueDate] = useState(initialInvoice?.issueDate || getTodayDateString());
  const [paymentTerms, setPaymentTerms] = useState(profile.defaultPaymentTerms || 14);
  const [dueDate, setDueDate] = useState(
    initialInvoice?.dueDate || addDaysToDate(getTodayDateString(), profile.defaultPaymentTerms || 14)
  );
  const [currency, setCurrency] = useState<CurrencyCode>(
    initialInvoice?.currency || profile.defaultCurrency || "USD"
  );
  const [selectedClientId, setSelectedClientId] = useState<string>(
    initialInvoice?.clientId || clientQuery || ""
  );

  // Client snapshot
  const [clientSnapshot, setClientSnapshot] = useState(
    initialInvoice?.clientSnapshot || {
      name: "",
      companyName: "",
      email: "",
      phone: "",
      billingAddress: { street: "", city: "", state: "", postalCode: "", country: "United States" },
      taxId: "",
    }
  );

  // Items
  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.items || [
      {
        id: generateId(),
        name: "",
        description: "",
        quantity: 1,
        unit: "hrs",
        unitPrice: 0,
        discountRate: 0,
        taxRate: profile.defaultTaxRate || 0,
      },
    ]
  );

  // Charges
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    initialInvoice?.discountType || "percentage"
  );
  const [invoiceDiscountRate, setInvoiceDiscountRate] = useState(
    initialInvoice?.invoiceDiscountRate || 0
  );
  const [invoiceDiscountAmount, setInvoiceDiscountAmount] = useState(
    initialInvoice?.invoiceDiscountAmount || 0
  );
  const [shipping, setShipping] = useState(initialInvoice?.shipping || 0);
  const [additionalCharges, setAdditionalCharges] = useState(initialInvoice?.additionalCharges || 0);
  const [withholdingTaxRate, setWithholdingTaxRate] = useState(
    initialInvoice?.withholdingTaxRate || 0
  );

  // Notes & terms
  const [notes, setNotes] = useState(initialInvoice?.notes ?? (profile.defaultNotes || ""));
  const [terms, setTerms] = useState(initialInvoice?.terms ?? (profile.defaultTerms || ""));

  // Branding
  const [templateId, setTemplateId] = useState<InvoiceTemplateId>(
    initialInvoice?.branding?.templateId || templateQuery || "modern"
  );
  const [accentColor, setAccentColor] = useState(
    initialInvoice?.branding?.accentColor || "#5B5FEF"
  );
  const [fontFamily, setFontFamily] = useState<"sans" | "serif" | "mono">(
    initialInvoice?.branding?.fontFamily || "sans"
  );
  const [showBankDetails, setShowBankDetails] = useState(
    initialInvoice?.branding?.showBankDetails ?? true
  );

  // Client selection handler
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    if (clientId) {
      const found = clients.find((c) => c.id === clientId);
      if (found) {
        setClientSnapshot({
          name: found.name,
          companyName: found.companyName || "",
          email: found.email,
          phone: found.phone || "",
          billingAddress: found.billingAddress || {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          },
          taxId: found.taxId || "",
        });
      }
    }
  };

  // Update due date when issue date or terms change
  const handleTermsChange = (days: number) => {
    setPaymentTerms(days);
    setDueDate(addDaysToDate(issueDate, days));
  };

  const handleIssueDateChange = (date: string) => {
    setIssueDate(date);
    setDueDate(addDaysToDate(date, paymentTerms));
  };

  // Compile active invoice object for live preview
  const currentInvoice: Invoice = useMemo(
    () => ({
      id: initialInvoice?.id || "temp_preview_id",
      invoiceNumber: invoiceNumber || "INV-DRAFT",
      title: title || undefined,
      poNumber: poNumber || undefined,
      referenceNumber: referenceNumber || undefined,
      clientId: selectedClientId || undefined,
      clientSnapshot,
      businessSnapshot: {
        name: profile.name,
        logoUrl: profile.logoUrl,
        email: profile.email,
        phone: profile.phone,
        website: profile.website,
        address: profile.address,
        taxId: profile.taxId,
        bankDetails: profile.bankDetails,
      },
      issueDate,
      dueDate,
      currency,
      status: initialInvoice?.status || "draft",
      items,
      invoiceDiscountRate,
      invoiceDiscountAmount,
      discountType,
      shipping,
      additionalCharges,
      withholdingTaxRate,
      notes,
      terms,
      payments: initialInvoice?.payments || [],
      branding: {
        templateId,
        accentColor,
        fontFamily,
        showLogo: true,
        showBankDetails,
        footerText: `${profile.name} · Generated with InvoiceFlow`,
      },
      createdAt: initialInvoice?.createdAt || (typeof window === "undefined" ? "2026-03-31T00:00:00.000Z" : new Date().toISOString()),
      updatedAt: typeof window === "undefined" ? "2026-03-31T00:00:00.000Z" : new Date().toISOString(),
    }),
    [
      initialInvoice,
      invoiceNumber,
      title,
      poNumber,
      referenceNumber,
      selectedClientId,
      clientSnapshot,
      profile,
      issueDate,
      dueDate,
      currency,
      items,
      invoiceDiscountRate,
      invoiceDiscountAmount,
      discountType,
      shipping,
      additionalCharges,
      withholdingTaxRate,
      notes,
      terms,
      templateId,
      accentColor,
      fontFamily,
      showBankDetails,
    ]
  );

  const totals = useMemo(() => calculateInvoiceTotals(currentInvoice), [currentInvoice]);

  const handleSave = async (status: InvoiceStatus = "sent") => {
    if (!invoiceNumber.trim()) {
      toast.error("Invoice number is required.");
      return;
    }
    if (items.length === 0 || !items.some((i) => i.name.trim())) {
      toast.error("At least one line item with a name is required.");
      return;
    }

    // Check duplicate invoice number
    const duplicate = invoices.find(
      (inv) => inv.invoiceNumber === invoiceNumber && inv.id !== initialInvoice?.id
    );
    if (duplicate) {
      toast.error("Invoice number already exists. Please choose a unique number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = saveInvoice({
        ...currentInvoice,
        id: initialInvoice?.id,
        status,
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });

      toast.success(
        status === "draft" ? "Draft Saved" : "Invoice Created",
        `Invoice #${saved.invoiceNumber} has been successfully saved.`
      );

      router.push(`/invoices/${saved.id}`);
    } catch (err: unknown) {
      toast.error("Failed to save invoice", err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const res = await generateInvoicePDF("invoice-print-target", currentInvoice);
      if (res.success) {
        toast.success("PDF Downloaded", "Your invoice PDF was generated successfully.");
      } else {
        toast.error("PDF Generation Failed", res.error);
      }
    } catch {
      toast.error("An error occurred while generating PDF.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sticky Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">
            {isEditMode ? `Edit Invoice #${invoiceNumber}` : "Create New Invoice"}
          </h1>
          <p className="text-xs text-zinc-500">
            Customize line items, taxes, branding, and preview your live document
          </p>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex sm:hidden items-center p-1 bg-zinc-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === "edit"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === "preview"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" /> Live Preview
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span> PDF
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-xs hidden sm:inline-flex"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={isSubmitting}
            className="px-3.5 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave("sent")}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Issue</span>
          </button>
        </div>
      </div>

      {/* Split Screen Layout (Editor Left, Live Preview Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: FORM */}
        <div
          className={`space-y-6 lg:col-span-6 xl:col-span-6 ${
            activeTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Section 1: Invoice Details */}
          <div className="p-5 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
              Invoice Information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Invoice Number *
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Currency *</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol}) - {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Invoice Title / Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q1 Web Design Services"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Purchase Order (PO #)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PO-88910"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Reference No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. REF-2026"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => handleIssueDateChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Payment Terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => handleTermsChange(parseInt(e.target.value, 10))}
                  className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value={0}>Due upon receipt</option>
                  <option value={7}>Net 7 days</option>
                  <option value={14}>Net 14 days</option>
                  <option value={30}>Net 30 days</option>
                  <option value={60}>Net 60 days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Client Selector & Snapshot */}
          <div className="p-5 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h3 className="text-sm font-semibold text-zinc-900">Client Details</h3>
              <button
                type="button"
                onClick={() => setIsClientModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ New Client</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Select Saved Client
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">-- Choose an existing client or enter below --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName ? `${c.companyName} (${c.name})` : c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Client Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={clientSnapshot.name}
                  onChange={(e) =>
                    setClientSnapshot((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={clientSnapshot.companyName || ""}
                  onChange={(e) =>
                    setClientSnapshot((prev) => ({ ...prev, companyName: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="billing@client.com"
                  value={clientSnapshot.email}
                  onChange={(e) =>
                    setClientSnapshot((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Billing Street</label>
                <input
                  type="text"
                  placeholder="123 Market St, Suite 40"
                  value={clientSnapshot.billingAddress.street}
                  onChange={(e) =>
                    setClientSnapshot((prev) => ({
                      ...prev,
                      billingAddress: { ...prev.billingAddress, street: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Line Items Editor */}
          <InvoiceItemsEditor items={items} currency={currency} onChange={setItems} />

          {/* Section 4: Additional Charges & Calculations */}
          <div className="p-5 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
              Discounts, Shipping & Taxes
            </h3>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Invoice Discount
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={
                      discountType === "percentage" ? invoiceDiscountRate : invoiceDiscountAmount
                    }
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (discountType === "percentage") {
                        setInvoiceDiscountRate(val);
                      } else {
                        setInvoiceDiscountAmount(val);
                      }
                    }}
                    className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDiscountType((prev) => (prev === "percentage" ? "fixed" : "percentage"))
                    }
                    className="px-2 py-1 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 rounded-lg"
                  >
                    {discountType === "percentage" ? "%" : "$"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Shipping</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={shipping}
                  onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Additional Fees
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Withholding Tax %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={withholdingTaxRate}
                  onChange={(e) => setWithholdingTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-zinc-900 tabular-nums">
                  {formatCurrency(totals.subtotal, currency)}
                </span>
              </div>
              {totals.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Total Discount:</span>
                  <span className="font-semibold tabular-nums">
                    -{formatCurrency(totals.totalDiscount, currency)}
                  </span>
                </div>
              )}
              {totals.taxTotal > 0 && (
                <div className="flex justify-between">
                  <span>Sales Tax Total:</span>
                  <span className="font-semibold text-zinc-900 tabular-nums">
                    {formatCurrency(totals.taxTotal, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-zinc-200 font-bold text-sm text-zinc-900">
                <span>Total Amount:</span>
                <span className="tabular-nums" style={{ color: accentColor }}>
                  {formatCurrency(totals.grandTotal, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Notes & Terms */}
          <div className="p-5 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
              Notes & Terms
            </h3>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Client Note (appears on invoice)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Terms & Conditions
              </label>
              <textarea
                rows={2}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section 6: Template & Branding Styling */}
          <div className="p-5 bg-white border border-zinc-200 rounded-xl space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-600" />
              <span>Branding & Appearance</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-2">Invoice Template</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "modern", name: "Modern" },
                  { id: "classic", name: "Classic" },
                  { id: "minimal", name: "Minimal" },
                  { id: "bold", name: "Bold" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplateId(t.id as InvoiceTemplateId)}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                      templateId === t.id
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs"
                        : "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Accent Color</label>
                <div className="flex items-center gap-2">
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
                    className="w-24 px-2 py-1 text-xs font-mono border border-zinc-200 rounded-lg text-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Font Family</label>
                <div className="flex gap-1.5">
                  {(["sans", "serif", "mono"] as const).map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() => setFontFamily(font)}
                      className={`flex-1 py-1 text-xs font-medium rounded-lg border text-center capitalize transition-colors ${
                        fontFamily === font
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={showBankDetails}
                    onChange={(e) => setShowBankDetails(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span>Show Bank Details on Invoice</span>
                </label>
              </div>
            </div>
          </div>

        {/* RIGHT COLUMN: LIVE PREVIEW */}
        <div
          className={`lg:col-span-6 xl:col-span-6 sticky top-6 ${
            activeTab === "edit" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="bg-zinc-100/80 border border-zinc-200/80 rounded-2xl p-4 shadow-inner">
            <div className="flex items-center justify-between pb-3 px-1 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>Live Document Preview</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400">A4 · {templateId.toUpperCase()}</span>
            </div>

            <div className="max-h-[820px] overflow-y-auto rounded-xl shadow-xs">
              <InvoicePreview invoice={currentInvoice} scale={0.72} />
            </div>
          </div>
        </div>
      </div>

      {/* New Client Modal */}
      <ClientFormModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={(newClient) => {
          const created = saveClient(newClient);
          setSelectedClientId(created.id);
          toast.success("Client Saved", `${created.name} added to your directory.`);
        }}
      />
    </div>
  );
}
