"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { useInvoices } from "@/lib/hooks/use-invoices";

export default function InvoicesPage() {
  const { invoices } = useInvoices();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Invoices</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Create, organize, and track all your client invoices and payments.
            </p>
          </div>

          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </Link>
        </div>

        <InvoiceTable invoices={invoices} showFilters={true} />
      </div>
    </AppLayout>
  );
}
