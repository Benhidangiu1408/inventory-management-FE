import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
export default function StatusBox() {
  return (
    <div className="flex items-center justify-center rounded-2xl bg-gray-200 p-1 text-sm">
      <FontAwesomeIcon color="green" className="mr-1" icon={faCircleCheck} />
      <span className="font-light">Completed</span>
    </div>
  );
}
