"use client";

import mixpanel from "mixpanel-browser";
import { useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";

export default function RegistrationButtonModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          setOpen(true);
          mixpanel.track("Home CTA Register Modal Open");
        }}
        title="Become a Member"
      >
        Become a Member
      </Button>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          mixpanel.track("Home CTA Register Modal Close");
        }}
        id="home-registration-dialog"
        ariaLabelledBy="home-reg-heading"
        backdropAriaLabel="Close registration"
        panelClassName="max-h-[min(90vh,600px)] max-w-2xl"
      >
        <RegistrationForm idPrefix="home-reg-" />
      </Modal>
    </>
  );
}
