"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import StudyItemCard from "@/components/StudyItemCard";
import StatusButtons from "@/components/StatusButtons";
import { allContents } from "@/data/contents";
import { getProgress, setItemStatus, setLastStudied } from "@/utils/storage";
import { StudyItem, StudyStatus, Section, Content, Part } from "@/types";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

interface SectionRecallState {
  section: Section;
  revealed: boolean;
  status?: StudyStatus;
}

export default function TitleRecallPage() {
  const params = useParams();
  const router = useRouter();

  const contentId = params.contentId as string;
  const partId = params.partId as string;
  const sectionId = params.sectionId as string;

  const [content, setContent] = useState<Content | null>(null);
  const [part, setPart] = useState<Part | null>(null);
  const [sectionStates, setSectionStates] = useState<SectionRecallState[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [itemStatuses, setItemStatuses] = useState<Record<string, StudyStatus | undefined>>({});

  useEffect(() => {
    const foundContent = allContents.find((c) => c.id === contentId);
    if (!foundContent) return;
    setContent(foundContent);

    const foundPart = foundContent.parts.find((p) => p.id === partId);
    if (!foundPart) return;
    setPart(foundPart);

    // sectionId가 있으면 그 섹션만, 없으면 파트 전체
    let targetSections = foundPart.sections;
    if (sectionId !== "all") {
      const found = foundPart.sections.find((s) => s.id === sectionId);
      targetSections = found ? [found] : foundPart.sections;
    }

    const p = getProgress();
    const statuses: Record<string, StudyStatus | undefined> = {};
    for (const s of targetSections) {
      for (const item of s.items) {
        statuses[item.id] = p.itemStatuses[item.id];
      }
    }
    setItemStatuses(statuses);
    setSectionStates(targetSections.map((s) => ({ section: s, revealed: false })));
    setLastStudied(contentId, partId, sectionId);
  }, [contentId, partId, sectionId]);

  const currentState = sectionStates[currentSectionIndex];

  const handleReveal = useCallback(() => {
    setSectionStates((prev) => {
      const next = [...prev];
      next[currentSectionIndex] = { ...next[currentSectionIndex], revealed: true };
      return next;
    });
  }, [currentSectionIndex]);

  const handleHide = useCallback(() => {
    setSectionStates((prev) => {
      const next = [...prev];
      next[currentSectionIndex] = { ...next[currentSectionIndex], revealed: false };
      return next;
    });
  }, [currentSectionIndex]);

  // 섹션 레벨 상태 체크 (섹션 내 모든 아이템을 같은 상태로)
  const handleSectionStatus = useCallback((status: StudyStatus) => {
    if (!currentState) return;
    const section = currentState.section;
    for (const item of section.items) {
      setItemStatus(item.id, status);
    }
    setItemStatuses((prev) => {
      const next = { ...prev };
      for (const item of section.items) {
        next[item.id] = status;
      }
      return next;
    });
    setSectionStates((prev) => {
      const next = [...prev];
      next[currentSectionIndex] = { ...next[currentSectionIndex], status };
      return next;
    });
  }, [currentState, currentSectionIndex]);

  const goNext = () => {
    if (currentSectionIndex < sectionStates.length - 1) {
      setCurrentSectionIndex((i) => i + 1);
    }
  };
  const goPrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((i) => i - 1);
    }
  };

  if (!currentState) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-stone-400">섹션을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const { section, revealed, status } = currentState;
  const isFinished = currentSectionIndex === sectionStates.length - 1;

  // 현재 섹션의 대표 상태 (아이템 중 첫 번째)
  const representativeStatus = section.items[0] ? itemStatuses[section.items[0].id] : undefined;

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <Header
        title="제목만 보고 말하기"
        subtitle={`${part?.title} · ${currentSectionIndex + 1}/${sectionStates.length}`}
      />

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* 진행 표시 */}
        <div className="flex gap-1.5">
          {sectionStates.map((s, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i < currentSectionIndex
                  ? "bg-teal-400"
                  : i === currentSectionIndex
                  ? "bg-blue-600"
                  : "bg-stone-200"
              }`}
            />
          ))}
        </div>

        {/* 제목 카드 */}
        <div className="bg-blue-700 rounded-2xl p-5 text-white shadow-md">
          <p className="text-[12px] text-blue-200 mb-2 font-medium">섹션 제목</p>
          <p className="text-[20px] font-bold leading-snug">{section.title}</p>
        </div>

        {/* 안내 문구 (미공개 상태) */}
        {!revealed && (
          <div className="bg-stone-100 rounded-xl p-4 text-center">
            <p className="text-[15px] text-stone-600 leading-relaxed">
              제목을 보고<br />
              <span className="font-semibold">입으로 내용을 말해본 뒤</span><br />
              아래 버튼을 눌러 확인하세요
            </p>
          </div>
        )}

        {/* 내용 공개 */}
        {revealed && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-stone-500">섹션 내용</p>
              <button
                onClick={handleHide}
                className="flex items-center gap-1 text-[12px] text-stone-400 hover:text-stone-600"
              >
                <ChevronUp size={14} />
                접기
              </button>
            </div>
            {section.items.map((item) => (
              <StudyItemCard key={item.id} item={item} revealed={true} />
            ))}
          </div>
        )}

        {/* 상태 표시 */}
        {representativeStatus && (
          <div className={`text-center text-[13px] py-2 rounded-xl ${
            representativeStatus === "memorized"
              ? "bg-teal-50 text-teal-600"
              : representativeStatus === "confused"
              ? "bg-amber-50 text-amber-600"
              : "bg-rose-50 text-rose-600"
          }`}>
            {representativeStatus === "memorized" && "✓ 외움 표시됨"}
            {representativeStatus === "confused" && "? 헷갈림 표시됨"}
            {representativeStatus === "review" && "↩ 다시보기 표시됨"}
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="px-4 pb-4 space-y-3 bg-[#F8F7F2] border-t border-stone-200 pt-4">
        {!revealed ? (
          <button
            onClick={handleReveal}
            className="w-full py-4 rounded-2xl bg-blue-700 text-white font-semibold text-[16px] flex items-center justify-center gap-2 active:bg-blue-800 transition-colors shadow-md"
          >
            <ChevronDown size={20} />
            내용 보기
          </button>
        ) : (
          <StatusButtons
            current={representativeStatus}
            onSelect={handleSectionStatus}
          />
        )}

        <div className="flex gap-3">
          <button
            onClick={goPrev}
            disabled={currentSectionIndex === 0}
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
              className="flex-1 py-3.5 rounded-2xl border-2 border-blue-600 text-blue-700 font-semibold text-[15px] flex items-center justify-center gap-1 active:bg-blue-50 transition-colors"
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
