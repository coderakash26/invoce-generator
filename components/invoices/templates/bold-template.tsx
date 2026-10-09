import React from "react";
import { Invoice, InvoiceTotals } from "@/lib/types/invoice";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateDisplay } from "@/lib/utils/dates";

interface TemplateProps {
  invoice: Invoice;
  totals: InvoiceTotals;
}

export function BoldTemplate({ invoice, totals }: TemplateProps) {
  const accentColor = invoice.branding?.accentColor || "#2563EB";
  const { businessSnapshot: biz, clientSnapshot: client } = invoice;

  return (
    <div className="bg-white text-zinc-900 font-sans min-h-[1050px] flex flex-col justify-between text-xs leading-relaxed">
      <div>
        {/* Bold Full-Width Dark Banner */}
        <div className="bg-zinc-900 text-white p-10 flex justify-between items-start">
          <div>
            <div className="inline-block px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider text-white mb-3" style={{ backgroundColor: accentColor }}>
              INVOICE
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white font-mono">
              #{invoice.invoiceNumber}
            </h1>
            {invoice.title && (
              <p className="text-zinc-400 font-medium text-sm mt-1">{invoice.title}</p>
            )}
            <div className="flex gap-6 mt-4 text-xs text-zinc-300">
              <p><span className="text-zinc-500">Date:</span> {formatDateDisplay(invoice.issueDate)}</p>
              <p><span className="text-zinc-500">Due:</span> <span className="text-rose-400 font-semibold">{formatDateDisplay(invoice.dueDate)}</span></p>
            </div>
          </div>

          <div className="text-right text-zinc-300 space-y-1">
            <h2 className="text-lg font-black text-white">{biz?.name || "Business Name"}</h2>
            <p className="text-xs">{biz?.address?.street}</p>
            <p className="text-xs">
              {[biz?.address?.city, biz?.address?.state, biz?.address?.postalCode].filter(Boolean).join(", ")}
            </p>
            <p className="text-xs font-mono text-zinc-400">{biz?.email}</p>
            {biz?.taxId && <p className="text-[11px] text-zinc-500">Tax ID: {biz.taxId}</p>}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-10">
          {/* Client Details Card */}
          <div className="flex justify-between items-start p-5 bg-zinc-50 border-l-4 rounded-r-lg mb-8" style={{ borderLeftColor: accentColor }}>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">
                Recipient
              </span>
              <p className="text-base font-bold text-zinc-900">
                {client?.companyName || client?.name || "Client Name"}
              </p>
              {client?.companyName && client?.name && (
                <p className="text-xs font-medium text-zinc-600">{client.name}</p>
              )}
              <p className="text-xs text-zinc-500 mt-1">{client?.billingAddress?.street}</p>
              <p className="text-xs text-zinc-500">
                {[client?.billingAddress?.city, client?.billingAddress?.state, client?.billingAddress?.postalCode, client?.billingAddress?.country].filter(Boolean).join(", ")}
              </p>
              <p className="text-xs text-zinc-500">{client?.email}</p>
            </div>

            <div className="text-right space-y-1">
              {invoice.poNumber && (
                <p className="text-xs text-zinc-600">
                  <span className="text-zinc-400 font-medium">Purchase Order:</span> <span className="font-mono font-semibold">{invoice.poNumber}</span>
                </p>
              )}
              {invoice.referenceNumber && (
                <p className="text-xs text-zinc-600">
                  <span className="text-zinc-400 font-medium">Reference:</span> <span className="font-mono">{invoice.referenceNumber}</span>
                </p>
              )}
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-zinc-100 text-zinc-700 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-3 text-left">Description</th>
                <th className="py-3 px-3 text-center w-16">Qty</th>
                <th className="py-3 px-3 text-right w-24">Unit Price</th>
                <th className="py-3 px-3 text-right w-20">Tax</th>
                <th className="py-3 px-3 text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {invoice.items.map((item, idx) => {
                const calc = totals.lineItemsCalculations[idx];
                return (
                  <tr key={item.id} className="align-top">
                    <td className="py-3.5 px-3 text-left">
                      <p className="font-bold text-zinc-900">{item.name}</p>
                      {item.description && (
                        <p className="text-zinc-500 text-[11px] mt-0.5">{item.description}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center text-zinc-700 font-medium tabular-nums">
                      {item.quantity} {item.unit || ""}
                    </td>
                    <td className="py-3.5 px-3 text-right text-zinc-700 font-medium tabular-nums">
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-zinc-500 tabular-nums">
                      {item.taxRate > 0 ? `${item.taxRate}%` : "—"}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-zinc-900 tabular-nums">
                      {formatCurrency(calc?.lineTotal || 0, invoice.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary Box */}
          <div className="flex justify-end my-8">
            <div className="w-80 space-y-2 text-xs">
              <div className="flex justify-between py-1 text-zinc-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-zinc-900 tabular-nums">
                  {formatCurrency(totals.subtotal, invoice.currency)}
                </span>
              </div>

              {totals.totalDiscount > 0 && (
                <div className="flex justify-between py-1 text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-semibold tabular-nums">
                    -{formatCurrency(totals.totalDiscount, invoice.currency)}
                  </span>
                </div>
              )}

              {totals.taxTotal > 0 && (
                <div className="flex justify-between py-1 text-zinc-600">
                  <span>Tax:</span>
                  <span className="font-semibold text-zinc-900 tabular-nums">
                    {formatCurrency(totals.taxTotal, invoice.currency)}
                  </span>
                </div>
              )}

              {totals.shipping > 0 && (
                <div className="flex justify-between py-1 text-zinc-600">
                  <span>Shipping:</span>
                  <span className="font-semibold text-zinc-900 tabular-nums">
                    {formatCurrency(totals.shipping, invoice.currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between p-3.5 bg-zinc-900 text-white rounded-lg font-black text-sm my-2">
                <span>Total Due:</span>
                <span className="tabular-nums" style={{ color: accentColor }}>
                  {formatCurrency(totals.balanceDue, invoice.currency)}
                </span>
              </div>

              {totals.amountPaid > 0 && (
                <div className="flex justify-between py-1 text-emerald-600 text-xs">
                  <span>Amount Paid:</span>
                  <span className="font-semibold tabular-nums">
                    -{formatCurrency(totals.amountPaid, invoice.currency)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment instructions */}
          {invoice.branding?.showBankDetails && biz?.bankDetails && (
            <div className="my-6 p-4 border border-zinc-200 rounded-lg text-[11px] bg-zinc-50">
              <h4 className="font-bold text-zinc-900 uppercase tracking-wider mb-1.5">Payment Details</h4>
              <p className="text-zinc-600">
                <span className="font-medium text-zinc-800">Wire to:</span> {biz.bankDetails.bankName} · Acc: {biz.bankDetails.accountNumber} ({biz.bankDetails.accountHolder})
              </p>
              {biz.bankDetails.paymentInstructions && (
                <p className="mt-1 text-zinc-500">{biz.bankDetails.paymentInstructions}</p>
              )}
            </div>
          )}

          {invoice.terms && (
            <div className="my-4 text-[11px] text-zinc-500">
              <span className="font-bold text-zinc-700">Terms: </span>
              {invoice.terms}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-zinc-100 text-center text-[10px] text-zinc-500 font-medium">
        {invoice.branding?.footerText || "InvoiceFlow · Professional Invoicing"}
      </div>
    </div>
  );
}
