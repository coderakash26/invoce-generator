"use client";

import React, { useMemo } from "react";
import { Invoice } from "@/lib/types/invoice";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice-calculations";
import { ClassicTemplate } from "./templates/classic-template";
import { ModernTemplate } from "./templates/modern-template";
import { MinimalTemplate } from "./templates/minimal-template";
import { BoldTemplate } from "./templates/bold-template";

interface InvoicePreviewProps {
  invoice: Invoice;
  scale?: number; // for zoom scaling
  className?: string;
  id?: string;
}

export function InvoicePreview({
  invoice,
  scale = 1,
  className = "",
  id = "invoice-print-target",
}: InvoicePreviewProps) {
  const totals = useMemo(() => calculateInvoiceTotals(invoice), [invoice]);
  const templateId = invoice.branding?.templateId || "modern";

  const renderTemplate = () => {
    switch (templateId) {
      case "classic":
        return <ClassicTemplate invoice={invoice} totals={totals} />;
      case "minimal":
        return <MinimalTemplate invoice={invoice} totals={totals} />;
      case "bold":
        return <BoldTemplate invoice={invoice} totals={totals} />;
      case "modern":
      default:
        return <ModernTemplate invoice={invoice} totals={totals} />;
    }
  };

  return (
    <div className={`overflow-x-auto flex justify-center py-4 ${className}`}>
      <div
        id={id}
        style={{
          width: "794px", // Standard A4 at 96 DPI
          minHeight: "1123px",
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top center",
        }}
        className="bg-white shadow-xl border border-zinc-200/80 rounded-sm overflow-hidden text-zinc-900 print:shadow-none print:border-none print:m-0"
      >
        {renderTemplate()}
      </div>
    </div>
  );
}
