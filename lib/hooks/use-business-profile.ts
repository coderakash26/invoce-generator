"use client";

import { useState, useEffect, useCallback } from "react";
import { BusinessProfile } from "@/lib/types/invoice";
import {
  getBusinessProfile,
  saveBusinessProfile,
  initializeStorageIfNeeded,
} from "@/lib/storage/local-storage";
import { INITIAL_BUSINESS_PROFILE } from "@/lib/storage/demo-data";

export function useBusinessProfile() {
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    if (typeof window !== "undefined") {
      initializeStorageIfNeeded();
      return getBusinessProfile();
    }
    return INITIAL_BUSINESS_PROFILE;
  });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    initializeStorageIfNeeded();
    setProfile(getBusinessProfile());
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageUpdate = () => {
      setProfile(getBusinessProfile());
    };

    window.addEventListener("invoiceflow_storage_updated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("invoiceflow_storage_updated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  return {
    profile,
    loading,
    refresh,
    saveProfile: saveBusinessProfile,
  };
}
