import type { Metadata } from "next";
import EventCard from "@/components/EventCard/EventCard";
import RegistrationButtonModal from "@/components/RegistrationButtonModal/RegistrationButtonModal";
import type { EventCardProps } from "@/components/EventCard/EventCard";

export const metadata: Metadata = {
  title: "Events | Houston Land Rovers",
  description: "Upcoming meets, drives, and events for Houston Land Rovers.",
};

const events: EventCardProps[] = [
  {
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

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-16 pt-24 md:px-10 md:pt-48">
      <div className="text-center text-balance">
        <h1>Events</h1>

        <p className="mt-4">
          We&apos;re currently planning some events for Summer/Fall 2026.
        </p>

        <p className="mt-4">
          Take a sneak peak below at what we&apos;re planning - but check back
          soon for more details.
        </p>

        <p className="mt-4">
          In the meantime, register your interest below to be the first to know
          about upcoming events. Feel free to pitch us ideas for events
          you&apos;d like to see!
        </p>

        <div className="mt-8">
          <RegistrationButtonModal />
        </div>
      </div>

      <hr className="my-10 border-gray-300" />

      <h3 className="mt-8">Upcoming Events</h3>

      <ul className="mt-4">
        {events.map((event, i) => (
          <li key={i}>
            <EventCard {...event} />
          </li>
        ))}
      </ul>
    </div>
  );
}
