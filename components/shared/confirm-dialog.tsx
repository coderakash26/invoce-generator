"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-md w-full p-6 overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isDestructive ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"
              }`}
            >
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-zinc-900 leading-snug">{title}</h3>
              <p className="text-sm text-zinc-500 mt-1">{message}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-zinc-400 hover:text-zinc-600 p-1 -mr-2 -mt-2"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-xs ${
                isDestructive
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
