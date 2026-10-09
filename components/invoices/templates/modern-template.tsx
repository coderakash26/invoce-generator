import React from "react";
import { Invoice, InvoiceTotals } from "@/lib/types/invoice";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateDisplay } from "@/lib/utils/dates";

interface TemplateProps {
  invoice: Invoice;
  totals: InvoiceTotals;
}

export function ModernTemplate({ invoice, totals }: TemplateProps) {
  const accentColor = invoice.branding?.accentColor || "#5B5FEF";
  const { businessSnapshot: biz, clientSnapshot: client } = invoice;

  return (
    <div className="bg-white text-zinc-900 font-sans p-10 min-h-[1050px] flex flex-col justify-between text-xs leading-relaxed relative">
      {/* Top Accent Strip */}
      <div
        className="absolute top-0 left-0 right-0 h-2.5 rounded-t"
        style={{ backgroundColor: accentColor }}
      />

      <div>
        {/* Header Block */}
        <div className="flex justify-between items-start pt-2 pb-8 border-b border-zinc-100">
          <div>
            <div className="inline-block px-3 py-1 rounded text-white text-[11px] font-bold uppercase tracking-wider mb-2" style={{ backgroundColor: accentColor }}>
              INVOICE
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              #{invoice.invoiceNumber}
            </h1>
            {invoice.title && (
              <p className="text-zinc-500 font-medium text-xs mt-0.5">{invoice.title}</p>
            )}
          </div>

          <div className="text-right">
            <h2 className="text-base font-bold text-zinc-900">{biz?.name || "Business Name"}</h2>
            <p className="text-zinc-500 text-xs mt-0.5">{biz?.email}</p>
            <p className="text-zinc-500 text-xs">{biz?.phone}</p>
            <p className="text-zinc-500 text-xs">{biz?.website}</p>
            <p className="text-zinc-400 text-[11px] mt-1">{biz?.address?.street}, {biz?.address?.city} {biz?.address?.country}</p>
            {biz?.taxId && <p className="text-zinc-400 text-[11px]">Tax No: {biz.taxId}</p>}
          </div>
        </div>

        {/* 3-Column Meta Grid */}
        <div className="grid grid-cols-3 gap-6 my-7 p-5 bg-zinc-50/70 border border-zinc-100 rounded-xl">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1.5">
              Invoiced To
            </span>
            <p className="font-bold text-zinc-900 text-sm">
              {client?.companyName || client?.name || "Client Name"}
            </p>
            {client?.companyName && client?.name && (
              <p className="text-xs text-zinc-600">Attn: {client.name}</p>
            )}
            <p className="text-xs text-zinc-500 mt-1">{client?.billingAddress?.street}</p>
            <p className="text-xs text-zinc-500">
              {[client?.billingAddress?.city, client?.billingAddress?.state, client?.billingAddress?.postalCode].filter(Boolean).join(", ")}
            </p>
            <p className="text-xs text-zinc-500">{client?.email}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1.5">
              Invoice Dates
            </span>
            <div className="space-y-1">
              <p className="text-xs text-zinc-600">
                <span className="text-zinc-400 font-medium mr-2">Issued:</span>
                <span className="font-semibold text-zinc-900">{formatDateDisplay(invoice.issueDate)}</span>
              </p>
              <p className="text-xs text-zinc-600">
                <span className="text-zinc-400 font-medium mr-2">Due:</span>
                <span className="font-semibold text-rose-600">{formatDateDisplay(invoice.dueDate)}</span>
              </p>
              {invoice.poNumber && (
                <p className="text-xs text-zinc-600">
                  <span className="text-zinc-400 font-medium mr-2">P.O. #:</span>
                  <span className="font-mono">{invoice.poNumber}</span>
                </p>
              )}
            </div>
          </div>

          <div className="p-3 bg-white border border-zinc-100 rounded-lg flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">
              Amount Due
            </span>
            <p className="text-xl font-bold tracking-tight tabular-nums" style={{ color: accentColor }}>
              {formatCurrency(totals.balanceDue, invoice.currency)}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Total {formatCurrency(totals.grandTotal, invoice.currency)}
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full my-6 text-xs">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-400 uppercase text-[10px] tracking-wider">
              <th className="py-3 text-left font-bold">Item & Description</th>
              <th className="py-3 text-center font-bold w-16">Qty</th>
              <th className="py-3 text-right font-bold w-24">Price</th>
              <th className="py-3 text-right font-bold w-20">Tax</th>
              <th className="py-3 text-right font-bold w-28">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {invoice.items.map((item, idx) => {
              const calc = totals.lineItemsCalculations[idx];
              return (
                <tr key={item.id} className="align-top">
                  <td className="py-3 text-left pr-4">
                    <p className="font-semibold text-zinc-900">{item.name}</p>
                    {item.description && (
                      <p className="text-zinc-500 text-[11px] mt-0.5 leading-snug">{item.description}</p>
                    )}
                  </td>
                  <td className="py-3 text-center text-zinc-600 tabular-nums">
                    {item.quantity} {item.unit || ""}
                  </td>
                  <td className="py-3 text-right text-zinc-600 tabular-nums">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="py-3 text-right text-zinc-400 tabular-nums">
                    {item.taxRate > 0 ? `${item.taxRate}%` : "—"}
                  </td>
                  <td className="py-3 text-right font-semibold text-zinc-900 tabular-nums">
                    {formatCurrency(calc?.lineTotal || 0, invoice.currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Financial Summary */}
        <div className="flex justify-end my-6">
          <div className="w-80 space-y-2 text-xs">
            <div className="flex justify-between py-1 text-zinc-500">
              <span>Subtotal</span>
              <span className="font-medium text-zinc-900 tabular-nums">
                {formatCurrency(totals.subtotal, invoice.currency)}
              </span>
            </div>

            {totals.totalDiscount > 0 && (
              <div className="flex justify-between py-1 text-emerald-600">
                <span>Total Discount</span>
                <span className="font-medium tabular-nums">
                  -{formatCurrency(totals.totalDiscount, invoice.currency)}
                </span>
              </div>
            )}

            {totals.taxTotal > 0 && (
              <div className="flex justify-between py-1 text-zinc-500">
                <span>Tax</span>
                <span className="font-medium text-zinc-900 tabular-nums">
                  {formatCurrency(totals.taxTotal, invoice.currency)}
                </span>
              </div>
            )}

            {totals.shipping > 0 && (
              <div className="flex justify-between py-1 text-zinc-500">
                <span>Shipping</span>
                <span className="font-medium text-zinc-900 tabular-nums">
                  {formatCurrency(totals.shipping, invoice.currency)}
                </span>
              </div>
            )}

            {totals.additionalCharges > 0 && (
              <div className="flex justify-between py-1 text-zinc-500">
                <span>Additional Charges</span>
                <span className="font-medium text-zinc-900 tabular-nums">
                  {formatCurrency(totals.additionalCharges, invoice.currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between py-2 border-t border-zinc-200 font-bold text-sm text-zinc-900">
              <span>Grand Total</span>
              <span className="tabular-nums" style={{ color: accentColor }}>
                {formatCurrency(totals.grandTotal, invoice.currency)}
              </span>
            </div>

            {totals.amountPaid > 0 && (
              <div className="flex justify-between py-1 text-emerald-600 text-xs">
                <span>Amount Paid</span>
                <span className="font-semibold tabular-nums">
                  -{formatCurrency(totals.amountPaid, invoice.currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between py-2 bg-zinc-50 p-2.5 rounded-lg font-bold text-zinc-900 text-xs">
              <span>Balance Due</span>
              <span className="tabular-nums text-rose-600">
                {formatCurrency(totals.balanceDue, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Bank & Payment Instructions */}
        {invoice.branding?.showBankDetails && biz?.bankDetails && (
          <div className="my-6 p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-[11px]">
            <h4 className="font-bold text-zinc-800 uppercase tracking-wider mb-2">Wire / Payment Information</h4>
            <div className="grid grid-cols-2 gap-4 text-zinc-600">
              <div>
                <p><span className="text-zinc-400">Bank:</span> {biz.bankDetails.bankName}</p>
                <p><span className="text-zinc-400">Account Name:</span> {biz.bankDetails.accountHolder}</p>
              </div>
              <div>
                <p><span className="text-zinc-400">Account No:</span> {biz.bankDetails.accountNumber}</p>
                {biz.bankDetails.routingNumber && (
                  <p><span className="text-zinc-400">Routing / Sort:</span> {biz.bankDetails.routingNumber}</p>
                )}
              </div>
            </div>
            {biz.bankDetails.paymentInstructions && (
              <p className="mt-2 text-zinc-500">{biz.bankDetails.paymentInstructions}</p>
            )}
          </div>
        )}

        {/* Notes & Terms */}
        <div className="grid grid-cols-2 gap-6 my-6 text-[11px] text-zinc-500">
          {invoice.notes && (
            <div>
              <span className="font-bold text-zinc-800 block mb-1">Notes</span>
              <p>{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <span className="font-bold text-zinc-800 block mb-1">Terms</span>
              <p>{invoice.terms}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-zinc-100 text-center text-[10px] text-zinc-400">
        {invoice.branding?.footerText || "Thank you for your business."}
      </div>
    </div>
  );
}
