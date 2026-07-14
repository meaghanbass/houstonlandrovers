"use client";

import {
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type Ref,
} from "react";
import { useInView } from "@/hooks/useInView";

type Direction = "left" | "right" | "up" | "down" | "none";

const hiddenByDirection: Record<Direction, string> = {
  left: "-translate-x-24",
  right: "translate-x-24",
  up: "translate-y-6",
  down: "-translate-y-6",
  none: "",
};

type AnimateInViewProps = {
  children: ReactElement<{
    className?: string;
    style?: CSSProperties;
    ref?: Ref<HTMLElement>;
  }>;
  /** Slide direction when entering. Use `"none"` for no movement. */
  direction?: Direction;
  /** Fade from transparent to opaque. Defaults to `true`. */
  fade?: boolean;
  /** Delay before the enter animation starts, in milliseconds. */
  delay?: number;
  className?: string;
  threshold?: number;
  rootMargin?: string;
};

export default function AnimateInView({
  children,
  direction = "none",
  fade = true,
  delay = 0,
  className = "",
  threshold,
  rootMargin,
}: AnimateInViewProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold, rootMargin });

  if (!isValidElement(children)) {
    return children;
  }

  const hidden = [
    fade && "opacity-0",
    direction !== "none" && hiddenByDirection[direction],
  ]
    .filter(Boolean)
    .join(" ");

  const visible = [
    fade && "opacity-100",
    direction !== "none" && "translate-x-0 translate-y-0",
  ]
    .filter(Boolean)
    .join(" ");

  return cloneElement(children, {
    ref,
    className: [
      children.props.className,
      "transition duration-1000 ease-out",
      inView ? visible : hidden,
      className,
    ]
      .filter(Boolean)
      .join(" "),
    style: {
      ...children.props.style,
      ...(delay > 0 ? { transitionDelay: `${delay}ms` } : null),
    },
  });
}
