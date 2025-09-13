import {
  faCubes,
  faDollarSign,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import SummaryItem from "./SummaryItem";

export default function Summary() {
  const importSummaryItems = [
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
    },
  ];

  return (
    <div className="flex justify-between gap-4 border-b border-gray-200 p-6">
      {importSummaryItems.map((item) => (
        <SummaryItem key={item.title} {...item} />
      ))}
    </div>
  );
}
