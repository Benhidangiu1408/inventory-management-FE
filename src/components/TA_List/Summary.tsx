import {
  faCubes,
  faFileLines,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ImportSummaryItemProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  textColor?: string;
}

interface SummaryItem {
  title: string;
  value: string | number;
  icon: IconDefinition;
  render?: (value: SummaryItem) => ReactNode;
}

const SummaryItem = ({
  title,
  value,
  icon,
  textColor = "text-brand-500",
}: ImportSummaryItemProps) => {
  return (
    <div
      className={`${textColor} flex flex-1 items-center justify-between rounded-2xl border p-5`}
    >
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
  ];

  return (
    <div className="flex justify-between gap-4">
      {importSummaryItems.map((item) => (
        <SummaryItem key={item.title} {...item} />
      ))}
    </div>
  );
}
