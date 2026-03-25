"use client";

import { forwardRef } from "react";

const Button = forwardRef(function Button(
  { type = "button", className, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`bg-black text-white px-4 py-2 rounded-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
