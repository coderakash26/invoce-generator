import {
  calculateLineItem,
  calculateInvoiceTotals,
  determineEffectiveStatus,
} from "../invoice-calculations";
import { InvoiceItem } from "@/lib/types/invoice";

export function runInvoiceCalculationTests() {
  const results: { name: string; passed: boolean; message?: string }[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (e: unknown) {
      results.push({ name, passed: false, message: e instanceof Error ? e.message : String(e) });
    }
  }

  function assertEqual(actual: unknown, expected: unknown, desc: string) {
    if (actual !== expected) {
      throw new Error(`${desc}: Expected ${String(expected)}, got ${String(actual)}`);
    }
  }

  // 1. Basic Line Item
  test("Basic Line Item Calculation without discount or tax", () => {
    const item: InvoiceItem = {
      id: "1",
      name: "Web Design",
      quantity: 5,
      unitPrice: 100,
      discountRate: 0,
      taxRate: 0,
    };
    const res = calculateLineItem(item);
    assertEqual(res.lineSubtotal, 500, "Subtotal");
    assertEqual(res.discountAmount, 0, "Discount");
    assertEqual(res.taxableAmount, 500, "Taxable");
    assertEqual(res.taxAmount, 0, "Tax");
    assertEqual(res.lineTotal, 500, "Total");
  });

  // 2. Line Item with 10% discount and 20% tax
  test("Line Item with discount and tax", () => {
    const item: InvoiceItem = {
      id: "2",
      name: "Consulting",
      quantity: 10,
      unitPrice: 50, // 500 subtotal
      discountRate: 10, // 50 discount -> 450 taxable
      taxRate: 20, // 90 tax -> 540 total
    };
    const res = calculateLineItem(item);
    assertEqual(res.lineSubtotal, 500, "Subtotal");
    assertEqual(res.discountAmount, 50, "Discount");
    assertEqual(res.taxableAmount, 450, "Taxable");
    assertEqual(res.taxAmount, 90, "Tax");
    assertEqual(res.lineTotal, 540, "Total");
  });

  // 3. Rounding and Fractional Math
  test("Fractional numbers and rounding precision", () => {
    const item: InvoiceItem = {
      id: "3",
      name: "SaaS Subscription",
      quantity: 3,
      unitPrice: 33.333,
      discountRate: 5,
      taxRate: 8.25,
    };
    const res = calculateLineItem(item);
    // 3 * 33.333 = 100.00
    assertEqual(res.lineSubtotal, 100, "Subtotal rounding");
    // 5% of 100 = 5
    assertEqual(res.discountAmount, 5, "Discount");
    assertEqual(res.taxableAmount, 95, "Taxable");
    // 8.25% of 95 = 7.8375 -> 7.84
    assertEqual(res.taxAmount, 7.84, "Tax rounded");
    assertEqual(res.lineTotal, 102.84, "Line total");
  });

  // 4. Invoice Aggregations with Shipping & Additional Charges
  test("Invoice Totals with Multiple Items and Charges", () => {
    const item1: InvoiceItem = {
      id: "1",
      name: "Item 1",
      quantity: 2,
      unitPrice: 100, // 200
      discountRate: 0,
      taxRate: 10, // 20 tax -> 220
    };
    const item2: InvoiceItem = {
      id: "2",
      name: "Item 2",
      quantity: 1,
      unitPrice: 300, // 300
      discountRate: 0,
      taxRate: 0, // 0 tax -> 300
    };

    const totals = calculateInvoiceTotals({
      items: [item1, item2],
      invoiceDiscountRate: 0,
      invoiceDiscountAmount: 0,
      discountType: "percentage",
      shipping: 50,
      additionalCharges: 25,
      withholdingTaxRate: 0,
      payments: [],
      dueDate: "2026-12-31",
      status: "sent",
    });

    assertEqual(totals.subtotal, 500, "Subtotal");
    assertEqual(totals.taxTotal, 20, "Tax Total");
    assertEqual(totals.shipping, 50, "Shipping");
    assertEqual(totals.additionalCharges, 25, "Additional Charges");
    // 500 + 20 + 50 + 25 = 595
    assertEqual(totals.grandTotal, 595, "Grand Total");
    assertEqual(totals.balanceDue, 595, "Balance Due");
  });

  // 5. Payment status transitions
  test("Status evaluation for partial, full, and overdue payments", () => {
    const statusPaid = determineEffectiveStatus("sent", "2026-01-01", 1000, 1000, 0);
    assertEqual(statusPaid, "paid", "Fully Paid");

    const statusPartial = determineEffectiveStatus("sent", "2026-01-01", 1000, 400, 600);
    assertEqual(statusPartial, "partially_paid", "Partially Paid");

    const statusOverdue = determineEffectiveStatus("sent", "2020-01-01", 1000, 0, 1000);
    assertEqual(statusOverdue, "overdue", "Overdue");
  });

  return results;
}
