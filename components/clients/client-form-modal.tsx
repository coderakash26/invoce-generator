"use client";

import React, { useState } from "react";
import { X, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Client } from "@/lib/types/invoice";

interface ClientFormModalProps {
  isOpen: boolean;
  client?: Client | null;
  onClose: () => void;
  onSave: (clientData: Partial<Client> & { name: string; email: string }) => void;
}

function ClientFormInner({
  client,
  onClose,
  onSave,
}: {
  client?: Client | null;
  onClose: () => void;
  onSave: (clientData: Partial<Client> & { name: string; email: string }) => void;
}) {
  const [name, setName] = useState(client?.name || "");
  const [companyName, setCompanyName] = useState(client?.companyName || "");
  const [email, setEmail] = useState(client?.email || "");
  const [phone, setPhone] = useState(client?.phone || "");
  const [taxId, setTaxId] = useState(client?.taxId || "");
  const [street, setStreet] = useState(client?.billingAddress?.street || "");
  const [city, setCity] = useState(client?.billingAddress?.city || "");
  const [state, setState] = useState(client?.billingAddress?.state || "");
  const [postalCode, setPostalCode] = useState(client?.billingAddress?.postalCode || "");
  const [country, setCountry] = useState(client?.billingAddress?.country || "United States");
  const [notes, setNotes] = useState(client?.notes || "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Client name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("A valid email address is required.");
      return;
    }

    onSave({
      id: client?.id,
      name: name.trim(),
      companyName: companyName.trim() || undefined,
      email: email.trim(),
      phone: phone.trim() || undefined,
      taxId: taxId.trim() || undefined,
      billingAddress: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      },
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-zinc-900">
            {client ? "Edit Client Details" : "Add New Client"}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600 p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Contact / Client Name *
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => {
                setError(null);
                setName(e.target.value);
              }}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Company / Organization
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Billing Email *
            </label>
            <input
              type="email"
              placeholder="billing@company.com"
              value={email}
              onChange={(e) => {
                setError(null);
                setEmail(e.target.value);
              }}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">
            Tax ID / VAT / GST Number
          </label>
          <input
            type="text"
            placeholder="e.g. US-123456789 or GB987654321"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-3 pt-2 border-t border-zinc-100">
          <span className="block text-xs font-semibold text-zinc-900">Billing Address</span>

          <div>
            <input
              type="text"
              placeholder="Street Address, Suite / Floor"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="State / Region"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">
            Internal Client Notes
          </label>
          <textarea
            rows={2}
            placeholder="Payment preferences, billing contact instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
          >
            {client ? "Update Client" : "Save Client"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ClientFormModal({
  isOpen,
  client,
  onClose,
  onSave,
}: ClientFormModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="max-w-lg w-full"
        >
          <ClientFormInner
            key={client?.id || "new_client"}
            client={client}
            onClose={onClose}
            onSave={onSave}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
