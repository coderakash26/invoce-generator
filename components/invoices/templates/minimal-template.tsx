import React from "react";
import { Invoice, InvoiceTotals } from "@/lib/types/invoice";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateDisplay } from "@/lib/utils/dates";

interface TemplateProps {
  invoice: Invoice;
  totals: InvoiceTotals;
}

export function MinimalTemplate({ invoice, totals }: TemplateProps) {
  const { businessSnapshot: biz, clientSnapshot: client } = invoice;

  return (
    <div className="bg-white text-zinc-900 font-sans p-12 min-h-[1050px] flex flex-col justify-between text-xs leading-relaxed">
      <div>
        {/* Header - Swiss Style */}
        <div className="grid grid-cols-2 gap-12 pb-12 border-b border-zinc-200">
          <div>
            <span className="text-[11px] font-mono text-zinc-400 block tracking-widest uppercase mb-1">
              Invoice
            </span>
            <h1 className="text-2xl font-light tracking-tight text-zinc-950 font-mono">
              {invoice.invoiceNumber}
            </h1>
            {invoice.title && (
              <p className="text-zinc-500 text-xs mt-1 font-normal">{invoice.title}</p>
            )}
          </div>

          <div className="text-right space-y-1">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">{biz?.name || "Business Name"}</h2>
            <p className="text-zinc-500 text-xs">{biz?.address?.street}</p>
            <p className="text-zinc-500 text-xs">
              {[biz?.address?.city, biz?.address?.state, biz?.address?.postalCode, biz?.address?.country].filter(Boolean).join(", ")}
            </p>
            <p className="text-zinc-500 font-mono text-[11px]">{biz?.email}</p>
            {biz?.taxId && <p className="text-zinc-400 font-mono text-[11px]">VAT/Tax: {biz.taxId}</p>}
          </div>
        </div>

        {/* Client & Date Specs */}
        <div className="grid grid-cols-4 gap-6 py-8 border-b border-zinc-200">
          <div className="col-span-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">
              Client
            </span>
            <p className="font-semibold text-zinc-900 text-sm">
              {client?.companyName || client?.name || "Client Name"}
            </p>
            {client?.companyName && client?.name && (
              <p className="text-zinc-600 text-xs mt-0.5">{client.name}</p>
            )}
            <p className="text-zinc-500 text-xs mt-1">{client?.billingAddress?.street}</p>
            <p className="text-zinc-500 text-xs">
              {[client?.billingAddress?.city, client?.billingAddress?.state, client?.billingAddress?.postalCode, client?.billingAddress?.country].filter(Boolean).join(", ")}
            </p>
            {client?.taxId && <p className="text-zinc-400 font-mono text-[11px] mt-1">Tax: {client.taxId}</p>}
          </div>

          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">
              Date Issued
            </span>
            <p className="text-zinc-800 font-mono text-xs">{formatDateDisplay(invoice.issueDate)}</p>

            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mt-4 mb-1">
              Due Date
            </span>
            <p className="text-zinc-950 font-semibold font-mono text-xs">{formatDateDisplay(invoice.dueDate)}</p>
          </div>

          <div>
            {invoice.poNumber && (
              <>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">
                  PO Number
                </span>
                <p className="text-zinc-800 font-mono text-xs">{invoice.poNumber}</p>
              </>
            )}
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mt-4 mb-1">
              Currency
            </span>
            <p className="text-zinc-800 font-mono text-xs">{invoice.currency}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full my-8 text-xs">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
              <th className="py-2.5 text-left font-normal">Item</th>
              <th className="py-2.5 text-center font-normal w-16">Qty</th>
              <th className="py-2.5 text-right font-normal w-24">Rate</th>
              <th className="py-2.5 text-right font-normal w-20">Tax</th>
              <th className="py-2.5 text-right font-normal w-28">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {invoice.items.map((item, idx) => {
              const calc = totals.lineItemsCalculations[idx];
              return (
                <tr key={item.id} className="align-top">
                  <td className="py-3 text-left pr-4">
                    <p className="font-medium text-zinc-900">{item.name}</p>
                    {item.description && (
                      <p className="text-zinc-400 text-[11px] mt-0.5">{item.description}</p>
                    )}
                  </td>
                  <td className="py-3 text-center text-zinc-600 font-mono text-xs">
                    {item.quantity} {item.unit || ""}
                  </td>
                  <td className="py-3 text-right text-zinc-600 font-mono text-xs">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="py-3 text-right text-zinc-400 font-mono text-xs">
                    {item.taxRate > 0 ? `${item.taxRate}%` : "—"}
                  </td>
                  <td className="py-3 text-right font-semibold text-zinc-950 font-mono text-xs">
                    {formatCurrency(calc?.lineTotal || 0, invoice.currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end my-8 border-t border-zinc-200 pt-4">
          <div className="w-72 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal:</span>
              <span className="text-zinc-900">{formatCurrency(totals.subtotal, invoice.currency)}</span>
            </div>

            {totals.totalDiscount > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>Discount:</span>
                <span className="text-zinc-900">-{formatCurrency(totals.totalDiscount, invoice.currency)}</span>
              </div>
            )}

            {totals.taxTotal > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>Tax:</span>
                <span className="text-zinc-900">{formatCurrency(totals.taxTotal, invoice.currency)}</span>
              </div>
            )}

            {totals.shipping > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>Shipping:</span>
                <span className="text-zinc-900">{formatCurrency(totals.shipping, invoice.currency)}</span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t border-zinc-900 font-bold text-sm text-zinc-950">
              <span>Total:</span>
              <span>{formatCurrency(totals.grandTotal, invoice.currency)}</span>
            </div>

            {totals.amountPaid > 0 && (
              <div className="flex justify-between text-zinc-500 pt-1">
                <span>Paid:</span>
                <span>-{formatCurrency(totals.amountPaid, invoice.currency)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-xs pt-1 border-t border-zinc-200">
              <span>Balance:</span>
              <span>{formatCurrency(totals.balanceDue, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment & Terms */}
        {invoice.branding?.showBankDetails && biz?.bankDetails && (
          <div className="my-8 pt-6 border-t border-zinc-200 grid grid-cols-2 gap-8 text-[11px] font-mono text-zinc-500">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">Bank Remittance</span>
              <p><span className="text-zinc-700">Bank:</span> {biz.bankDetails.bankName}</p>
              <p><span className="text-zinc-700">Account:</span> {biz.bankDetails.accountHolder}</p>
              <p><span className="text-zinc-700">IBAN / Acc #:</span> {biz.bankDetails.accountNumber}</p>
              {biz.bankDetails.routingNumber && (
                <p><span className="text-zinc-700">Routing:</span> {biz.bankDetails.routingNumber}</p>
              )}
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">Notes & Terms</span>
              <p className="font-sans text-xs">{invoice.terms || "Payment due as specified above."}</p>
            </div>
          </div>
        )}
      </div>

      {/* Minimal Footer */}
      <div className="pt-8 border-t border-zinc-200 text-zinc-400 font-mono text-[10px]">
        {invoice.branding?.footerText || "InvoiceFlow · Generated Document"}
      </div>
    </div>
  );
}
