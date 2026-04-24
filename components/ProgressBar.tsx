interface ProgressBarProps {
  percent: number;
  label?: string;
  size?: "sm" | "md";
  color?: "blue" | "teal" | "amber";
}

export default function ProgressBar({
  percent,
  label,
  size = "md",
  color = "blue",
}: ProgressBarProps) {
  const height = size === "sm" ? "h-1.5" : "h-2.5";
  const colorMap = {
    blue: "bg-blue-600",
    teal: "bg-teal-500",
    amber: "bg-amber-500",
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-[12px] text-stone-500">{label}</span>
          <span className="text-[12px] font-semibold text-stone-700">{percent}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-stone-200 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${colorMap[color]} rounded-full transition-all duration-500`}
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}
