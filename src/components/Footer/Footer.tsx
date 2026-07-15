"use client";

import mixpanel from "mixpanel-browser";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/owner-resources", label: "Owner Resources" },
] as const;

const Footer = () => {
  return (
    <footer className="flex flex-col gap-8 max-w-8xl mx-6 md:mx-9 2xl:mx-auto items-start justify-between bg-black text-white rounded-[20px] md:rounded-[40px] p-6 my-6 md:flex-row md:items-center md:p-9 md:my-9">
      <div>
        <h4 className="md:mb-3">Houston Land Rovers</h4>

        <p className="text-white/75! italic">
          Houston-area club for Land Rover owners
        </p>
      </div>

      <div>
        <nav className="flex items-center justify-end gap-4 text-right mb-3">
          {footerLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() =>
                mixpanel.track("Footer Nav Click", {
                  "Nav Item": label,
                })
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        <p>© 2026 Houston Land Rovers</p>
      </div>
    </footer>
  );
};

export default Footer;
