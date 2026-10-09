"use client";

import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ClientTable } from "@/components/clients/client-table";

export default function ClientsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Clients</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Maintain your client directory, view billing addresses, and monitor outstanding balances.
          </p>
        </div>

        <ClientTable />
      </div>
    </AppLayout>
  );
}
