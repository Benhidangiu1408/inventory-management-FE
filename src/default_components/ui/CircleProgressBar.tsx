export default function CircleProgressBar({
  percent,
  size = 40,
}: {
  percent: number;
  size?: number;
}) {
  const color =
    percent >= 90 ? "#ef4444" : percent >= 70 ? "#f59e0b" : "#10b981";
  return (
    <div
      className="relative flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} ${percent}%, #e5e7eb 0)`,
      }}
    >
      {/* The center "hole" to make it a ring */}
      <div
        className="absolute rounded-full bg-white dark:bg-gray-800"
        style={{ width: size - 6, height: size - 6 }}
      />
      <div className="relative flex items-center justify-center text-[9px] font-bold text-gray-700 dark:text-gray-200">
        <div>{Math.round(percent)}%</div>
      </div>
    </div>
  );
}
