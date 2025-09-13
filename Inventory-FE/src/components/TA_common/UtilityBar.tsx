import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../ui/button/Button";
import {
  faCircleCheck,
  faFileExport,
  faPrint,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function UtilityBar() {
  return (
    <div className="flex justify-between rounded-2xl border border-gray-200 p-6">
      <div className="flex gap-3">
        <Button
          size="sm"
          variant="primary"
          startIcon={<FontAwesomeIcon icon={faCircleCheck} />}
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="primary"
          startIcon={<FontAwesomeIcon icon={faPrint} />}
        >
          Print
        </Button>
        <Button
          size="sm"
          variant="primary"
          startIcon={<FontAwesomeIcon icon={faFileExport} />}
        >
          Export
        </Button>
      </div>
      <Button
        size="sm"
        variant="outline"
        startIcon={<FontAwesomeIcon icon={faTrash} />}
      >
        Delete
      </Button>
    </div>
  );
}
