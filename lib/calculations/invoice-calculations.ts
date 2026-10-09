import {
  Invoice,
  InvoiceItem,
  InvoiceTotals,
  LineItemCalculation,
  InvoiceStatus,
} from "@/lib/types/invoice";

/**
 * Rounds a number safely to 2 decimal places to avoid floating point anomalies.
 */
export function roundToTwoDecimals(num: number): number {
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates financial amounts for a single line item.
 */
export function calculateLineItem(item: InvoiceItem): LineItemCalculation {
  const qty = Math.max(0, Number(item.quantity) || 0);
  const price = Math.max(0, Number(item.unitPrice) || 0);
  const discRate = Math.min(100, Math.max(0, Number(item.discountRate) || 0));
  const taxRate = Math.min(100, Math.max(0, Number(item.taxRate) || 0));

  const lineSubtotal = roundToTwoDecimals(qty * price);
  const discountAmount = roundToTwoDecimals((lineSubtotal * discRate) / 100);
  const taxableAmount = Math.max(0, roundToTwoDecimals(lineSubtotal - discountAmount));
  const taxAmount = roundToTwoDecimals((taxableAmount * taxRate) / 100);
  const lineTotal = roundToTwoDecimals(taxableAmount + taxAmount);

  return {
    lineSubtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    lineTotal,
  };
}

/**
 * Computes all aggregate financial totals for an invoice.
 */
export function calculateInvoiceTotals(
  invoice: Pick<
    Invoice,
    | "items"
    | "invoiceDiscountRate"
    | "invoiceDiscountAmount"
    | "discountType"
    | "shipping"
    | "additionalCharges"
    | "withholdingTaxRate"
    | "payments"
    | "dueDate"
    | "status"
  >
): InvoiceTotals {
  const items = invoice.items || [];
  const lineItemsCalculations: LineItemCalculation[] = items.map(calculateLineItem);

  const subtotal = roundToTwoDecimals(
    lineItemsCalculations.reduce((sum, item) => sum + item.lineSubtotal, 0)
  );

  const lineDiscountsTotal = roundToTwoDecimals(
    lineItemsCalculations.reduce((sum, item) => sum + item.discountAmount, 0)
  );

  const subtotalAfterLineDiscounts = Math.max(0, subtotal - lineDiscountsTotal);

  let invoiceDiscount = 0;
  if (invoice.discountType === "percentage") {
    const rate = Math.min(100, Math.max(0, Number(invoice.invoiceDiscountRate) || 0));
    invoiceDiscount = roundToTwoDecimals((subtotalAfterLineDiscounts * rate) / 100);
  } else {
    const fixed = Math.max(0, Number(invoice.invoiceDiscountAmount) || 0);
    invoiceDiscount = Math.min(subtotalAfterLineDiscounts, roundToTwoDecimals(fixed));
  }

  const totalDiscount = roundToTwoDecimals(lineDiscountsTotal + invoiceDiscount);
  const taxableSubtotal = Math.max(0, roundToTwoDecimals(subtotal - totalDiscount));

  // Compute tax total from line taxes (proportionally adjusted if invoice discount exists)
  let taxTotal = 0;
  if (subtotalAfterLineDiscounts > 0 && invoiceDiscount > 0) {
    const discountRatio = (subtotalAfterLineDiscounts - invoiceDiscount) / subtotalAfterLineDiscounts;
    taxTotal = roundToTwoDecimals(
      lineItemsCalculations.reduce((sum, item) => {
        const itemTaxAfterDiscount = (item.taxAmount * discountRatio);
        return sum + itemTaxAfterDiscount;
      }, 0)
    );
  } else {
    taxTotal = roundToTwoDecimals(
      lineItemsCalculations.reduce((sum, item) => sum + item.taxAmount, 0)
    );
  }

  const shipping = Math.max(0, roundToTwoDecimals(Number(invoice.shipping) || 0));
  const additionalCharges = Math.max(0, roundToTwoDecimals(Number(invoice.additionalCharges) || 0));

  const grandTotal = roundToTwoDecimals(
    taxableSubtotal + taxTotal + shipping + additionalCharges
  );

  const wTaxRate = Math.min(100, Math.max(0, Number(invoice.withholdingTaxRate) || 0));
  const withholdingTaxAmount = roundToTwoDecimals((taxableSubtotal * wTaxRate) / 100);
  const netPayable = roundToTwoDecimals(Math.max(0, grandTotal - withholdingTaxAmount));

  const payments = invoice.payments || [];
  const amountPaid = roundToTwoDecimals(
    payments.reduce((sum, p) => sum + Math.max(0, Number(p.amount) || 0), 0)
  );

  const balanceDue = roundToTwoDecimals(Math.max(0, netPayable - amountPaid));

  const effectiveStatus = determineEffectiveStatus(
    invoice.status,
    invoice.dueDate,
    netPayable,
    amountPaid,
    balanceDue
  );

  return {
    lineItemsCalculations,
    subtotal,
    lineDiscountsTotal,
    invoiceDiscount,
    totalDiscount,
    taxableSubtotal,
    taxTotal,
    shipping,
    additionalCharges,
    grandTotal,
    withholdingTaxAmount,
    netPayable,
    amountPaid,
    balanceDue,
    effectiveStatus,
  };
}

/**
 * Determines whether an invoice status should be dynamically marked as paid,
 * partially paid, or overdue based on dates and balances.
 */
export function determineEffectiveStatus(
  currentStatus: InvoiceStatus,
  dueDateString: string,
  totalAmount: number,
  amountPaid: number,
  balanceDue: number
): InvoiceStatus {
  if (currentStatus === "cancelled") return "cancelled";
  if (currentStatus === "draft" && amountPaid <= 0) return "draft";

  if (totalAmount > 0 && amountPaid >= totalAmount) {
    return "paid";
  }

  if (amountPaid > 0 && balanceDue > 0) {
    return "partially_paid";
  }

  // Check overdue condition
  if (dueDateString && balanceDue > 0 && currentStatus !== "draft") {
    const today = typeof window === "undefined" ? "2026-03-31" : new Date().toISOString().split("T")[0];
    if (dueDateString < today) {
      return "overdue";
    }
  }

  return currentStatus || "sent";
}
