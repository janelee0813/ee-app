"use client";
import { useState, useCallback } from "react";
import Header from "@/components/Header";
import BlankQuestion from "@/components/BlankQuestion";
import { outline6 } from "@/data/contents";
import { generateBlankItems } from "@/utils/blankGenerator";
import { addWrongAnswer } from "@/utils/storage";
import { BlankItem, Difficulty } from "@/types";
import { Settings, RefreshCw, CheckCircle } from "lucide-react";

type Step = "config" | "test" | "done";

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; desc: string; color: string }[] = [
  { value: "easy", label: "쉬움", desc: "키워드 1개 숨김", color: "border-teal-400 bg-teal-50 text-teal-700" },
  { value: "medium", label: "보통", desc: "키워드 2개 숨김", color: "border-blue-400 bg-blue-50 text-blue-700" },
  { value: "hard", label: "어려움", desc: "키워드 3개+ 숨김", color: "border-rose-400 bg-rose-50 text-rose-700" },
];

export default function BlankTestPage() {
  const [step, setStep] = useState<Step>("config");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [selectedPartId, setSelectedPartId] = useState<string>("all");
  const [blankItems, setBlankItems] = useState<BlankItem[]>([]);

  const startTest = useCallback(() => {
    let items = outline6.parts.flatMap((p) => p.sections.flatMap((s) => s.items));
    if (selectedPartId !== "all") {
      const part = outline6.parts.find((p) => p.id === selectedPartId);
      if (part) {
        items = part.sections.flatMap((s) => s.items);
      }
    }
    const generated = generateBlankItems(items, difficulty);
    // 순서 섞기
    const shuffled = [...generated].sort(() => Math.random() - 0.5);
    setBlankItems(shuffled);
    setStep("test");
  }, [difficulty, selectedPartId]);

  const handleReveal = useCallback((index: number) => {
    setBlankItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], revealed: true };
      return next;
    });
  }, []);

  const handleStatus = useCallback((index: number, status: "correct" | "confused") => {
    setBlankItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], status };
      return next;
    });
    if (status === "confused") {
      const bi = blankItems[index];
      // 섹션 찾기
      for (const part of outline6.parts) {
        for (const section of part.sections) {
          if (section.items.find((i) => i.id === bi.item.id)) {
            addWrongAnswer(bi.item.id, outline6.id, part.id, section.id);
            break;
          }
        }
      }
    }
  }, [blankItems]);

  const allAnswered = blankItems.every((bi) => bi.status !== undefined);
  const correctCount = blankItems.filter((bi) => bi.status === "correct").length;
  const confusedCount = blankItems.filter((bi) => bi.status === "confused").length;

  // ── 설정 화면 ──
  if (step === "config") {
    return (
      <div>
        <Header title="빈칸 테스트" showBack={false} />
        <div className="px-4 py-5 space-y-6">
          {/* 범위 선택 */}
          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-stone-500 flex items-center gap-1.5">
              <Settings size={14} />
              시험 범위
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedPartId("all")}
                className={`w-full py-3.5 rounded-xl border-2 text-left px-4 font-semibold text-[15px] transition-colors ${
                  selectedPartId === "all"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-stone-200 text-stone-600"
                }`}
              >
                전체 (개요 #6 모두)
              </button>
              {outline6.parts.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setSelectedPartId(part.id)}
                  className={`w-full py-3.5 rounded-xl border-2 text-left px-4 font-semibold text-[15px] transition-colors ${
                    selectedPartId === part.id
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-stone-200 text-stone-600"
                  }`}
                >
                  {part.title}
                </button>
              ))}
            </div>
          </div>

          {/* 난이도 선택 */}
          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-stone-500">난이도</p>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  className={`py-3 rounded-xl border-2 text-center transition-all ${
                    difficulty === opt.value ? opt.color : "border-stone-200 text-stone-500"
                  }`}
                >
                  <p className="text-[15px] font-bold">{opt.label}</p>
                  <p className="text-[11px] mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startTest}
            className="w-full py-4 rounded-2xl bg-blue-700 text-white font-bold text-[17px] active:bg-blue-800 transition-colors shadow-md"
          >
            테스트 시작
          </button>
        </div>
      </div>
    );
  }

  // ── 완료 화면 ──
  if (step === "done" || (step === "test" && allAnswered && blankItems.length > 0)) {
    const score = blankItems.length > 0
      ? Math.round((correctCount / blankItems.length) * 100)
      : 0;
    return (
      <div>
        <Header title="테스트 완료" />
        <div className="px-4 py-8 space-y-6 text-center">
          <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-4">
            <CheckCircle size={48} className="text-teal-500 mx-auto" />
            <h2 className="text-[24px] font-bold text-stone-800">결과</h2>
            <div className="text-[48px] font-bold text-blue-700">{score}점</div>
            <div className="flex justify-center gap-6 text-[15px]">
              <div>
                <p className="text-teal-600 font-bold text-[20px]">{correctCount}</p>
                <p className="text-stone-400">맞음</p>
              </div>
              <div>
                <p className="text-amber-500 font-bold text-[20px]">{confusedCount}</p>
                <p className="text-stone-400">헷갈림</p>
              </div>
              <div>
                <p className="text-stone-400 font-bold text-[20px]">{blankItems.length}</p>
                <p className="text-stone-400">전체</p>
              </div>
            </div>
            {confusedCount > 0 && (
              <p className="text-[13px] text-amber-600 bg-amber-50 rounded-xl px-4 py-2">
                헷갈린 {confusedCount}개가 복습 목록에 저장됐어요
              </p>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { setStep("config"); setBlankItems([]); }}
              className="w-full py-4 rounded-2xl bg-blue-700 text-white font-semibold text-[16px] flex items-center justify-center gap-2 active:bg-blue-800 transition-colors"
            >
              <RefreshCw size={18} />
              다시 하기
            </button>
            <button
              onClick={() => setStep("test")}
              className="w-full py-3.5 rounded-2xl border-2 border-stone-300 text-stone-600 font-semibold text-[15px]"
            >
              답안 다시 보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 테스트 화면 ──
  return (
    <div>
      <Header
        title="빈칸 테스트"
        subtitle={`${blankItems.length}문제 · ${DIFFICULTY_OPTIONS.find(o => o.value === difficulty)?.label}`}
      />
      <div className="px-4 py-4 space-y-4">
        {/* 진행 현황 */}
        <div className="flex items-center justify-between text-[13px] text-stone-500">
          <span>
            {blankItems.filter((bi) => bi.status).length} / {blankItems.length} 완료
          </span>
          {allAnswered && (
            <button
              onClick={() => setStep("done")}
              className="px-3 py-1.5 bg-blue-700 text-white rounded-full text-[12px] font-semibold"
            >
              결과 보기
            </button>
          )}
        </div>

        {blankItems.map((bi, i) => (
          <BlankQuestion
            key={bi.item.id}
            blankItem={bi}
            index={i}
            onReveal={() => handleReveal(i)}
            onStatus={(s) => handleStatus(i, s)}
          />
        ))}

        {allAnswered && (
          <button
            onClick={() => setStep("done")}
            className="w-full py-4 rounded-2xl bg-teal-500 text-white font-bold text-[16px] active:bg-teal-600 transition-colors shadow-md"
          >
            결과 보기 →
          </button>
        )}
      </div>
    </div>
  );
}
