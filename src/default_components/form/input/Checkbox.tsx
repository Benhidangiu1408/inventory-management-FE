import type React from "react";
import { forwardRef, InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      id,
      className = "",
      disabled = false,
      startIcon = null,
      endIcon = null,
      ...props
    },
    ref,
  ) => {
    return (
      <label
        className={`group flex cursor-pointer items-center space-x-3 ${
          disabled ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        <div className="relative h-5 w-5">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={`peer checked:bg-brand-500 h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 checked:border-transparent disabled:opacity-60 dark:border-gray-700 ${className}`}
            disabled={disabled}
            {...props}
          />
          <svg
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke={disabled ? "#E4E7EC" : "white"}
              strokeWidth="1.94437"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {label && (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
            {startIcon}
            {label}
            {endIcon}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
