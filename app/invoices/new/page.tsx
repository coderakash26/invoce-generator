"use client";

import React, { Suspense } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { InvoiceForm } from "@/components/invoices/invoice-form";

export default function NewInvoicePage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">Loading invoice editor...</div>}>
        <InvoiceForm isEditMode={false} />
      </Suspense>
    </AppLayout>
  );
}
