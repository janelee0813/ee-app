"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  subtitle?: string;
}

export default function Header({ title, showBack = true, subtitle }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F2] border-b border-stone-200">
      <div className="flex items-center gap-2 px-4 py-3 max-w-lg mx-auto">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-stone-200 active:bg-stone-300 transition-colors"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={22} className="text-stone-600" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-[17px] font-semibold text-stone-800 truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[12px] text-stone-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
