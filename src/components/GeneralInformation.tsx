type InfoItem = {
  label: string;
  value: React.ReactNode;
};

interface GeneralInfoSectionProps {
  title?: string;
  items: InfoItem[];
}

export default function GeneralInfoSection({
  title = "General Information",
  items,
}: GeneralInfoSectionProps) {
  return (
    <div className="default-card w-full p-6">
      {title && <div className="mb-3 font-medium">{title}</div>}
      <div className="grid grid-cols-2 gap-5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">
              {item.label}
            </div>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
