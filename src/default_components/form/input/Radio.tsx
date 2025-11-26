import React, { forwardRef, InputHTMLAttributes } from "react";

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  small?: boolean;
  className?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    { label, id, className = "", small = false, disabled = false, ...props },
    ref,
  ) => {
    return (
      <label
        htmlFor={id}
        className={`group flex cursor-pointer items-center select-none ${
          small ? "gap-2 text-sm" : "gap-3 text-sm font-medium"
        } ${
          disabled
            ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
            : "text-gray-700 dark:text-gray-400"
        } ${className}`}
      >
        <div className="relative flex items-center justify-center">
          {/* 1. The Input (Peer) */}
          <input
            ref={ref}
            id={id}
            type="radio"
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />

          {/* 2. The Outer Circle (Sibling 1) */}
          <span
            className={`block rounded-full border transition-all ${
              small ? "h-4 w-4" : "h-5 w-5 border-[1.25px]"
            } ${
              disabled
                ? "border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700"
                : "border-gray-300 bg-transparent dark:border-gray-700"
            } ${
              !disabled &&
              "peer-checked:border-brand-500 peer-checked:bg-brand-500"
            }`}
          ></span>

          {/* 3. The Inner Dot (Sibling 2) - Positioned Absolutely */}
          <span
            className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-transform duration-200 ${
              small ? "h-1.5 w-1.5" : "h-2 w-2"
            } ${"scale-0 peer-checked:scale-100"}`}
          ></span>
        </div>

        {label}
      </label>
    );
  },
);

Radio.displayName = "Radio";

export default Radio;
