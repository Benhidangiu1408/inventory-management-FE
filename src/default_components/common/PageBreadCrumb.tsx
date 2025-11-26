"use client";
import Link from "next/link";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface BreadcrumbProps {
  pageTitle: string;
  filters?: string[]; // Paths you want to hide (e.g., "dashboard" if it's redundant)
  status?: ReactNode; // A badge or icon to show next to the title
}

const chevron = (
  <svg
    className="stroke-current"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
      stroke=""
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  filters = [],
  status = null,
}) => {
  const path = usePathname();
  const pathSegments = path
    .split("/")
    .filter((segment) => segment !== "")
    .slice(0, -1);
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      {/* Title Section */}
      <div className={"flex items-center gap-3"}>
        <h2 className="default-text text-xl font-semibold">{pageTitle}</h2>
        {status && <div>{status}</div>}
      </div>
      {/* Breadcrumb */}
      <nav>
        <ol className="flex items-center gap-1.5">
          {/* Home Link */}
          <li>
            <Link
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              href="/"
            >
              Home
              {chevron}
            </Link>
          </li>
          {pathSegments.map((segment, idx) => {
            if (filters.includes(segment)) return null;
            const href = `/${pathSegments.slice(0, idx + 1).join("/")}`;
            return (
              <li key={idx}>
                <Link
                  className="flex items-center gap-1.5 text-sm text-gray-500 capitalize dark:text-gray-400"
                  href={href}
                >
                  {segment.replace(/[-_]/g, " ")}
                  {chevron}
                </Link>
              </li>
            );
          })}
          <li className="default-text text-sm">{pageTitle}</li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
