"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { outline6, fullGospel } from "@/data/contents";
import { getProgress, resetAllProgress } from "@/utils/storage";
import { calcOverallProgress, OverallProgress } from "@/utils/progress";
import { RotateCcw } from "lucide-react";

export default function ProgressPage() {
  const [outlineProgress, setOutlineProgress] = useState<OverallProgress | null>(null);
  const [fullProgress, setFullProgress] = useState<OverallProgress | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [showReset, setShowReset] = useState(false);

  const loadData = () => {
    const p = getProgress();
    setOutlineProgress(calcOverallProgress(outline6, p.itemStatuses));
    setFullProgress(calcOverallProgress(fullGospel, p.itemStatuses));
    setWrongCount(p.wrongAnswers.length);
  };

  useEffect(() => { loadData(); }, []);

  const handleReset = () => {
    resetAllProgress();
    setShowReset(false);
    loadData();
  };

  return (
    <div>
      <Header title="진도 보기" showBack={false} />
      <div className="px-4 py-5 space-y-5">
        {/* 개요 #6 전체 */}
        {outlineProgress && (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-stone-800">복음제시 개요 #6</h2>
              <span className="text-[24px] font-bold text-blue-700">{outlineProgress.percent}%</span>
            </div>
            <ProgressBar percent={outlineProgress.percent} />
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: "전체", value: outlineProgress.total, color: "text-stone-700" },
                { label: "외움", value: outlineProgress.memorized, color: "text-teal-600" },
                { label: "헷갈림", value: outlineProgress.confused, color: "text-amber-600" },
                { label: "미학습", value: outlineProgress.untouched, color: "text-stone-400" },
              ].map((item) => (
                <div key={item.label} className="bg-stone-50 rounded-xl py-2.5">
                  <p className={`text-[18px] font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-[11px] text-stone-400">{item.label}</p>
                </div>
              ))}
            </div>

            {/* 파트별 */}
            <div className="space-y-3 pt-1">
              <p className="text-[12px] font-semibold text-stone-400">파트별 진행률</p>
              {outlineProgress.parts.map((pp) => (
                <div key={pp.partId} className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[14px] font-medium text-stone-700">{pp.partTitle}</span>
                    <span className="text-[13px] text-stone-500">{pp.memorized}/{pp.total}</span>
                  </div>
                  <ProgressBar
                    percent={pp.percent}
                    size="sm"
                    color={pp.percent === 100 ? "teal" : "blue"}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 전체 원문 */}
        {fullProgress && (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-stone-800">전체 복음제시</h2>
              <span className="text-[20px] font-bold text-blue-700">{fullProgress.percent}%</span>
            </div>
            <ProgressBar percent={fullProgress.percent} />
            <p className="text-[12px] text-stone-400">샘플 데이터 — 실제 원문 추가 후 진도 추적 가능</p>
          </div>
        )}

        {/* 헷갈린 항목 */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[14px] font-semibold text-amber-800">헷갈린 항목</p>
            <p className="text-[13px] text-amber-600 mt-0.5">복습이 필요한 항목</p>
          </div>
          <span className="text-[28px] font-bold text-amber-700">{wrongCount}</span>
        </div>

        {/* 초기화 */}
        <div className="pt-2">
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="w-full py-3 rounded-xl border border-stone-200 text-stone-400 text-[14px] flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} />
              진도 초기화
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
              <p className="text-[14px] text-red-700 font-semibold text-center">
                모든 진도를 초기화할까요?<br />
                <span className="font-normal text-[13px]">이 작업은 되돌릴 수 없습니다.</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-600 text-[14px] font-semibold"
                >
                  취소
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-[14px] font-semibold"
                >
                  초기화
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
