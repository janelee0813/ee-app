import { Section } from "@/types";
import ProgressBar from "./ProgressBar";
import { ChevronRight } from "lucide-react";

interface SectionCardProps {
  section: Section;
  memorized: number;
  total: number;
  onClick: () => void;
}

export default function SectionCard({ section, memorized, total, onClick }: SectionCardProps) {
  const percent = total > 0 ? Math.round((memorized / total) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl border border-stone-200 p-4 text-left active:bg-stone-50 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[16px] font-semibold text-stone-800">{section.title}</span>
        <div className="flex items-center gap-1 text-stone-400">
          <span className="text-[12px]">{memorized}/{total}</span>
          <ChevronRight size={16} />
        </div>
      </div>
      <ProgressBar percent={percent} size="sm" color={percent === 100 ? "teal" : "blue"} />
    </button>
  );
}
