"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  FilePlus,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { ClientFormModal } from "@/components/clients/client-form-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useClients } from "@/lib/hooks/use-clients";
import { useInvoices } from "@/lib/hooks/use-invoices";
import { useToast } from "@/components/shared/toast";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice-calculations";
import { formatCurrency } from "@/lib/utils/currency";

function ClientDetailsContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { getClient, saveClient, deleteClient } = useClients();
  const { invoices } = useInvoices();
  const toast = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const client = getClient(id);

  // Filter invoices for this client
  const clientInvoices = useMemo(() => {
    return invoices.filter((inv) => inv.clientId === id);
  }, [invoices, id]);

  const stats = useMemo(() => {
    let totalInvoiced = 0;
    let totalPaid = 0;
    let balanceDue = 0;

    clientInvoices.forEach((inv) => {
      if (inv.status === "cancelled") return;
      const totals = calculateInvoiceTotals(inv);
      if (inv.status !== "draft") {
        totalInvoiced += totals.grandTotal;
        totalPaid += totals.amountPaid;
        balanceDue += totals.balanceDue;
      }
    });

    return { totalInvoiced, totalPaid, balanceDue };
  }, [clientInvoices]);

  if (!client) {
    return (
      <AppLayout>
        <div className="text-center py-20 space-y-4">
          <AlertCircle className="w-10 h-10 text-zinc-400 mx-auto" />
          <h2 className="text-lg font-bold text-zinc-900">Client not found</h2>
          <Link
            href="/clients"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
          >
            Back to Clients
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleDelete = () => {
    deleteClient(client.id);
    toast.success("Client Deleted", `${client.name} was removed.`);
    router.push("/clients");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <Link
              href="/clients"
              className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">
                {client.companyName || client.name}
              </h1>
              {client.companyName && (
                <p className="text-xs text-zinc-500 font-normal">Contact: {client.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/invoices/new?client=${client.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Create Invoice</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 shadow-xs"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="p-2 text-zinc-400 hover:text-rose-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 shadow-xs"
              title="Delete Client"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Client Summary & Contact Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white border border-zinc-200 rounded-xl space-y-3 shadow-xs">
            <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Contact & Billing
            </h3>
            <div className="space-y-2 text-xs text-zinc-600">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-900 font-medium">{client.email}</span>
              </p>
              {client.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{client.phone}</span>
                </p>
              )}
              {client.taxId && (
                <p className="text-[11px] text-zinc-400 font-mono">Tax/VAT: {client.taxId}</p>
              )}
              <div className="pt-2 border-t border-zinc-100 flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <p>
                  {client.billingAddress?.street}
                  <br />
                  {[
                    client.billingAddress?.city,
                    client.billingAddress?.state,
                    client.billingAddress?.postalCode,
                    client.billingAddress?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs">
              <span className="text-[11px] font-medium text-zinc-500 block mb-1">
                Total Invoiced
              </span>
              <p className="text-xl font-bold text-zinc-900 tabular-nums">
                {formatCurrency(stats.totalInvoiced)}
              </p>
              <p className="text-[10px] text-zinc-400 mt-1">{clientInvoices.length} invoices issued</p>
            </div>

            <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs">
              <span className="text-[11px] font-medium text-zinc-500 block mb-1">Total Paid</span>
              <p className="text-xl font-bold text-emerald-600 tabular-nums">
                {formatCurrency(stats.totalPaid)}
              </p>
              <p className="text-[10px] text-zinc-400 mt-1">Cleared revenue</p>
            </div>

            <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs">
              <span className="text-[11px] font-medium text-zinc-500 block mb-1">
                Outstanding Balance
              </span>
              <p
                className={`text-xl font-bold tabular-nums ${
                  stats.balanceDue > 0 ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {formatCurrency(stats.balanceDue)}
              </p>
              <p className="text-[10px] text-zinc-400 mt-1">Pending payments</p>
            </div>
          </div>
        </div>

        {/* Invoice History for this Client */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900">Invoice History</h2>
            <Link
              href={`/invoices/new?client=${client.id}`}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              + Create New Invoice
            </Link>
          </div>

          <InvoiceTable invoices={clientInvoices} showFilters={false} />
        </div>
      </div>

      <ClientFormModal
        isOpen={isEditModalOpen}
        client={client}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data) => {
          saveClient(data);
          toast.success("Client Updated", `${data.name} details saved.`);
        }}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Client"
        message={`Are you sure you want to remove ${client.name}? All historical invoices will preserve a snapshot of their data.`}
        confirmLabel="Delete Client"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </AppLayout>
  );
}

export default function ClientDetailsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">Loading client profile...</div>}>
      <ClientDetailsContent />
    </Suspense>
  );
}
