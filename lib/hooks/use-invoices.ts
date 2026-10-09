"use client";

import { useState, useEffect, useCallback } from "react";
import { Invoice } from "@/lib/types/invoice";
import {
  getInvoices,
  getInvoiceById,
  saveInvoice,
  deleteInvoice,
  duplicateInvoice,
  recordPayment,
  initializeStorageIfNeeded,
} from "@/lib/storage/local-storage";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    if (typeof window !== "undefined") {
      initializeStorageIfNeeded();
      return getInvoices();
    }
    return [];
  });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    initializeStorageIfNeeded();
    setInvoices(getInvoices());
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageUpdate = () => {
      setInvoices(getInvoices());
    };

    window.addEventListener("invoiceflow_storage_updated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("invoiceflow_storage_updated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  return {
    invoices,
    loading,
    refresh,
    getInvoice: getInvoiceById,
    saveInvoice,
    deleteInvoice,
    duplicateInvoice,
    recordPayment,
  };
}
