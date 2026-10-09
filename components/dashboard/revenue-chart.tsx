"use client";

import React, { useMemo, useSyncExternalStore } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Invoice, CurrencyCode } from "@/lib/types/invoice";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice-calculations";
import { formatCurrency } from "@/lib/utils/currency";

interface RevenueChartProps {
  invoices: Invoice[];
  currency?: string;
}

const emptySubscribe = () => () => {};

export function RevenueChart({ invoices, currency = "USD" }: RevenueChartProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const chartData = useMemo(() => {
    if (!isClient) return [];
    // Generate data for the last 6 months
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const result: { month: string; invoiced: number; collected: number }[] = [];

    // Last 6 months list
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIndex = d.getMonth();
      const mName = months[mIndex];
      const yearStr = d.getFullYear().toString().slice(-2);
      const key = `${mName} '${yearStr}`;

      let invoiced = 0;
      let collected = 0;

      invoices.forEach((inv) => {
        if (inv.status === "cancelled") return;
        if (!inv.issueDate) return;

        const invDate = new Date(inv.issueDate);
        if (invDate.getFullYear() === d.getFullYear() && invDate.getMonth() === d.getMonth()) {
          const totals = calculateInvoiceTotals(inv);
          if (inv.status !== "draft") {
            invoiced += totals.grandTotal;
          }
        }

        // Check payments recorded in this month
        (inv.payments || []).forEach((p) => {
          if (!p.date) return;
          const pDate = new Date(p.date);
          if (pDate.getFullYear() === d.getFullYear() && pDate.getMonth() === d.getMonth()) {
            collected += Number(p.amount) || 0;
          }
        });
      });

      result.push({
        month: key,
        invoiced: Math.round(invoiced),
        collected: Math.round(collected),
      });
    }

    return result;
  }, [invoices, isClient]);

  if (!isClient) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-zinc-50 rounded-xl border border-zinc-200">
        <p className="text-xs text-zinc-400">Loading revenue chart...</p>
      </div>
    );
  }

  const hasData = chartData.some((d) => d.invoiced > 0 || d.collected > 0);

  return (
    <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Invoicing & Collections</h3>
          <p className="text-xs text-zinc-500">Monthly breakdown of billed vs paid amounts</p>
        </div>
      </div>

      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-200 rounded-lg bg-zinc-50">
          <p className="text-xs font-medium text-zinc-600">No chart data for recent months</p>
          <p className="text-[11px] text-zinc-400 mt-1">Issue invoices and record payments to visualize revenue</p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value) || 0, currency as CurrencyCode), ""]}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E2E8F0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                iconType="circle"
              />
              <Bar dataKey="invoiced" name="Invoiced" fill="#5B5FEF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="collected" name="Collected" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
