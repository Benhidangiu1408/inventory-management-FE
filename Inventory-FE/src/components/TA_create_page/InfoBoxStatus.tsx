import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InfoBoxStatus({
  icon,
  type,
}: {
  icon: IconProp;
  type: string;
}) {
  return (
    <div className="flex items-center text-base text-gray-500">
      <FontAwesomeIcon icon={icon} />
      <h3 className="font-light capitalize">{type.replaceAll("-", " ")}</h3>
    </div>
  );
}
