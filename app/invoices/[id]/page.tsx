"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Download,
  Printer,
  Copy,
  CreditCard,
  Share2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { RecordPaymentModal } from "@/components/invoices/record-payment-modal";
import { useInvoices } from "@/lib/hooks/use-invoices";
import { useToast } from "@/components/shared/toast";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice-calculations";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateDisplay } from "@/lib/utils/dates";
import { generateInvoicePDF } from "@/lib/pdf/generate-invoice-pdf";

function InvoiceDetailsContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { getInvoice, recordPayment, duplicateInvoice } = useInvoices();
  const toast = useToast();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const invoice = getInvoice(id);

  if (!invoice) {
    return (
      <AppLayout>
        <div className="text-center py-20 space-y-4">
          <AlertCircle className="w-10 h-10 text-zinc-400 mx-auto" />
          <h2 className="text-lg font-bold text-zinc-900">Invoice not found</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            The requested invoice could not be located or may have been deleted.
          </p>
          <Link
            href="/invoices"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Invoices</span>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const totals = calculateInvoiceTotals(invoice);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const res = await generateInvoicePDF("invoice-print-target", invoice);
      if (res.success) {
        toast.success("PDF Downloaded", `Saved #${invoice.invoiceNumber}.pdf`);
      } else {
        toast.error("Download Failed", res.error);
      }
    } catch {
      toast.error("An error occurred while generating PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDuplicate = () => {
    const dup = duplicateInvoice(invoice.id);
    if (dup) {
      toast.success("Invoice Duplicated", `Created ${dup.invoiceNumber}`);
      router.push(`/invoices/${dup.id}/edit`);
    }
  };

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link Copied", "Direct link to this invoice copied to clipboard.");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <Link
              href="/invoices"
              className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
              title="Back to Invoices"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-zinc-900 font-mono">
                  #{invoice.invoiceNumber}
                </h1>
                <InvoiceStatusBadge status={totals.effectiveStatus} />
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Billed to {invoice.clientSnapshot?.companyName || invoice.clientSnapshot?.name || "Client"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {totals.balanceDue > 0 && invoice.status !== "cancelled" && (
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Record Payment</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <Link
              href={`/invoices/${invoice.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-xs"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>

            <button
              type="button"
              onClick={handleDuplicate}
              className="p-2 text-zinc-400 hover:text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-xs"
              title="Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleShareLink}
              className="p-2 text-zinc-400 hover:text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-xs"
              title="Copy Link"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Invoice Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
            <span className="text-[11px] font-medium text-zinc-500 block mb-1">Total Amount</span>
            <p className="text-lg font-bold text-zinc-900 tabular-nums">
              {formatCurrency(totals.grandTotal, invoice.currency)}
            </p>
          </div>

          <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
            <span className="text-[11px] font-medium text-zinc-500 block mb-1">Amount Paid</span>
            <p className="text-lg font-bold text-emerald-600 tabular-nums">
              {formatCurrency(totals.amountPaid, invoice.currency)}
            </p>
          </div>

          <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
            <span className="text-[11px] font-medium text-zinc-500 block mb-1">Balance Due</span>
            <p
              className={`text-lg font-bold tabular-nums ${
                totals.balanceDue > 0
                  ? totals.effectiveStatus === "overdue"
                    ? "text-rose-600"
                    : "text-zinc-900"
                  : "text-emerald-600"
              }`}
            >
              {formatCurrency(totals.balanceDue, invoice.currency)}
            </p>
          </div>

          <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs">
            <span className="text-[11px] font-medium text-zinc-500 block mb-1">Due Date</span>
            <p
              className={`text-lg font-bold font-mono text-xs pt-1 ${
                totals.effectiveStatus === "overdue" ? "text-rose-600" : "text-zinc-900"
              }`}
            >
              {formatDateDisplay(invoice.dueDate)}
            </p>
          </div>
        </div>

        {/* Payment History if exists */}
        {invoice.payments && invoice.payments.length > 0 && (
          <div className="p-5 bg-white border border-zinc-200 rounded-xl space-y-3 shadow-xs">
            <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Payment Transactions
            </h3>
            <div className="divide-y divide-zinc-100 text-xs">
              {invoice.payments.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-zinc-900">
                        {formatCurrency(p.amount, invoice.currency)}
                        <span className="font-normal text-zinc-500 ml-2">
                          via {p.method.replace("_", " ")}
                        </span>
                      </p>
                      {p.reference && (
                        <p className="text-[11px] text-zinc-400 font-mono">Ref: {p.reference}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-zinc-500 font-mono">{formatDateDisplay(p.date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live A4 Document Container */}
        <div className="bg-zinc-100/70 p-6 sm:p-10 border border-zinc-200/80 rounded-2xl flex justify-center shadow-inner">
          <InvoicePreview invoice={invoice} scale={1} />
        </div>
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        invoice={invoice}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={(paymentData) => {
          recordPayment(invoice.id, paymentData);
          toast.success(
            "Payment Added",
            `Received ${formatCurrency(paymentData.amount, invoice.currency)}.`
          );
        }}
      />
    </AppLayout>
  );
}

export default function InvoiceDetailsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">Loading invoice details...</div>}>
      <InvoiceDetailsContent />
    </Suspense>
  );
}
