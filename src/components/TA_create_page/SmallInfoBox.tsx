import ComponentCard from "@/components/common/ComponentCard";
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
      <InfoList>
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <span className="font-bold capitalize">{key}</span>: {value}
          </div>
        ))}
      </InfoList>
    </ComponentCard>
  );
};

export default SmallInfoBox;
