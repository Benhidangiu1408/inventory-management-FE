"use client";

import React, { forwardRef, InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  hint?: string; // Added hint support
  error?: boolean; // Added error state support
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
      hint,
      error = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label
          className={`group flex cursor-pointer items-start gap-3 ${
            disabled ? "cursor-not-allowed opacity-60" : ""
          } ${className}`}
        >
          {/* Checkbox Input Wrapper */}
          <div className="relative flex h-5 items-center">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              disabled={disabled}
              className={`peer checked:bg-brand-500 focus:ring-brand-500/20 dark:checked:bg-brand-500 h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all duration-200 checked:border-transparent focus:ring-2 focus:outline-hidden disabled:cursor-not-allowed dark:bg-gray-900 ${
                error
                  ? "border-red-500 checked:bg-red-500 focus:ring-red-500/20"
                  : "border-gray-300 dark:border-gray-700"
              } `}
              {...props}
            />

            {/* Checkmark Icon */}
            <svg
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Label Content */}
          {(label || startIcon || endIcon) && (
            <div className="flex flex-col select-none">
              <span
                className={`flex items-center gap-2 text-sm font-medium ${error ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}
              >
                {startIcon}
                {label}
                {endIcon}
              </span>
            </div>
          )}
        </label>

        {/* Hint Text */}
        {hint && (
          <p
            className={`ml-8 text-xs ${error ? "text-red-500" : "text-gray-500"}`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
