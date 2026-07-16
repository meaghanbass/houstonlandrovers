import type { EventCardProps } from "@/components/EventCard/EventCard";

export type Event = Omit<EventCardProps, "calendarSlug" | "title" | "date"> & {
  calendarSlug: string;
  title: string;
  date: string;
};

export const events: Event[] = [
  {
    calendarSlug: "coffee-rovers-july-25",
    title: "☕️ Coffee & Rovers",
    date: "July 25th 2026",
    time: "10:00 AM",
    location: "Tenfold Coffee Company - Heights",
    address: "101 Aurora St, Houston, TX 77008",
    mapLink: "https://maps.app.goo.gl/2YQDQFQDGLtbxi5f9",
    description:
      "Join us for a morning of coffee and camaraderie at a local coffee shop. We'll have a chance to chat, share stories, and get to know each other. This is a great opportunity to meet other Land Rover owners and enthusiasts in the Houston area.",
  },
  {
    calendarSlug: "coffee-rovers-august-8",
    title: "☕️ Coffee & Rovers",
    date: "August 8th 2026",
    time: "10:00 AM",
    location: "Tiny's Milk & Cookies - West U",
    address: "3636 Rice Boulevard, Houston, TX 77005",
    mapLink: "https://maps.app.goo.gl/C7mvTgSBchcRUyEUA",
    description:
      "Join us for a morning of coffee and camaraderie at a local coffee shop. We'll have a chance to chat, share stories, and get to know each other. This is a great opportunity to meet other Land Rover owners and enthusiasts in the Houston area.",
  },
  {
    calendarSlug: "coffee-rovers-august-22",
    title: "☕️ Coffee & Rovers",
    date: "August 22nd 2026",
    time: "10:00 AM",
    location: "Campesino Coffee",
    address: "2602 Waugh Dr, Houston, TX 77006",
    mapLink: "https://maps.app.goo.gl/RjVxo1WnExitSwDz6",
    description:
      "Join us for a morning of coffee and camaraderie at a local coffee shop. We'll have a chance to chat, share stories, and get to know each other. This is a great opportunity to meet other Land Rover owners and enthusiasts in the Houston area.",
  },
];
