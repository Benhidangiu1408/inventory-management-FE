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
      <InfoList data={data} />
    </ComponentCard>
  );
};

export default SmallInfoBox;
