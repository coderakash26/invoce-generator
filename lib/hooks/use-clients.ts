"use client";

import { useState, useEffect, useCallback } from "react";
import { Client } from "@/lib/types/invoice";
import {
  getClients,
  getClientById,
  saveClient,
  deleteClient,
  initializeStorageIfNeeded,
} from "@/lib/storage/local-storage";

export function useClients() {
  const [clients, setClients] = useState<Client[]>(() => {
    if (typeof window !== "undefined") {
      initializeStorageIfNeeded();
      return getClients();
    }
    return [];
  });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    initializeStorageIfNeeded();
    setClients(getClients());
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageUpdate = () => {
      setClients(getClients());
    };

    window.addEventListener("invoiceflow_storage_updated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("invoiceflow_storage_updated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  return {
    clients,
    loading,
    refresh,
    getClient: getClientById,
    saveClient,
    deleteClient,
  };
}
