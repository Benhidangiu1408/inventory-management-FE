"use client";
import React, { SelectHTMLAttributes, forwardRef } from "react";

export interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  placeholder?: string;
  className?: string;
  disablePlaceholderOpt?: boolean;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      placeholder = "Select an option",
      className = "",
      disablePlaceholderOpt = true,
      disabled = false,
      success = false,
      error = false,
      hint,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`${disabled ? "opacity-50" : ""}`}>
        <select
          ref={ref}
          disabled={disabled}
          className={`h-11 w-full px-4 py-2.5 pr-11 text-sm placeholder:text-gray-400 ${
            props.value !== "" && props.defaultValue !== ""
              ? "text-gray-800 dark:text-white/90"
              : "text-gray-400 dark:text-gray-500"
          } focus:ring-brand-500/10 focus:border-brand-300 dark:focus:border-brand-800 cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 ${className} `
            .replace(/\s+/g, " ")
            .trim()}
          {...props}
        >
          {/* Placeholder option */}
          <option
            value=""
            disabled={disablePlaceholderOpt}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {placeholder}
          </option>
          {/* Map over options */}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
            >
              {option.label}
            </option>
          ))}
        </select>
        {hint && (
          <p
            className={`mt-1.5 text-xs ${
              error
                ? "text-error-500"
                : success
                  ? "text-success-500"
                  : "text-gray-500"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
