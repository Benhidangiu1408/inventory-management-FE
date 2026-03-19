import { ReactNode } from "react";

type InfoItem = {
  label: string;
  value: React.ReactNode;
};

interface GeneralInfoSectionProps {
  title?: string;
  items: InfoItem[];
  editBtn?: ReactNode;
}

export default function GeneralInfoSection({
  title = "General Information",
  items,
  editBtn,
}: GeneralInfoSectionProps) {
  return (
    <div className="default-card w-full p-6">
      <div className="mb-3 flex items-center gap-3">
        <div className="font-semibold text-xl">{title}</div>
        {editBtn}
      </div>
      <div className="grid grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.label}
            className="[&:nth-child(odd):last-child]:col-span-2"
          >
            <div className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">
              {item.label}
            </div>
            <div>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
