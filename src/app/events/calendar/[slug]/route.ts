import { events } from "@/data/events";
import { buildIcsContent, getIcsFilename } from "@/lib/ical";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug: requestedSlug } = await params;
  const slug = requestedSlug.replace(/\.ics$/i, "");
  const event = events.find((item) => item.calendarSlug === slug);

  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  const content = buildIcsContent(event);

  if (!content) {
    return new Response("Invalid event date", { status: 500 });
  }

  return new Response(content, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      "Content-Disposition": `attachment; filename="${getIcsFilename(event.title)}"`,
      "Content-Type": "text/calendar; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
