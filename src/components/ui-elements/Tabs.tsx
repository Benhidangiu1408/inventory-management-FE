"use client";

import { FC, ReactNode, useState } from "react";

type TabHeader = {
  title: string;
};
interface TabProp {
  tabHeaders: TabHeader[];
  tabContents: ReactNode[];
}

const DefaultTab: FC<TabProp> = ({ tabHeaders, tabContents }: TabProp) => {
  const [openTab, setOpenTab] = useState(0);
  const [visitedTabs, setVisitedTabs] = useState<Set<number>>(new Set([0]));

  const activeClasses =
    "bg-white text-gray-900 shadow-theme-xs dark:bg-white/[0.03] dark:text-white";
  const inactiveClasses =
    "bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200";

  return (
    <div>
      {/* Tab Header */}
      <div className="rounded-t-xl border border-gray-200 p-3 dark:border-gray-800">
        <nav className="flex overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-900 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-white dark:[&::-webkit-scrollbar-track]:bg-transparent">
          {tabHeaders.map((tab, idx) => (
            <button
              onClick={() => {
                setOpenTab(idx);
                setVisitedTabs((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(idx);
                  return newSet;
                });
              }}
              key={idx}
              className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${openTab === idx ? activeClasses : inactiveClasses}`}
            >
              {tab.title}
            </button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="rounded-b-xl border border-t-0 border-gray-200 p-6 pt-4 dark:border-gray-800">
        {tabContents.map((content, idx) => {
          if (!visitedTabs.has(idx)) return null;
          return (
            <div
              key={idx}
              className={
                openTab === idx ? "animate-in fade-in block" : "hidden"
              }
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DefaultTab;
