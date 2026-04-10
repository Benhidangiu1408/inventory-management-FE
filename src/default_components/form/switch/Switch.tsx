"use client";
import { InputHTMLAttributes, forwardRef } from "react";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string; // Made optional in case you only want the visual toggle
  color?: "blue" | "gray";
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    { label, disabled = false, color = "blue", className = "", ...props },
    ref,
  ) => {
    // Determine the active background color based on the prop
    const activeBgClass =
      color === "blue"
        ? "peer-checked:bg-brand-500" // Assuming your brand-500 is your blue
        : "peer-checked:bg-gray-800 dark:peer-checked:bg-white/10";

    return (
      <label
        className={`relative inline-flex cursor-pointer items-center gap-3 text-sm font-medium ${
          disabled
            ? "pointer-events-none text-gray-400"
            : "text-gray-700 dark:text-gray-400"
        } ${className}`}
      >
        {/* Hidden native checkbox for react-hook-form to hook into */}
        <input
          type="checkbox"
          className="peer sr-only"
          disabled={disabled}
          ref={ref}
          {...props}
        />

        {/* Visual Switch Background & Knob */}
        <div
          className={`peer-focus:ring-brand-500/30 h-6 w-11 shrink-0 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-focus:ring-2 peer-focus:outline-none dark:bg-white/10 ${activeBgClass} after:shadow-theme-sm after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:content-[''] peer-checked:after:translate-x-full`}
        ></div>

        {/* Label Text */}
        {label && <span>{label}</span>}
      </label>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
