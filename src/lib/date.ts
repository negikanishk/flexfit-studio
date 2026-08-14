import { format, parseISO, isAfter, isBefore, differenceInHours } from "date-fns";

export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return "N/A";
  try {
    return format(parseISO(isoString), "MMM d, yyyy h:mm a");
  } catch {
    return isoString;
  }
}

export function formatDateOnly(isoString: string | null | undefined): string {
  if (!isoString) return "N/A";
  try {
    return format(parseISO(isoString), "MMM d, yyyy");
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(isoString: string | null | undefined): string {
  if (!isoString) return "N/A";
  try {
    return format(parseISO(isoString), "h:mm a");
  } catch {
    return isoString;
  }
}

export function isUpcoming(isoString: string): boolean {
  return isAfter(parseISO(isoString), new Date());
}

export function isPast(isoString: string): boolean {
  return isBefore(parseISO(isoString), new Date());
}

export function hoursUntilClass(isoString: string): number {
  return differenceInHours(parseISO(isoString), new Date());
}
