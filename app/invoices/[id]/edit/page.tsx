"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { useInvoices } from "@/lib/hooks/use-invoices";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

function EditInvoiceContent() {
  const params = useParams();
  const id = params?.id as string;
  const { getInvoice } = useInvoices();

  const invoice = getInvoice(id);

  if (!invoice) {
    return (
      <AppLayout>
        <div className="text-center py-20 space-y-4">
          <AlertCircle className="w-10 h-10 text-zinc-400 mx-auto" />
          <h2 className="text-lg font-bold text-zinc-900">Invoice not found</h2>
          <p className="text-xs text-zinc-500">
            Cannot edit an invoice that does not exist in local storage.
          </p>
          <Link
            href="/invoices"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
          >
            Back to Invoices
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <InvoiceForm initialInvoice={invoice} isEditMode={true} />
    </AppLayout>
  );
}

export default function EditInvoicePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">Loading invoice editor...</div>}>
      <EditInvoiceContent />
    </Suspense>
  );
}
