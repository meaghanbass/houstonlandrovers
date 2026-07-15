function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Format a Date as floating local time (YYYYMMDDTHHMMSS). */
function formatIcsDate(date: Date): string {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

/**
 * Parses display strings like "July 25th 2026" and "10:00 AM"
 * into a Date in the user's local timezone.
 */
export function parseEventDateTime(
  date: string,
  time?: string,
): Date | null {
  const cleanedDate = date.replace(/(\d+)(st|nd|rd|th)/i, "$1");
  const combined = time ? `${cleanedDate} ${time}` : cleanedDate;
  const parsed = new Date(combined);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export type IcalEventInput = {
  title: string;
  date: string;
  time?: string;
  location?: string;
  address?: string;
  description?: string;
  /** Duration in minutes; defaults to 90. */
  durationMinutes?: number;
};

export function buildIcsContent({
  title,
  date,
  time,
  location,
  address,
  description,
  durationMinutes = 90,
}: IcalEventInput): string | null {
  const start = parseEventDateTime(date, time);
  if (!start) return null;

  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const stamp = formatIcsDate(new Date());
  const uid = `${start.getTime()}-${title.replace(/\s+/g, "-").toLowerCase()}@houstonlandrovers.com`;
  // Street address only — Apple Calendar geocodes LOCATION and offers
  // Apple Maps / Google Maps when the user taps it.
  const locationValue = address || location || "";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Houston Land Rovers//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
  ];

  if (locationValue) {
    lines.push(`LOCATION:${escapeIcsText(locationValue)}`);
  }

  if (description) {
    lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR", "");

  return lines.join("\r\n");
}

export function downloadIcs(input: IcalEventInput): boolean {
  const content = buildIcsContent(input);
  if (!content) return false;

  const filename =
    `${input.title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-") || "event"}.ics`;

  const blob = new Blob([content], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
