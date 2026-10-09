"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  FilePlus,
  Users,
} from "lucide-react";
import { Client } from "@/lib/types/invoice";
import { useClients } from "@/lib/hooks/use-clients";
import { useInvoices } from "@/lib/hooks/use-invoices";
import { useToast } from "@/components/shared/toast";
import { ClientFormModal } from "./client-form-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice-calculations";
import { formatCurrency } from "@/lib/utils/currency";

export function ClientTable() {
  const router = useRouter();
  const { clients, saveClient, deleteClient } = useClients();
  const { invoices } = useInvoices();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Client stats mapping
  const clientStats = useMemo(() => {
    const stats: Record<string, { totalInvoiced: number; balanceDue: number; count: number }> = {};

    invoices.forEach((inv) => {
      if (!inv.clientId || inv.status === "cancelled") return;
      if (!stats[inv.clientId]) {
        stats[inv.clientId] = { totalInvoiced: 0, balanceDue: 0, count: 0 };
      }
      const totals = calculateInvoiceTotals(inv);
      if (inv.status !== "draft") {
        stats[inv.clientId].totalInvoiced += totals.grandTotal;
        stats[inv.clientId].balanceDue += totals.balanceDue;
        stats[inv.clientId].count += 1;
      }
    });

    return stats;
  }, [invoices]);

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.companyName?.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [clients, search]);

  const handleDelete = () => {
    if (!clientToDelete) return;
    deleteClient(clientToDelete.id);
    toast.success("Client Removed", `${clientToDelete.name} was removed from your directory.`);
    setClientToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients by name, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setClientToEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        {filteredClients.length === 0 ? (
          <EmptyState
            icon={Users}
            title={clients.length === 0 ? "No clients added yet" : "No matching clients"}
            description={
              clients.length === 0
                ? "Add client records to quickly auto-populate billing information when generating invoices."
                : "Try a different search term or add a new client record."
            }
            actionLabel="Add Your First Client"
            onAction={() => {
              setClientToEdit(null);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-3 px-4">Client / Company</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Billing Location</th>
                  <th className="py-3 px-4 text-center">Invoices</th>
                  <th className="py-3 px-4 text-right">Total Billed</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredClients.map((client) => {
                  const stat = clientStats[client.id] || { totalInvoiced: 0, balanceDue: 0, count: 0 };

                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-zinc-50/80 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/clients/${client.id}`)}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-semibold text-zinc-900 hover:text-indigo-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {client.companyName || client.name}
                        </Link>
                        {client.companyName && (
                          <p className="text-[11px] text-zinc-400 font-normal">{client.name}</p>
                        )}
                      </td>

                      <td className="py-3 px-4 text-zinc-600 whitespace-nowrap">
                        <p className="text-zinc-700">{client.email}</p>
                        {client.phone && (
                          <p className="text-[11px] text-zinc-400 font-normal">{client.phone}</p>
                        )}
                      </td>

                      <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">
                        {client.billingAddress?.city && client.billingAddress?.country
                          ? `${client.billingAddress.city}, ${client.billingAddress.country}`
                          : client.billingAddress?.country || "—"}
                      </td>

                      <td className="py-3 px-4 text-center text-zinc-700 whitespace-nowrap font-mono">
                        {stat.count}
                      </td>

                      <td className="py-3 px-4 text-right font-medium text-zinc-900 whitespace-nowrap tabular-nums">
                        {formatCurrency(stat.totalInvoiced)}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap tabular-nums">
                        <span
                          className={`font-semibold ${
                            stat.balanceDue > 0 ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {formatCurrency(stat.balanceDue)}
                        </span>
                      </td>

                      <td
                        className="py-3 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/invoices/new?client=${client.id}`}
                            className="p-1.5 text-zinc-400 hover:text-indigo-600 rounded-md hover:bg-zinc-100 transition-colors"
                            title="Create Invoice for Client"
                          >
                            <FilePlus className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setClientToEdit(client);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors"
                            title="Edit Client"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setClientToDelete(client)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-md hover:bg-zinc-100 transition-colors"
                            title="Delete Client"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Client Modal */}
      <ClientFormModal
        isOpen={isModalOpen}
        client={clientToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setClientToEdit(null);
        }}
        onSave={(data) => {
          saveClient(data);
          toast.success("Client Updated", `${data.name} saved to directory.`);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!clientToDelete}
        title="Delete Client"
        message={`Are you sure you want to remove ${clientToDelete?.name}? Historical invoices referencing this client will preserve their snapshot.`}
        confirmLabel="Delete Client"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setClientToDelete(null)}
      />
    </div>
  );
}
