import { Part } from "@/types";
import ProgressBar from "./ProgressBar";
import { ChevronRight } from "lucide-react";

interface PartCardProps {
  part: Part;
  percent: number;
  memorized: number;
  total: number;
  onClick: () => void;
}

export default function PartCard({ part, percent, memorized, total, onClick }: PartCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl border border-stone-200 p-5 text-left active:bg-stone-50 transition-colors shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[17px] font-semibold text-stone-800">{part.title}</span>
        <ChevronRight size={18} className="text-stone-400 flex-shrink-0" />
      </div>
      <ProgressBar percent={percent} size="md" color={percent === 100 ? "teal" : "blue"} />
      <p className="text-[12px] text-stone-400 mt-2">
        {memorized} / {total} 항목 완료
      </p>
    </button>
  );
}
