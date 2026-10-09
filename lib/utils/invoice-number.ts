export function formatInvoiceNumber(prefix: string = "INV", sequence: number = 1, padLength: number = 4): string {
  const year = typeof window === "undefined" ? 2026 : new Date().getFullYear();
  const padded = String(sequence).padStart(padLength, "0");
  const cleanPrefix = (prefix || "INV").trim();
  return `${cleanPrefix}-${year}-${padded}`;
}

export function parseInvoiceSequence(invoiceNumber: string): number | null {
  if (!invoiceNumber) return null;
  const parts = invoiceNumber.split("-");
  const lastPart = parts[parts.length - 1];
  const num = parseInt(lastPart, 10);
  return isNaN(num) ? null : num;
}
