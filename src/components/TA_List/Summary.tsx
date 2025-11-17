import {
  faCubes,
  faDollarSign,
  faFileLines,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ImportSummaryItemProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
}

interface SummaryItem {
  title: string;
  value: string | number;
  icon: IconDefinition;
  render?: (value: SummaryItem) => ReactNode;
}

const SummaryItem = ({ title, value, icon }: ImportSummaryItemProps) => {
  return (
    <div className="flex flex-1 items-center justify-between rounded-2xl bg-[#F2F4F7] p-5">
      <div>
        <div className="text-sm">{title}</div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
      <FontAwesomeIcon icon={icon} className="text-5xl" />
    </div>
  );
};

export default function Summary() {
  const importSummaryItems: SummaryItem[] = [
    {
      title: "Total Stock-Ins",
      value: 100,
      icon: faCubes,
    },
    {
      title: "Pending Approvals",
      value: 23,
      icon: faFileLines,
    },
    {
      title: "Total Value",
      value: 2456789,
      icon: faDollarSign,
      render: (item) => {
        const formattedValue: string = item.value.toLocaleString();
        return (
          <SummaryItem
            key={item.title}
            title={item.title}
            value={formattedValue}
            icon={item.icon}
          />
        );
      },
    },
  ];

  return (
    <div className="flex justify-between gap-4 border-b border-gray-200 p-6">
      {importSummaryItems.map((item) =>
        item.render ? (
          item.render(item)
        ) : (
          <SummaryItem key={item.title} {...item} />
        ),
      )}
    </div>
  );
}
