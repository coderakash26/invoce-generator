import { InvoiceStatus } from "@/lib/types/invoice";
import { CheckCircle2, Clock3, AlertCircle, FileEdit, Send, XCircle } from "lucide-react";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  showIcon?: boolean;
  className?: string;
}

export function InvoiceStatusBadge({
  status,
  showIcon = true,
  className = "",
}: InvoiceStatusBadgeProps) {
  switch (status) {
    case "paid":
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 ${className}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          <span>Paid</span>
        </span>
      );
    case "partially_paid":
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 ${className}`}>
          {showIcon && <Clock3 className="w-3.5 h-3.5 text-blue-600" />}
          <span>Partial</span>
        </span>
      );
    case "overdue":
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 ${className}`}>
          {showIcon && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
          <span>Overdue</span>
        </span>
      );
    case "sent":
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 ${className}`}>
          {showIcon && <Send className="w-3.5 h-3.5 text-indigo-600" />}
          <span>Sent</span>
        </span>
      );
    case "cancelled":
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 line-through ${className}`}>
          {showIcon && <XCircle className="w-3.5 h-3.5 text-zinc-400" />}
          <span>Cancelled</span>
        </span>
      );
    case "draft":
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 ${className}`}>
          {showIcon && <FileEdit className="w-3.5 h-3.5 text-zinc-500" />}
          <span>Draft</span>
        </span>
      );
  }
}
