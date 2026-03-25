"use client";

import {
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
} from "react";

/** Shared error box — use for form-level alerts too */
export const fieldErrorClass =
  "mt-2 block w-full max-w-md rounded-md border border-red-400/70 bg-red-50 px-3 py-2 text-sm font-medium leading-snug text-red-900 shadow-sm";

function RequiredAsterisk() {
  return (
    <abbr
      title="required"
      className="ml-0.5 font-semibold text-red-600 no-underline"
    >
      *
    </abbr>
  );
}

const focusSoft =
  "outline-none transition-shadow duration-200 ease-out shadow-none " +
  "focus:shadow-[0_0_0_2px_rgba(97,108,98,0.2),0_0_8px_4px_rgba(97,108,98,0.12),0_0_20px_8px_rgba(97,108,98,0.06)]";
const inputClassDefault = `w-full rounded-xs border border-gray-300 focus:border-black p-2 ${focusSoft}`;
const textareaClassDefault = `w-full resize-y rounded-xs border border-gray-300 focus:border-black p-2 ${focusSoft}`;

type OwnInputProps = {
  as?: "input" | "textarea";
  id: string;
  name?: string;
  label: ReactNode;
  required?: boolean;
  htmlRequired?: boolean;
  error?: string | null;
  rows?: number;
  inputClassName?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

type InputProps = OwnInputProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    keyof OwnInputProps | "ref"
  >;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  function Input(
    {
      as = "input",
      id,
      name,
      label,
      required = false,
      htmlRequired = false,
      error,
      type = "text",
      rows = 4,
      placeholder,
      autoComplete,
      value,
      onChange,
      className = "",
      inputClassName = "",
      ...rest
    },
    ref
  ) {
    const errorId = error ? `${id}-error` : undefined;
    const baseControl =
      as === "textarea" ? textareaClassDefault : inputClassDefault;
    const controlClass = inputClassName
      ? `${baseControl} ${inputClassName}`.trim()
      : baseControl;

    const common = {
      id,
      name,
      className: controlClass,
      "aria-invalid": error ? ("true" as const) : undefined,
      "aria-describedby": errorId,
      "aria-required": required ? ("true" as const) : undefined,
      placeholder,
      autoComplete,
      ...(value !== undefined ? { value, onChange } : {}),
      ...(htmlRequired ? { required: true as const } : {}),
      ...rest,
    };

    return (
      <div
        className={
          className ? `flex flex-col gap-2 ${className}` : "flex flex-col gap-2"
        }
      >
        <label htmlFor={id} className="font-mono text-sm">
          {label}
          {required ? <RequiredAsterisk /> : null}
        </label>
        {as === "textarea" ? (
          <textarea
            ref={ref as Ref<HTMLTextAreaElement>}
            rows={rows}
            {...(common as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as Ref<HTMLInputElement>}
            type={type}
            {...(common as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error ? (
          <div id={errorId} className={fieldErrorClass} role="alert">
            {error}
          </div>
        ) : null}
      </div>
    );
  }
);

export default Input;
