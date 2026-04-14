"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

export interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selected = [],
  onChange,
  disabled = false,
  placeholder = "Select options...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: string) => {
    const newSelectedOptions = selected.includes(optionValue)
      ? selected.filter((value) => value !== optionValue)
      : [...selected, optionValue];

    onChange(newSelectedOptions);
  };

  const removeOption = (e: React.MouseEvent, valueToRemove: string) => {
    e.stopPropagation(); // Prevents the dropdown from toggling when clicking 'X'
    const newSelectedOptions = selected.filter((val) => val !== valueToRemove);
    onChange(newSelectedOptions);
  };

  // 2. Map selected string values to their full Option objects for the UI pills
  const selectedOptionsData = useMemo(() => {
    return selected.map((val) => {
      const found = options.find((opt) => opt.value === val);
      return found || { value: val, text: val };
    });
  }, [selected, options]);

  return (
    <div className="w-full" ref={dropdownRef}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      <div className="relative z-20 inline-block w-full">
        <div className="relative flex flex-col items-center">
          {/* Main Input Box */}
          <div onClick={toggleDropdown} className="w-full">
            <div
              className={`mb-2 flex min-h-[44px] w-full cursor-pointer rounded-lg border border-gray-300 py-1.5 pr-3 pl-3 transition outline-none dark:border-gray-700 dark:bg-gray-900 ${
                isOpen ? "border-brand-300 ring-brand-300/20 ring-4" : ""
              } ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-gray-400 dark:hover:border-gray-600"}`}
            >
              <div className="flex flex-auto flex-wrap gap-2">
                {selectedOptionsData.length > 0 ? (
                  selectedOptionsData.map((opt) => (
                    <div
                      key={opt.value}
                      className="group flex items-center justify-center rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pr-2 pl-2.5 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-700"
                    >
                      <span className="max-w-full flex-initial">
                        {opt.text}
                      </span>
                      <div className="flex flex-auto flex-row-reverse">
                        <div
                          onClick={(e) => removeOption(e, opt.value)}
                          className="cursor-pointer pl-2 text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                        >
                          <svg
                            className="fill-current"
                            role="button"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="p-1 text-sm text-gray-400 dark:text-gray-500">
                    {placeholder}
                  </span>
                )}
              </div>
              <div className="flex w-7 items-center py-1 pr-1 pl-1">
                <div className="h-5 w-5 text-gray-500 dark:text-gray-400">
                  <svg
                    className={`stroke-current transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              className="absolute top-[105%] left-0 z-40 max-h-[250px] w-full overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col py-1">
                {options.length === 0 ? (
                  <div className="p-3 text-center text-sm text-gray-500">
                    No options available
                  </div>
                ) : (
                  options.map((option) => {
                    const isSelected = selected.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        className={`w-full cursor-pointer px-3 py-2 text-sm transition-colors ${
                          isSelected
                            ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => handleSelect(option.value)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.text}</span>
                          {isSelected && (
                            <span className="text-brand-500 font-bold">✓</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
