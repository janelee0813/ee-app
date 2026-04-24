"use client";
import { BlankItem } from "@/types";
import { Check, HelpCircle } from "lucide-react";

const TYPE_LABEL: Record<string, string> = {
  verse: "성경구절",
  example: "예화",
  transition: "주제전환",
  prayer: "기도문",
  sentence: "문장",
};

interface BlankQuestionProps {
  blankItem: BlankItem;
  index: number;
  onReveal: () => void;
  onStatus: (status: "correct" | "confused") => void;
}

export default function BlankQuestion({
  blankItem,
  index,
  onReveal,
  onStatus,
}: BlankQuestionProps) {
  const { item, blankedText, hiddenKeywords, revealed, status } = blankItem;

  return (
    <div className={`rounded-2xl border-2 p-5 space-y-4 transition-all ${
      status === "correct"
        ? "border-teal-300 bg-teal-50"
        : status === "confused"
        ? "border-amber-300 bg-amber-50"
        : revealed
        ? "border-stone-300 bg-white"
        : "border-stone-200 bg-white"
    }`}>
      {/* 번호 + 타입 */}
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">
          {index + 1}
        </span>
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">
          {TYPE_LABEL[item.type] ?? item.type}
        </span>
      </div>

      {/* 빈칸 텍스트 */}
      <p className="text-[17px] leading-relaxed text-stone-800">
        {blankedText}
      </p>

      {/* 정답 공개 후 */}
      {revealed && (
        <div className="space-y-2">
          <div className="text-[13px] text-stone-500">정답:</div>
          <div className="flex flex-wrap gap-2">
            {hiddenKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[14px] font-semibold"
              >
                {kw}
              </span>
            ))}
          </div>
          <p className="text-[15px] text-stone-600 mt-2 leading-relaxed">{item.text}</p>
        </div>
      )}

      {/* 버튼 */}
      {!revealed ? (
        <button
          onClick={onReveal}
          className="w-full py-3.5 rounded-xl bg-stone-800 text-white font-semibold text-[15px] active:bg-stone-700 transition-colors"
        >
          정답 보기
        </button>
      ) : !status ? (
        <div className="flex gap-2">
          <button
            onClick={() => onStatus("correct")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-teal-500 text-teal-600 font-semibold text-[15px] active:bg-teal-50 transition-colors"
          >
            <Check size={18} />
            맞음
          </button>
          <button
            onClick={() => onStatus("confused")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-amber-400 text-amber-600 font-semibold text-[15px] active:bg-amber-50 transition-colors"
          >
            <HelpCircle size={18} />
            헷갈림
          </button>
        </div>
      ) : (
        <div className={`text-center py-2 rounded-xl text-[14px] font-semibold ${
          status === "correct"
            ? "bg-teal-100 text-teal-700"
            : "bg-amber-100 text-amber-700"
        }`}>
          {status === "correct" ? "✓ 정답!" : "? 헷갈림 저장됨"}
        </div>
      )}
    </div>
  );
}
