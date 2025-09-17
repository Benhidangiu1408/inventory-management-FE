import InfoList from "./InfoList";

const SmallInfoBox = ({
  title = "",
  data = {},
}: {
  title: string;
  data: object;
}) => {
  return (
    <div className="w-full rounded-2xl border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-3 text-center font-bold uppercase">
        {title}
      </div>
      <InfoList data={data} />
    </div>
  );
};

export default SmallInfoBox;
