"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";
import ContactForm from "@/components/ContactForm/ContactForm";
import Modal from "@/components/Modal/Modal";
import Logo from "@/components/Logo/Logo";

const navLinks = [
  { href: "/events/", label: "Events" },
  { href: "/owner-resources/", label: "Owner Resources" },
];

const HOME_SCROLL_LIGHT_THRESHOLD_PX = 500;

const contactNavClassMobile =
  "block w-full rounded-md px-3 py-3 text-left text-lg font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:bg-neutral-100";

const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [homeScrollLight, setHomeScrollLight] = useState(true);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      setHomeScrollLight(window.scrollY < HOME_SCROLL_LIGHT_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const useLightBrand = isHome && homeScrollLight;
  const desktopNavTone = useLightBrand ? "text-white" : "text-black";
  const desktopNavLinkClass = `font-semibold uppercase opacity-100 transition-opacity hover:opacity-70 ${desktopNavTone}`;
  const desktopNavButtonClass = `${desktopNavLinkClass} cursor-pointer`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    if (menuOpen || registrationOpen || contactOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, registrationOpen, contactOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-colors duration-200 ${
        useLightBrand ? "bg-transparent" : "bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="flex shrink-0 items-center">
          <Logo
            theme={useLightBrand ? "white" : "black"}
            className="w-[175px] md:w-[200px]"
          />
        </Link>

        <div className="flex items-center gap-3 md:gap-8">
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href + label}
                href={href}
                className={desktopNavLinkClass}
              >
                {label}
              </Link>
            ))}

            <button
              type="button"
              className={desktopNavButtonClass}
              onClick={() => setContactOpen(true)}
            >
              Contact
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setRegistrationOpen(true)}
            className={`shrink-0 ${desktopNavButtonClass}`}
          >
            Register
          </button>

          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center cursor-pointer md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Open menu"
          >
            <svg
              className={`h-6 w-6 ${desktopNavTone}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      <Modal
        open={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
        id="registration-dialog"
        ariaLabelledBy="header-reg-heading"
        backdropAriaLabel="Close registration"
        panelClassName="max-h-[min(90vh,40rem)] max-w-2xl"
      >
        <RegistrationForm idPrefix="header-reg-" />
      </Modal>

      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        id="contact-dialog"
        ariaLabelledBy="header-contact-heading"
        backdropAriaLabel="Close contact form"
        panelClassName="max-h-[min(90vh,36rem)] max-w-lg"
      >
        <ContactForm idPrefix="header-contact-" className="scroll-mt-0 p-0" />
      </Modal>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-100 md:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
        />
        <nav
          className={`absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-neutral-200 bg-white shadow-xl transition-transform duration-200 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-end border-b border-neutral-100 px-4 py-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center cursor-pointer"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <ul className="flex flex-col gap-1 p-4">
            {navLinks.map(({ href, label }) => (
              <li key={href + label}>
                <Link
                  href={href}
                  className="block rounded-md px-3 py-3 text-lg font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:bg-neutral-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                className={contactNavClassMobile}
                onClick={() => {
                  setMenuOpen(false);
                  setContactOpen(true);
                }}
              >
                Contact
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
