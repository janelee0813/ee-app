"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, PenLine, BarChart2, RefreshCw, ArrowRight, BookMarked } from "lucide-react";
import { getProgress } from "@/utils/storage";
import { outline6 } from "@/data/contents";
import { calcOverallProgress } from "@/utils/progress";
import ProgressBar from "@/components/ProgressBar";

export default function HomePage() {
  const [progress, setProgress] = useState<ReturnType<typeof calcOverallProgress> | null>(null);
  const [lastStudied, setLastStudied] = useState<ReturnType<typeof getProgress>["lastStudied"]>(null);

  useEffect(() => {
    const p = getProgress();
    setProgress(calcOverallProgress(outline6, p.itemStatuses));
    setLastStudied(p.lastStudied);
  }, []);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* 헤더 */}
      <div className="pt-2">
        <p className="text-[12px] font-semibold text-blue-600 uppercase tracking-widest mb-1">
          전도폭발 1단계
        </p>
        <h1 className="text-[28px] font-bold text-stone-900 leading-tight">
          복음제시<br />암기 훈련
        </h1>
      </div>

      {/* 진행률 카드 */}
      {progress && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] font-semibold text-stone-700">개요 #6 전체 진도</span>
            <span className="text-[22px] font-bold text-blue-700">{progress.percent}%</span>
          </div>
          <ProgressBar percent={progress.percent} size="md" />
          <div className="flex gap-4 mt-3 text-[12px] text-stone-500">
            <span>✓ 외움 {progress.memorized}</span>
            <span>? 헷갈림 {progress.confused}</span>
            <span>↩ 다시보기 {progress.review}</span>
          </div>
        </div>
      )}

      {/* 이어서 학습 */}
      {lastStudied && (
        <Link
          href={`/study/${lastStudied.contentId}/${lastStudied.partId}/${lastStudied.sectionId}`}
          className="block bg-blue-700 rounded-2xl p-5 text-white active:bg-blue-800 transition-colors shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-blue-200 mb-1">이어서 학습하기</p>
              <p className="text-[16px] font-semibold">최근 학습 위치에서 계속</p>
            </div>
            <ArrowRight size={24} className="text-blue-200" />
          </div>
        </Link>
      )}

      {/* 메인 메뉴 */}
      <div className="space-y-3">
        <p className="text-[12px] font-semibold text-stone-400 uppercase tracking-widest px-1">
          학습 메뉴
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/study"
            className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col gap-3 active:bg-stone-50 transition-colors shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <BookOpen size={20} className="text-blue-700" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-stone-800">복음전체 암기</p>
              <p className="text-[12px] text-stone-400 mt-0.5">전체 흐름 암기</p>
            </div>
          </Link>

          <Link
            href="/study/outline-6"
            className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col gap-3 active:bg-stone-50 transition-colors shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <BookMarked size={20} className="text-purple-700" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-stone-800">시험준비 #6</p>
              <p className="text-[12px] text-stone-400 mt-0.5">개요 암기</p>
            </div>
          </Link>

          <Link
            href="/blank-test"
            className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col gap-3 active:bg-stone-50 transition-colors shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-coral-100 flex items-center justify-center bg-orange-100">
              <PenLine size={20} className="text-orange-700" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-stone-800">빈칸 테스트</p>
              <p className="text-[12px] text-stone-400 mt-0.5">키워드 빈칸 문제</p>
            </div>
          </Link>

          <Link
            href="/progress"
            className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col gap-3 active:bg-stone-50 transition-colors shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <BarChart2 size={20} className="text-teal-700" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-stone-800">진도 보기</p>
              <p className="text-[12px] text-stone-400 mt-0.5">파트별 진행률</p>
            </div>
          </Link>
        </div>

        <Link
          href="/review"
          className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center gap-4 active:bg-stone-50 transition-colors shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <RefreshCw size={20} className="text-amber-700" />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-stone-800">헷갈린 부분 다시 보기</p>
            <p className="text-[12px] text-stone-400 mt-0.5">헷갈림 표시한 항목만 복습</p>
          </div>
          <ArrowRight size={18} className="text-stone-400" />
        </Link>
      </div>

      {/* 학습 흐름 안내 */}
      <div className="bg-stone-100 rounded-2xl p-4 space-y-2">
        <p className="text-[12px] font-semibold text-stone-500">권장 학습 순서</p>
        <div className="flex items-center gap-2 flex-wrap text-[13px] text-stone-600">
          <span>복음전체 보기</span>
          <span className="text-stone-400">→</span>
          <span>개요 #6 암기</span>
          <span className="text-stone-400">→</span>
          <span>빈칸 테스트</span>
          <span className="text-stone-400">→</span>
          <span>헷갈린 복습</span>
        </div>
      </div>
    </div>
  );
}
