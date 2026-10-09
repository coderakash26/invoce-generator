"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  Edit,
  Copy,
  Trash2,
  CreditCard,
  XCircle,
  FileText,
} from "lucide-react";
import { Invoice } from "@/lib/types/invoice";
import { useInvoices } from "@/lib/hooks/use-invoices";
import { useToast } from "@/components/shared/toast";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import { RecordPaymentModal } from "./record-payment-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice-calculations";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateDisplay } from "@/lib/utils/dates";

interface InvoiceTableProps {
  invoices: Invoice[];
  limit?: number; // for recent invoices view
  showFilters?: boolean;
}

export function InvoiceTable({ invoices, limit, showFilters = true }: InvoiceTableProps) {
  const router = useRouter();
  const { deleteInvoice, duplicateInvoice, recordPayment, saveInvoice } = useInvoices();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "number">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Dialog states
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  // Filter & sort
  const filteredInvoices = useMemo(() => {
    let list = [...invoices];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.clientSnapshot?.name?.toLowerCase().includes(q) ||
          inv.clientSnapshot?.companyName?.toLowerCase().includes(q) ||
          inv.title?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((inv) => {
        const totals = calculateInvoiceTotals(inv);
        return totals.effectiveStatus === statusFilter;
      });
    }

    list.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = a.issueDate || "";
        const dateB = b.issueDate || "";
        return sortOrder === "asc" ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
      }
      if (sortBy === "amount") {
        const totalA = calculateInvoiceTotals(a).grandTotal;
        const totalB = calculateInvoiceTotals(b).grandTotal;
        return sortOrder === "asc" ? totalA - totalB : totalB - totalA;
      }
      if (sortBy === "number") {
        return sortOrder === "asc"
          ? a.invoiceNumber.localeCompare(b.invoiceNumber)
          : b.invoiceNumber.localeCompare(a.invoiceNumber);
      }
      return 0;
    });

    if (limit) {
      return list.slice(0, limit);
    }
    return list;
  }, [invoices, search, statusFilter, sortBy, sortOrder, limit]);

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateInvoice(id);
    if (duplicated) {
      toast.success("Invoice Duplicated", `Created draft ${duplicated.invoiceNumber}`);
      router.push(`/invoices/${duplicated.id}/edit`);
    }
  };

  const handleDelete = () => {
    if (!invoiceToDelete) return;
    deleteInvoice(invoiceToDelete.id);
    toast.success("Invoice Deleted", `Invoice #${invoiceToDelete.invoiceNumber} was removed.`);
    setInvoiceToDelete(null);
  };

  const handleCancelStatus = (inv: Invoice) => {
    saveInvoice({
      ...inv,
      status: "cancelled",
    });
    toast.info("Invoice Cancelled", `Marked #${inv.invoiceNumber} as cancelled.`);
  };

  return (
    <div className="space-y-4">
      {/* Filters & Search Toolbar */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invoice # or client name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Status filters */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg shrink-0">
              {["all", "draft", "sent", "paid", "partially_paid", "overdue"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    statusFilter === status
                      ? "bg-white text-zinc-900 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {status === "all"
                    ? "All"
                    : status === "partially_paid"
                    ? "Partial"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split("-") as ["date" | "amount" | "number", "asc" | "desc"];
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="text-xs border border-zinc-200 rounded-lg px-2.5 py-1.5 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="number-asc">Invoice # (Asc)</option>
            </select>
          </div>
        </div>
      )}

      {/* Invoices Data Grid */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        {filteredInvoices.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={invoices.length === 0 ? "No invoices created yet" : "No matching invoices found"}
            description={
              invoices.length === 0
                ? "Start billing clients by creating your very first professional invoice."
                : "Try adjusting your search terms or filters to find what you are looking for."
            }
            actionLabel={invoices.length === 0 ? "Create First Invoice" : "Clear Filters"}
            onAction={
              invoices.length === 0
                ? () => router.push("/invoices/new")
                : () => {
                    setSearch("");
                    setStatusFilter("all");
                  }
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-3 px-4">Invoice</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredInvoices.map((invoice) => {
                  const totals = calculateInvoiceTotals(invoice);

                  return (
                    <tr
                      key={invoice.id}
                      className="hover:bg-zinc-50/80 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/invoices/${invoice.id}`)}
                    >
                      <td className="py-3 px-4 font-medium text-zinc-900 whitespace-nowrap">
                        <Link
                          href={`/invoices/${invoice.id}`}
                          className="font-mono font-semibold text-indigo-600 hover:text-indigo-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {invoice.invoiceNumber}
                        </Link>
                        {invoice.title && (
                          <p className="text-[11px] text-zinc-400 truncate max-w-[180px] font-normal">
                            {invoice.title}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4 text-zinc-700 whitespace-nowrap">
                        <p className="font-semibold text-zinc-900">
                          {invoice.clientSnapshot?.companyName || invoice.clientSnapshot?.name || "—"}
                        </p>
                        {invoice.clientSnapshot?.companyName && invoice.clientSnapshot?.name && (
                          <p className="text-[11px] text-zinc-400 font-normal">
                            {invoice.clientSnapshot.name}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4 text-zinc-500 whitespace-nowrap font-mono">
                        {formatDateDisplay(invoice.issueDate)}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        <span
                          className={
                            totals.effectiveStatus === "overdue"
                              ? "text-rose-600 font-semibold"
                              : "text-zinc-500"
                          }
                        >
                          {formatDateDisplay(invoice.dueDate)}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-medium text-zinc-900 whitespace-nowrap tabular-nums">
                        {formatCurrency(totals.grandTotal, invoice.currency)}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap tabular-nums">
                        <span
                          className={`font-semibold ${
                            totals.balanceDue > 0
                              ? totals.effectiveStatus === "overdue"
                                ? "text-rose-600"
                                : "text-zinc-900"
                              : "text-emerald-600"
                          }`}
                        >
                          {formatCurrency(totals.balanceDue, invoice.currency)}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <InvoiceStatusBadge status={totals.effectiveStatus} />
                      </td>

                      <td
                        className="py-3 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/invoices/${invoice.id}`}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors"
                            title="View Invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/invoices/${invoice.id}/edit`}
                            className="p-1.5 text-zinc-400 hover:text-indigo-600 rounded-md hover:bg-zinc-100 transition-colors"
                            title="Edit Invoice"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          {totals.balanceDue > 0 && invoice.status !== "cancelled" && (
                            <button
                              type="button"
                              onClick={() => setSelectedInvoiceForPayment(invoice)}
                              className="p-1.5 text-zinc-400 hover:text-emerald-600 rounded-md hover:bg-zinc-100 transition-colors"
                              title="Record Payment"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDuplicate(invoice.id)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors"
                            title="Duplicate Invoice"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {invoice.status !== "cancelled" && invoice.status !== "paid" && (
                            <button
                              type="button"
                              onClick={() => handleCancelStatus(invoice)}
                              className="p-1.5 text-zinc-400 hover:text-amber-600 rounded-md hover:bg-zinc-100 transition-colors"
                              title="Cancel Invoice"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setInvoiceToDelete(invoice)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-md hover:bg-zinc-100 transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {selectedInvoiceForPayment && (
        <RecordPaymentModal
          isOpen={true}
          invoice={selectedInvoiceForPayment}
          onClose={() => setSelectedInvoiceForPayment(null)}
          onSubmit={(paymentData) => {
            recordPayment(selectedInvoiceForPayment.id, paymentData);
            toast.success(
              "Payment Recorded",
              `Added payment of ${formatCurrency(
                paymentData.amount,
                selectedInvoiceForPayment.currency
              )}`
            );
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!invoiceToDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice #${invoiceToDelete?.invoiceNumber}? This action cannot be undone.`}
        confirmLabel="Delete Invoice"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setInvoiceToDelete(null)}
      />
    </div>
  );
}
