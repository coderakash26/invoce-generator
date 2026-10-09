"use client";

import React, { useState } from "react";
import { X, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Invoice, PaymentMethod } from "@/lib/types/invoice";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice-calculations";
import { formatCurrency } from "@/lib/utils/currency";
import { getTodayDateString } from "@/lib/utils/dates";

interface RecordPaymentModalProps {
  isOpen: boolean;
  invoice: Invoice;
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    date: string;
    method: PaymentMethod;
    reference?: string;
    notes?: string;
  }) => void;
}

export function RecordPaymentModal({
  isOpen,
  invoice,
  onClose,
  onSubmit,
}: RecordPaymentModalProps) {
  const totals = calculateInvoiceTotals(invoice);
  const [amount, setAmount] = useState<number>(totals.balanceDue || 0);
  const [date, setDate] = useState<string>(getTodayDateString());
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError("Payment amount must be greater than zero.");
      return;
    }
    onSubmit({
      amount: Number(amount),
      date,
      method,
      reference: reference.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-md w-full overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900">Record Payment</h3>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-between text-sm">
              <span className="text-zinc-600">Remaining Balance:</span>
              <span className="font-semibold text-zinc-900 tabular-nums">
                {formatCurrency(totals.balanceDue, invoice.currency)}
              </span>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Payment Amount ({invoice.currency}) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={totals.balanceDue > 0 ? totals.balanceDue : undefined}
                  value={amount}
                  onChange={(e) => {
                    setError(null);
                    setAmount(parseFloat(e.target.value) || 0);
                  }}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Payment Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Payment Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="bank_transfer">Bank Transfer / Wire</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Reference / Transaction ID
              </label>
              <input
                type="text"
                placeholder="e.g. WIRE-884920 or Receipt #12"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Internal Notes</label>
              <textarea
                rows={2}
                placeholder="Optional notes about this transaction"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
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
                Record Payment
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
