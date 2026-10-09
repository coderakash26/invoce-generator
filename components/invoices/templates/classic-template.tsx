import React from "react";
import { Invoice, InvoiceTotals } from "@/lib/types/invoice";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateDisplay } from "@/lib/utils/dates";

interface TemplateProps {
  invoice: Invoice;
  totals: InvoiceTotals;
}

export function ClassicTemplate({ invoice, totals }: TemplateProps) {
  const accentColor = invoice.branding?.accentColor || "#1e293b";
  const { businessSnapshot: biz, clientSnapshot: client } = invoice;

  return (
    <div className="bg-white text-zinc-900 font-serif p-10 min-h-[1050px] flex flex-col justify-between text-xs leading-relaxed">
      <div>
        {/* Top Header */}
        <div className="flex justify-between items-start border-b-2 pb-6" style={{ borderColor: accentColor }}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase" style={{ color: accentColor }}>
              INVOICE
            </h1>
            <p className="font-mono text-zinc-600 mt-1 font-semibold text-sm">
              #{invoice.invoiceNumber}
            </p>
            {invoice.title && (
              <p className="text-zinc-600 italic mt-0.5">{invoice.title}</p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold uppercase">{biz?.name || "Business Name"}</h2>
            <p className="text-zinc-600 font-sans">{biz?.address?.street}</p>
            <p className="text-zinc-600 font-sans">
              {[biz?.address?.city, biz?.address?.state, biz?.address?.postalCode].filter(Boolean).join(", ")}
            </p>
            <p className="text-zinc-600 font-sans">{biz?.address?.country}</p>
            {biz?.email && <p className="text-zinc-600 font-sans">{biz.email}</p>}
            {biz?.taxId && <p className="text-zinc-500 font-sans text-[11px]">Tax ID: {biz.taxId}</p>}
          </div>
        </div>

        {/* Dates and Client Meta */}
        <div className="grid grid-cols-2 gap-8 my-8 font-sans">
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Billed To
            </span>
            <p className="font-bold text-sm text-zinc-900">{client?.companyName || client?.name || "Client Name"}</p>
            {client?.companyName && client?.name && (
              <p className="text-zinc-700 text-xs font-medium">Attn: {client.name}</p>
            )}
            <p className="text-zinc-600 text-xs">{client?.billingAddress?.street}</p>
            <p className="text-zinc-600 text-xs">
              {[client?.billingAddress?.city, client?.billingAddress?.state, client?.billingAddress?.postalCode].filter(Boolean).join(", ")}
            </p>
            <p className="text-zinc-600 text-xs">{client?.billingAddress?.country}</p>
            {client?.email && <p className="text-zinc-600 text-xs">{client.email}</p>}
            {client?.taxId && <p className="text-zinc-500 text-[11px] mt-1">Tax ID: {client.taxId}</p>}
          </div>

          <div className="space-y-2 text-right">
            <div className="flex justify-between py-1 border-b border-zinc-200">
              <span className="text-zinc-500 font-medium">Issue Date:</span>
              <span className="font-semibold">{formatDateDisplay(invoice.issueDate)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-200">
              <span className="text-zinc-500 font-medium">Payment Due:</span>
              <span className="font-semibold text-rose-700">{formatDateDisplay(invoice.dueDate)}</span>
            </div>
            {invoice.poNumber && (
              <div className="flex justify-between py-1 border-b border-zinc-200">
                <span className="text-zinc-500 font-medium">P.O. Number:</span>
                <span className="font-mono">{invoice.poNumber}</span>
              </div>
            )}
            {invoice.referenceNumber && (
              <div className="flex justify-between py-1 border-b border-zinc-200">
                <span className="text-zinc-500 font-medium">Reference:</span>
                <span className="font-mono">{invoice.referenceNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full my-6 border-collapse font-sans text-xs">
          <thead>
            <tr className="border-y-2 border-zinc-800 text-zinc-900 uppercase tracking-wider text-[11px]">
              <th className="py-2.5 text-left font-bold">Description</th>
              <th className="py-2.5 text-center font-bold w-16">Qty</th>
              <th className="py-2.5 text-right font-bold w-24">Unit Price</th>
              <th className="py-2.5 text-right font-bold w-20">Tax</th>
              <th className="py-2.5 text-right font-bold w-28">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {invoice.items.map((item, idx) => {
              const calc = totals.lineItemsCalculations[idx];
              return (
                <tr key={item.id} className="align-top">
                  <td className="py-3 text-left pr-4">
                    <p className="font-semibold text-zinc-900">{item.name}</p>
                    {item.description && (
                      <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{item.description}</p>
                    )}
                  </td>
                  <td className="py-3 text-center text-zinc-700 tabular-nums">
                    {item.quantity} {item.unit || ""}
                  </td>
                  <td className="py-3 text-right text-zinc-700 tabular-nums">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="py-3 text-right text-zinc-500 tabular-nums">
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

        {/* Calculation Summary */}
        <div className="flex justify-end my-6 font-sans">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between py-1 text-zinc-600">
              <span>Subtotal:</span>
              <span className="font-medium text-zinc-900 tabular-nums">
                {formatCurrency(totals.subtotal, invoice.currency)}
              </span>
            </div>

            {totals.totalDiscount > 0 && (
              <div className="flex justify-between py-1 text-emerald-700">
                <span>Discount:</span>
                <span className="font-medium tabular-nums">
                  -{formatCurrency(totals.totalDiscount, invoice.currency)}
                </span>
              </div>
            )}

            {totals.taxTotal > 0 && (
              <div className="flex justify-between py-1 text-zinc-600">
                <span>Sales Tax:</span>
                <span className="font-medium text-zinc-900 tabular-nums">
                  {formatCurrency(totals.taxTotal, invoice.currency)}
                </span>
              </div>
            )}

            {totals.shipping > 0 && (
              <div className="flex justify-between py-1 text-zinc-600">
                <span>Shipping & Handling:</span>
                <span className="font-medium text-zinc-900 tabular-nums">
                  {formatCurrency(totals.shipping, invoice.currency)}
                </span>
              </div>
            )}

            {totals.additionalCharges > 0 && (
              <div className="flex justify-between py-1 text-zinc-600">
                <span>Additional Charges:</span>
                <span className="font-medium text-zinc-900 tabular-nums">
                  {formatCurrency(totals.additionalCharges, invoice.currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between py-2 border-y-2 border-zinc-900 font-bold text-sm text-zinc-900">
              <span>Grand Total:</span>
              <span className="tabular-nums" style={{ color: accentColor }}>
                {formatCurrency(totals.grandTotal, invoice.currency)}
              </span>
            </div>

            {totals.amountPaid > 0 && (
              <div className="flex justify-between py-1 text-emerald-700 text-xs">
                <span>Amount Paid:</span>
                <span className="font-semibold tabular-nums">
                  -{formatCurrency(totals.amountPaid, invoice.currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1 font-bold text-zinc-900 text-xs">
              <span>Balance Due:</span>
              <span className="tabular-nums text-rose-700">
                {formatCurrency(totals.balanceDue, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Bank & Payment Instructions */}
        {invoice.branding?.showBankDetails && biz?.bankDetails && (
          <div className="my-6 p-4 border border-zinc-200 bg-zinc-50 rounded font-sans text-[11px]">
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider mb-1.5">Payment Instructions</h4>
            <div className="grid grid-cols-2 gap-2 text-zinc-600">
              <div>
                <p><span className="font-medium text-zinc-800">Bank:</span> {biz.bankDetails.bankName}</p>
                <p><span className="font-medium text-zinc-800">Account Name:</span> {biz.bankDetails.accountHolder}</p>
              </div>
              <div>
                <p><span className="font-medium text-zinc-800">Account No:</span> {biz.bankDetails.accountNumber}</p>
                {biz.bankDetails.routingNumber && (
                  <p><span className="font-medium text-zinc-800">Routing / Sort:</span> {biz.bankDetails.routingNumber}</p>
                )}
              </div>
            </div>
            {biz.bankDetails.paymentInstructions && (
              <p className="mt-2 text-zinc-500 italic">{biz.bankDetails.paymentInstructions}</p>
            )}
          </div>
        )}

        {/* Notes & Terms */}
        <div className="grid grid-cols-2 gap-6 my-6 font-sans text-[11px] text-zinc-600">
          {invoice.notes && (
            <div>
              <span className="font-bold uppercase tracking-wider text-zinc-700 block mb-1">Notes</span>
              <p className="leading-normal">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <span className="font-bold uppercase tracking-wider text-zinc-700 block mb-1">Terms & Conditions</span>
              <p className="leading-normal">{invoice.terms}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-zinc-200 text-center font-sans text-[10px] text-zinc-400">
        {invoice.branding?.footerText || "Thank you for your business."}
      </div>
    </div>
  );
}
