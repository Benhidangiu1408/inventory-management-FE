import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ActivityLog() {
  return (
    <div className="rounded-2xl border border-gray-200 p-6">
      <h2 className="mb-4 text-lg">Activity Logs</h2>
      <div>
        <div className="flex items-start gap-2">
          <FontAwesomeIcon icon={faCircle} className="text-gray-300" />
          <div className="mt-[-0.3rem]">
            <h3>Order Created</h3>
            <div className="text-gray-500">01/01/2025 12:00:00</div>
            <div className="text-gray-500">by John Doe</div>
          </div>
        </div>
      </div>
    </div>
  );
}
