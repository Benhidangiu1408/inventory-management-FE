export default function InfoList({
  className = "flex flex-col gap-3 p-6 text-base",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`${className}`}>{children}</div>;
}
