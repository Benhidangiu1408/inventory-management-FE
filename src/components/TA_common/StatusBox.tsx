import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faClock } from "@fortawesome/free-regular-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FaultOrderStatus } from "@/interfaces/inventoryManagementType";

interface StatusBoxProps {
  status?: FaultOrderStatus;
}

const STATUS_CONFIG: Record<
  FaultOrderStatus,
  { label: string; icon: IconDefinition; color: string }
> = {
  COMPLETED: {
    label: "Completed",
    icon: faCircleCheck,
    color: "text-green-600",
  },
  PENDING: { label: "Pending", icon: faClock, color: "text-yellow-500" },
  "IN_PROGRESS": {
    label: "In-Progress",
    icon: faSpinner,
    color: "text-blue-500",
  },
};

export default function StatusBox({ status = "COMPLETED" as FaultOrderStatus }: StatusBoxProps) {
  const { label, icon, color } = STATUS_CONFIG[status];

  return (
    <div className="flex items-center justify-center rounded-2xl bg-gray-200 p-2 text-sm">
      <FontAwesomeIcon className={`mr-1 ${color}`} icon={icon} />
      <span className="font-light">{label}</span>
    </div>
  );
}
