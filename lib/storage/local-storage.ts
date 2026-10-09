import { Invoice, Client, BusinessProfile, Payment } from "@/lib/types/invoice";
import { STORAGE_KEYS } from "./storage-keys";
import { INITIAL_BUSINESS_PROFILE, INITIAL_CLIENTS, INITIAL_INVOICES } from "./demo-data";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice-calculations";
import { generateId } from "@/lib/utils/ids";
import { formatInvoiceNumber } from "@/lib/utils/invoice-number";

// Helper for safe client-side execution
function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Initializes storage with demo data if empty on first visit
 */
export function initializeStorageIfNeeded(): void {
  if (!isClient()) return;

  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!initialized) {
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(INITIAL_BUSINESS_PROFILE));
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
  }
}

// Event dispatcher to notify components of data changes
export function notifyDataChanged(): void {
  if (isClient()) {
    window.dispatchEvent(new Event("invoiceflow_storage_updated"));
  }
}

// ---------------- Business Profile ----------------

export function getBusinessProfile(): BusinessProfile {
  if (!isClient()) return INITIAL_BUSINESS_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(INITIAL_BUSINESS_PROFILE));
      return INITIAL_BUSINESS_PROFILE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BUSINESS_PROFILE;
  }
}

export function saveBusinessProfile(profile: BusinessProfile): BusinessProfile {
  if (!isClient()) return profile;
  const updated = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(updated));
  notifyDataChanged();
  return updated;
}

// ---------------- Clients ----------------

export function getClients(): Client[] {
  if (!isClient()) return INITIAL_CLIENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CLIENTS;
  }
}

export function getClientById(id: string): Client | undefined {
  const clients = getClients();
  return clients.find((c) => c.id === id);
}

export function saveClient(client: Partial<Client> & { name: string; email: string }): Client {
  const clients = getClients();
  const now = new Date().toISOString();

  let target: Client;
  if (client.id) {
    const index = clients.findIndex((c) => c.id === client.id);
    if (index >= 0) {
      target = {
        ...clients[index],
        ...client,
        updatedAt: now,
      } as Client;
      clients[index] = target;
    } else {
      target = {
        ...client,
        id: client.id,
        billingAddress: client.billingAddress || { street: "", city: "", state: "", postalCode: "", country: "" },
        createdAt: now,
        updatedAt: now,
      } as Client;
      clients.push(target);
    }
  } else {
    target = {
      ...client,
      id: generateId(),
      billingAddress: client.billingAddress || { street: "", city: "", state: "", postalCode: "", country: "" },
      createdAt: now,
      updatedAt: now,
    } as Client;
    clients.push(target);
  }

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    notifyDataChanged();
  }
  return target;
}

export function deleteClient(id: string): boolean {
  if (!isClient()) return false;
  const clients = getClients();
  const filtered = clients.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(filtered));
  notifyDataChanged();
  return true;
}

// ---------------- Invoices ----------------

export function getInvoices(): Invoice[] {
  if (!isClient()) return INITIAL_INVOICES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
      return INITIAL_INVOICES;
    }
    const invoices: Invoice[] = JSON.parse(raw);

    // Sync dynamic overdue status on read
    return invoices.map((inv) => {
      const totals = calculateInvoiceTotals(inv);
      if (totals.effectiveStatus !== inv.status && inv.status !== "draft" && inv.status !== "cancelled") {
        return { ...inv, status: totals.effectiveStatus };
      }
      return inv;
    });
  } catch {
    return INITIAL_INVOICES;
  }
}

export function getInvoiceById(id: string): Invoice | undefined {
  const invoices = getInvoices();
  return invoices.find((inv) => inv.id === id);
}

export function saveInvoice(invoiceData: Partial<Invoice> & { invoiceNumber: string }): Invoice {
  const invoices = getInvoices();
  const now = new Date().toISOString();
  let saved: Invoice;

  if (invoiceData.id) {
    const idx = invoices.findIndex((i) => i.id === invoiceData.id);
    if (idx >= 0) {
      saved = {
        ...invoices[idx],
        ...invoiceData,
        updatedAt: now,
      } as Invoice;
      // recalculate effective status
      const totals = calculateInvoiceTotals(saved);
      saved.status = totals.effectiveStatus;
      invoices[idx] = saved;
    } else {
      saved = {
        ...invoiceData,
        id: invoiceData.id,
        createdAt: now,
        updatedAt: now,
      } as Invoice;
      const totals = calculateInvoiceTotals(saved);
      saved.status = totals.effectiveStatus;
      invoices.unshift(saved);
    }
  } else {
    saved = {
      ...invoiceData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    } as Invoice;
    const totals = calculateInvoiceTotals(saved);
    saved.status = totals.effectiveStatus;
    invoices.unshift(saved);

    // Increment business nextNumber
    const biz = getBusinessProfile();
    if (biz.nextNumber) {
      saveBusinessProfile({ ...biz, nextNumber: biz.nextNumber + 1 });
    }
  }

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    notifyDataChanged();
  }
  return saved;
}

export function duplicateInvoice(id: string): Invoice | undefined {
  const original = getInvoiceById(id);
  if (!original) return undefined;

  const biz = getBusinessProfile();
  const newNumber = formatInvoiceNumber(biz.invoicePrefix, biz.nextNumber || 1);

  const duplicated: Invoice = {
    ...original,
    id: generateId(),
    invoiceNumber: newNumber,
    title: original.title ? `${original.title} (Copy)` : undefined,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    status: "draft",
    payments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveInvoice(duplicated);
  return duplicated;
}

export function deleteInvoice(id: string): boolean {
  if (!isClient()) return false;
  const invoices = getInvoices();
  const filtered = invoices.filter((inv) => inv.id !== id);
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(filtered));
  notifyDataChanged();
  return true;
}

export function recordPayment(invoiceId: string, paymentData: Omit<Payment, "id" | "invoiceId" | "createdAt">): Invoice | undefined {
  const invoice = getInvoiceById(invoiceId);
  if (!invoice) return undefined;

  const newPayment: Payment = {
    id: generateId(),
    invoiceId,
    amount: Math.max(0, Number(paymentData.amount) || 0),
    date: paymentData.date,
    method: paymentData.method,
    reference: paymentData.reference,
    notes: paymentData.notes,
    createdAt: new Date().toISOString(),
  };

  const updatedPayments = [...(invoice.payments || []), newPayment];
  const updatedInvoice: Invoice = {
    ...invoice,
    payments: updatedPayments,
  };

  const totals = calculateInvoiceTotals(updatedInvoice);
  updatedInvoice.status = totals.effectiveStatus;

  return saveInvoice(updatedInvoice);
}

// ---------------- Backup & Reset ----------------

export function exportAllData(): string {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    business: getBusinessProfile(),
    clients: getClients(),
    invoices: getInvoices(),
  };
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): { success: boolean; message: string } {
  if (!isClient()) return { success: false, message: "Browser environment required." };
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object") {
      return { success: false, message: "Invalid JSON format." };
    }
    if (parsed.business) {
      localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(parsed.business));
    }
    if (Array.isArray(parsed.clients)) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(parsed.clients));
    }
    if (Array.isArray(parsed.invoices)) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(parsed.invoices));
    }
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
    notifyDataChanged();
    return { success: true, message: "Data imported successfully!" };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to parse JSON." };
  }
}

export function resetToDemoData(): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(INITIAL_BUSINESS_PROFILE));
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
  notifyDataChanged();
}

export function clearAllData(): void {
  if (!isClient()) return;
  localStorage.removeItem(STORAGE_KEYS.INVOICES);
  localStorage.removeItem(STORAGE_KEYS.CLIENTS);
  localStorage.removeItem(STORAGE_KEYS.BUSINESS);
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
  notifyDataChanged();
}
