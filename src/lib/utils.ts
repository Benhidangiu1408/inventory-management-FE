import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export type FlexibleDateInput = Date | string | number | null | undefined;

/**
 * Parses a variety of date string formats (ISO, `DD-MM-YYYY`, `DD-MM-YYYY HH:mm`) into Date objects.
 */
export function parseFlexibleDate(input: FlexibleDateInput): Date | null {
  if (input === null || input === undefined) {
    return null;
  }

  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : new Date(input.getTime());
  }

  if (typeof input === "number") {
    const numericDate = new Date(input);
    return Number.isNaN(numericDate.getTime()) ? null : numericDate;
  }

  const trimmed = String(input).trim();
  if (!trimmed) {
    return null;
  }

  let normalized = trimmed.replace(/\//g, "-");

  const dayFirstMatch = normalized.match(
    /^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/,
  );

  if (dayFirstMatch) {
    const [, day, month, year, hour = "00", minute = "00", second = "00"] =
      dayFirstMatch;
    normalized = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  } else if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(normalized)) {
    normalized = normalized.replace(" ", "T");
  }

  const parsedTimestamp = Date.parse(normalized);
  if (Number.isNaN(parsedTimestamp)) {
    return null;
  }

  return new Date(parsedTimestamp);
}

export function normalizeDateToBoundary(date: Date, boundary: "start" | "end") {
  const normalized = new Date(date);

  if (boundary === "start") {
    normalized.setHours(0, 0, 0, 0);
  } else {
    normalized.setHours(23, 59, 59, 999);
  }

  return normalized;
}

export function isDateWithinRange(
  date: Date | null,
  range: { from?: Date; to?: Date },
): boolean {
  if (!date) {
    return false;
  }

  const { from, to } = range;
  if (!from && !to) {
    return true;
  }

  if (from && date < normalizeDateToBoundary(from, "start")) {
    return false;
  }

  if (to && date > normalizeDateToBoundary(to, "end")) {
    return false;
  }

  return true;
}
