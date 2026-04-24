"use client";
import { StudyStatus } from "@/types";
import { Check, HelpCircle, RotateCcw } from "lucide-react";

interface StatusButtonsProps {
  current?: StudyStatus;
  onSelect: (status: StudyStatus) => void;
}

export default function StatusButtons({ current, onSelect }: StatusButtonsProps) {
  const buttons: { status: StudyStatus; label: string; icon: React.ReactNode; active: string; base: string }[] = [
    {
      status: "memorized",
      label: "외움",
      icon: <Check size={18} />,
      active: "bg-teal-500 text-white border-teal-500",
      base: "border-stone-300 text-stone-600 hover:border-teal-400 hover:text-teal-600",
    },
    {
      status: "confused",
      label: "헷갈림",
      icon: <HelpCircle size={18} />,
      active: "bg-amber-400 text-white border-amber-400",
      base: "border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-600",
    },
    {
      status: "review",
      label: "다시보기",
      icon: <RotateCcw size={18} />,
      active: "bg-rose-400 text-white border-rose-400",
      base: "border-stone-300 text-stone-600 hover:border-rose-400 hover:text-rose-600",
    },
  ];

  return (
    <div className="flex gap-2 w-full">
      {buttons.map(({ status, label, icon, active, base }) => (
        <button
          key={status}
          onClick={() => onSelect(status)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 font-semibold text-[14px] transition-all active:scale-95 ${
            current === status ? active : base
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}
