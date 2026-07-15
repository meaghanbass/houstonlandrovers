"use client";

import mixpanel from "mixpanel-browser";

type TrackedExternalLinkProps = {
  href: string;
  name: string;
  category: string;
  className?: string;
};

export default function TrackedExternalLink({
  href,
  name,
  category,
  className = "link",
}: TrackedExternalLinkProps) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        mixpanel.track("Owner Resource Link Click", {
          "Resource Name": name,
          "Resource Category": category,
          "Resource URL": href,
        })
      }
    >
      {name}
    </a>
  );
}
