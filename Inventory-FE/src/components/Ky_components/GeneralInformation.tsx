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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {title && <div className="mb-3">{title}</div>}
      <div className="grid grid-cols-2 gap-5">
        {items.map((item) => (
          <div key={item.label} className="text-sm">
            <div className="font-medium text-gray-600">{item.label}</div>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
