"use client";

import React from "react";
import { Plus, Trash2, Copy } from "lucide-react";
import { InvoiceItem, CurrencyCode } from "@/lib/types/invoice";
import { calculateLineItem } from "@/lib/calculations/invoice-calculations";
import { formatCurrency } from "@/lib/utils/currency";
import { generateId } from "@/lib/utils/ids";

interface InvoiceItemsEditorProps {
  items: InvoiceItem[];
  currency: CurrencyCode;
  onChange: (items: InvoiceItem[]) => void;
}

export function InvoiceItemsEditor({
  items,
  currency,
  onChange,
}: InvoiceItemsEditorProps) {
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: generateId(),
      name: "",
      description: "",
      quantity: 1,
      unit: "hrs",
      unitPrice: 0,
      discountRate: 0,
      taxRate: 0,
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= 1) return;
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDuplicateItem = (index: number) => {
    const target = items[index];
    const duplicated: InvoiceItem = {
      ...target,
      id: generateId(),
      name: `${target.name} (Copy)`,
    };
    const updated = [...items];
    updated.splice(index + 1, 0, duplicated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Line Items</h3>
          <p className="text-xs text-zinc-500">Products, services, rates, discounts, and taxes</p>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const calc = calculateLineItem(item);

          return (
            <div
              key={item.id}
              className="p-4 bg-white border border-zinc-200 rounded-xl space-y-3 transition-shadow hover:shadow-xs"
            >
              <div className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Item / Service Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Website Design & Development"
                    value={item.name}
                    onChange={(e) => handleUpdateItem(index, "name", e.target.value)}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Qty *</label>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateItem(index, "quantity", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                    required
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="hrs, pcs"
                    value={item.unit || ""}
                    onChange={(e) => handleUpdateItem(index, "unit", e.target.value)}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleUpdateItem(index, "unitPrice", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                    required
                  />
                </div>
              </div>

              {/* Description & Item discounts/taxes */}
              <div className="grid grid-cols-12 gap-3 items-center pt-1 border-t border-zinc-100">
                <div className="col-span-12 sm:col-span-6">
                  <input
                    type="text"
                    placeholder="Description or scope notes (optional)"
                    value={item.description || ""}
                    onChange={(e) => handleUpdateItem(index, "description", e.target.value)}
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-zinc-500 whitespace-nowrap">Disc %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={item.discountRate || 0}
                      onChange={(e) =>
                        handleUpdateItem(index, "discountRate", parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1 border border-zinc-200 rounded-lg text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                    />
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-zinc-500 whitespace-nowrap">Tax %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={item.taxRate || 0}
                      onChange={(e) =>
                        handleUpdateItem(index, "taxRate", parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1 border border-zinc-200 rounded-lg text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                    />
                  </div>
                </div>

                {/* Line Total & Row Actions */}
                <div className="col-span-12 sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-xs font-bold text-zinc-900 tabular-nums whitespace-nowrap">
                    {formatCurrency(calc.lineTotal, currency)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDuplicateItem(index)}
                      className="p-1 text-zinc-400 hover:text-zinc-600 rounded transition-colors"
                      title="Duplicate row"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(index)}
                        className="p-1 text-zinc-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
