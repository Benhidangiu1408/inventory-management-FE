import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ImportSummaryItemProps {
  title: string;
  value: number;
  icon: IconDefinition;
}

export default function SummaryItem({
  title,
  value,
  icon,
}: ImportSummaryItemProps) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-2xl bg-[#F2F4F7] p-5">
      <div>
        <div className="text-sm">{title}</div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
      <FontAwesomeIcon icon={icon} className="text-5xl" />
    </div>
  );
}
