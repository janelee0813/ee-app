"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import StudyItemCard from "@/components/StudyItemCard";
import StatusButtons from "@/components/StatusButtons";
import ProgressBar from "@/components/ProgressBar";
import { allContents } from "@/data/contents";
import { getProgress, setItemStatus, setLastStudied, getItemStatus } from "@/utils/storage";
import { StudyItem, StudyStatus, Section, Content, Part } from "@/types";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

export default function StudyPageView() {
  const params = useParams();
  const router = useRouter();

  const contentId = params.contentId as string;
  const partId = params.partId as string;
  const sectionId = params.sectionId as string;

  const [content, setContent] = useState<Content | null>(null);
  const [part, setPart] = useState<Part | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [items, setItems] = useState<StudyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, StudyStatus | undefined>>({});

  useEffect(() => {
    const foundContent = allContents.find((c) => c.id === contentId);
    if (!foundContent) return;
    setContent(foundContent);

    const foundPart = foundContent.parts.find((p) => p.id === partId);
    if (!foundPart) return;
    setPart(foundPart);

    const foundSection = foundPart.sections.find((s) => s.id === sectionId);
    if (!foundSection) return;
    setSection(foundSection);
    setItems(foundSection.items);

    // 저장된 상태 불러오기
    const progress = getProgress();
    const savedStatuses: Record<string, StudyStatus | undefined> = {};
    for (const item of foundSection.items) {
      savedStatuses[item.id] = progress.itemStatuses[item.id];
    }
    setStatuses(savedStatuses);
    setLastStudied(contentId, partId, sectionId);
  }, [contentId, partId, sectionId]);

  const currentItem = items[currentIndex];
  const progressPercent = items.length > 0
    ? Math.round(((currentIndex + 1) / items.length) * 100)
    : 0;
  const memorizedCount = Object.values(statuses).filter((s) => s === "memorized").length;

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const handleStatus = useCallback((status: StudyStatus) => {
    if (!currentItem) return;
    setItemStatus(currentItem.id, status);
    setStatuses((prev) => ({ ...prev, [currentItem.id]: status }));
  }, [currentItem]);

  const goNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
      setRevealed(false);
    }
  }, [currentIndex, items.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setRevealed(false);
    }
  }, [currentIndex]);

  const isFinished = currentIndex === items.length - 1 && revealed;

  if (!section || !currentItem) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-stone-400">섹션을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <Header
        title={section.title}
        subtitle={`${part?.title} · ${content?.title}`}
      />

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* 상단 진행 표시 */}
        <div className="space-y-2">
          <div className="flex justify-between text-[13px] text-stone-500">
            <span>{currentIndex + 1} / {items.length}</span>
            <span>외움 {memorizedCount}개</span>
          </div>
          <ProgressBar percent={progressPercent} size="sm" />
        </div>

        {/* 섹션 제목 안내 */}
        <div className="bg-stone-100 rounded-xl px-4 py-2.5">
          <p className="text-[13px] text-stone-500 font-medium">{section.title}</p>
        </div>

        {/* 아이템 카드 */}
        <StudyItemCard item={currentItem} revealed={revealed} />

        {/* 현재 아이템 상태 표시 (revealed 전에도) */}
        {statuses[currentItem.id] && !revealed && (
          <div className={`text-center text-[13px] py-2 rounded-xl ${
            statuses[currentItem.id] === "memorized"
              ? "bg-teal-50 text-teal-600"
              : statuses[currentItem.id] === "confused"
              ? "bg-amber-50 text-amber-600"
              : "bg-rose-50 text-rose-600"
          }`}>
            {statuses[currentItem.id] === "memorized" && "✓ 외움 표시됨"}
            {statuses[currentItem.id] === "confused" && "? 헷갈림 표시됨"}
            {statuses[currentItem.id] === "review" && "↩ 다시보기 표시됨"}
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="px-4 pb-4 space-y-3 bg-[#F8F7F2] border-t border-stone-200 pt-4">
        {!revealed ? (
          <button
            onClick={handleReveal}
            className="w-full py-4 rounded-2xl bg-blue-700 text-white font-semibold text-[16px] flex items-center justify-center gap-2 active:bg-blue-800 transition-colors shadow-md"
          >
            <Eye size={20} />
            내용 보기
          </button>
        ) : (
          <StatusButtons
            current={statuses[currentItem.id]}
            onSelect={handleStatus}
          />
        )}

        <div className="flex gap-3">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex-1 py-3.5 rounded-2xl border-2 border-stone-300 text-stone-600 font-semibold text-[15px] flex items-center justify-center gap-1 disabled:opacity-40 active:bg-stone-100 transition-colors"
          >
            <ChevronLeft size={18} />
            이전
          </button>

          {isFinished ? (
            <button
              onClick={() => router.back()}
              className="flex-1 py-3.5 rounded-2xl bg-teal-500 text-white font-semibold text-[15px] active:bg-teal-600 transition-colors"
            >
              완료 ✓
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={currentIndex === items.length - 1}
              className="flex-1 py-3.5 rounded-2xl border-2 border-blue-600 text-blue-700 font-semibold text-[15px] flex items-center justify-center gap-1 disabled:opacity-40 active:bg-blue-50 transition-colors"
            >
              다음
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
