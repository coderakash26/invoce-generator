"use client";

import React, { useMemo } from "react";
import { Invoice, CurrencyCode } from "@/lib/types/invoice";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice-calculations";
import { formatCurrency } from "@/lib/utils/currency";
import {
  CircleDollarSign,
  CheckCircle2,
  Clock3,
  AlertCircle,
  FileText,
} from "lucide-react";

interface SummaryCardsProps {
  invoices: Invoice[];
  currency?: CurrencyCode;
}

export function SummaryCards({ invoices, currency = "USD" }: SummaryCardsProps) {
  const metrics = useMemo(() => {
    let totalInvoiced = 0;
    let paidAmount = 0;
    let outstandingAmount = 0;
    let overdueAmount = 0;
    let totalIssuedCount = 0;

    invoices.forEach((inv) => {
      const totals = calculateInvoiceTotals(inv);

      // Don't count cancelled invoices or draft invoices in issued totals
      if (inv.status === "cancelled") return;

      if (inv.status !== "draft") {
        totalInvoiced += totals.grandTotal;
        paidAmount += totals.amountPaid;
        outstandingAmount += totals.balanceDue;
        totalIssuedCount += 1;

        if (totals.effectiveStatus === "overdue") {
          overdueAmount += totals.balanceDue;
        }
      }
    });

    return {
      totalInvoiced,
      paidAmount,
      outstandingAmount,
      overdueAmount,
      totalInvoices: invoices.length,
      totalIssuedCount,
    };
  }, [invoices]);

  const curr = currency as CurrencyCode;

  const cards = [
    {
      title: "Total Invoiced",
      amount: formatCurrency(metrics.totalInvoiced, curr),
      subtext: `${metrics.totalIssuedCount} issued invoices`,
      icon: CircleDollarSign,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Paid Amount",
      amount: formatCurrency(metrics.paidAmount, curr),
      subtext: "Collected revenue",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Outstanding",
      amount: formatCurrency(metrics.outstandingAmount, curr),
      subtext: "Awaiting payment",
      icon: Clock3,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Overdue",
      amount: formatCurrency(metrics.overdueAmount, curr),
      subtext: "Action required",
      icon: AlertCircle,
      color: "text-rose-600 bg-rose-50",
    },
    {
      title: "Total Invoices",
      amount: String(metrics.totalInvoices),
      subtext: `${invoices.filter((i) => i.status === "draft").length} in draft`,
      icon: FileText,
      color: "text-zinc-700 bg-zinc-100",
      isRawCount: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="p-5 bg-white border border-zinc-200/90 rounded-xl shadow-xs transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-500">{card.title}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold tracking-tight text-zinc-900 tabular-nums">
              {card.amount}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
