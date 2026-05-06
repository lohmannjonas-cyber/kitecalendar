import { format, isAfter, isBefore, isSameDay, parseISO } from "date-fns";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatDateRange(start: string | Date, end: string | Date) {
  const startDate = typeof start === "string" ? parseISO(start) : start;
  const endDate = typeof end === "string" ? parseISO(end) : end;

  if (isSameDay(startDate, endDate)) {
    return format(startDate, "MMM d, yyyy");
  }

  if (format(startDate, "MMM yyyy") === format(endDate, "MMM yyyy")) {
    return `${format(startDate, "MMM d")} - ${format(endDate, "d, yyyy")}`;
  }

  return `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
}

export function isWithinNextDays(startDate: string, days: number, now = new Date()) {
  const start = parseISO(startDate);
  const upper = new Date(now);
  upper.setDate(upper.getDate() + days);
  return (isAfter(start, now) || isSameDay(start, now)) && (isBefore(start, upper) || isSameDay(start, upper));
}

export function distanceKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
) {
  const earthRadiusKm = 6371;
  const latDelta = degreesToRadians(to.latitude - from.latitude);
  const lonDelta = degreesToRadians(to.longitude - from.longitude);
  const fromLat = degreesToRadians(from.latitude);
  const toLat = degreesToRadians(to.latitude);

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function parseNumber(value: string | string[] | undefined) {
  const first = Array.isArray(value) ? value[0] : value;
  if (!first) return undefined;
  const parsed = Number(first);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseString(value: string | string[] | undefined) {
  const first = Array.isArray(value) ? value[0] : value;
  return first?.trim() || undefined;
}

export function parseStringArray(value: string | string[] | undefined) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values.map((item) => item.trim()).filter(Boolean);
}
