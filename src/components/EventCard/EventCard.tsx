"use client";

import mixpanel from "mixpanel-browser";
import { downloadIcs } from "@/lib/ical";

export type EventCardProps = {
  calendarSlug?: string;
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  address?: string;
  mapLink?: string;
  description?: string;
};

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M12 14v4M10 16h4" />
    </svg>
  );
}

const EventCard = ({
  calendarSlug,
  title,
  date,
  time,
  location,
  address,
  mapLink,
  description,
}: EventCardProps) => {
  function trackAddToCalendar() {
    if (!title || !date) return;
    mixpanel.track("Event Add to Calendar Click", {
      "Event Title": title,
      "Event Date": date,
    });
  }

  function handleAddToCalendar() {
    if (!title || !date) return;
    trackAddToCalendar();
    downloadIcs({ title, date, time, location, address, description });
  }

  return (
    <div className="relative border border-gray-300 p-4 mb-6">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h5 className="text-lg font-bold">{title}</h5>

        {title &&
          date &&
          (calendarSlug ? (
            <a
              href={`/events/calendar/${calendarSlug}.ics`}
              onClick={trackAddToCalendar}
              className="shrink-0 text-gray-500 transition-colors cursor-pointer hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              aria-label={`Add ${title} to calendar`}
              title="Add to calendar"
            >
              <CalendarIcon />
            </a>
          ) : (
            <button
              type="button"
              onClick={handleAddToCalendar}
              className="shrink-0 text-gray-500 transition-colors cursor-pointer hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              aria-label={`Add ${title} to calendar`}
              title="Add to calendar"
            >
              <CalendarIcon />
            </button>
          ))}
      </div>

      <p className="text-sm text-gray-500">
        <b>Date</b>: {date}
      </p>

      {time && (
        <p className="text-sm text-gray-500">
          <b>Time</b>: {time}
        </p>
      )}

      {location && (
        <p className="text-sm text-gray-500">
          <b>Location</b>: {location}
        </p>
      )}

      {address && (
        <p className="text-sm text-gray-500">
          <b>Address</b>:{" "}
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              mixpanel.track("Event Map Link Click", {
                "Event Title": title,
                "Event Address": address,
                "Map URL": mapLink,
              })
            }
          >
            {address}
          </a>
        </p>
      )}

      {/* {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )} */}
    </div>
  );
};

export default EventCard;
