import ComponentCard from "@/default_components/common/ComponentCard";
import InfoList from "./InfoList";

const SmallInfoBox = ({
  title = "",
  data = {},
}: {
  title: string;
  data: object;
}) => {
  return (
    <ComponentCard className="w-full" title={title}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <span className="font-bold capitalize">{key}</span>: {value}
        </div>
      ))}
    </ComponentCard>
  );
};

export default SmallInfoBox;
