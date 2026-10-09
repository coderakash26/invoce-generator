import { format, parseISO, isValid } from "date-fns";

export function getTodayDateString(): string {
  if (typeof window === "undefined") {
    return "2026-03-31";
  }
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export function addDaysToDate(dateString: string, days: number): string {
  const date = parseISO(dateString);
  if (!isValid(date)) return getTodayDateString();
  const res = new Date(date);
  res.setDate(res.getDate() + days);
  return res.toISOString().split("T")[0];
}

export function formatDateDisplay(dateString?: string, formatPattern: string = "MMM dd, yyyy"): string {
  if (!dateString) return "—";
  try {
    const parsed = parseISO(dateString);
    if (!isValid(parsed)) return dateString;
    return format(parsed, formatPattern);
  } catch {
    return dateString;
  }
}

export function isPastDueDate(dueDateString: string): boolean {
  if (!dueDateString) return false;
  const today = getTodayDateString();
  return dueDateString < today;
}
