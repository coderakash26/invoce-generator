import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-12 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 mb-4 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-zinc-900 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
