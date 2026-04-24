"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import SectionCard from "@/components/SectionCard";
import { allContents } from "@/data/contents";
import { getProgress } from "@/utils/storage";
import { getSectionProgress } from "@/utils/progress";
import { Content, Part } from "@/types";
import { BookOpen, MessageSquare } from "lucide-react";

export default function SectionListPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.contentId as string;
  const partId = params.partId as string;

  const [content, setContent] = useState<Content | null>(null);
  const [part, setPart] = useState<Part | null>(null);
  const [sectionStats, setSectionStats] = useState<{ total: number; memorized: number; percent: number }[]>([]);

  useEffect(() => {
    const foundContent = allContents.find((c) => c.id === contentId);
    if (!foundContent) return;
    setContent(foundContent);

    const foundPart = foundContent.parts.find((p) => p.id === partId);
    if (!foundPart) return;
    setPart(foundPart);

    const p = getProgress();
    setSectionStats(foundPart.sections.map((s) => getSectionProgress(s, p.itemStatuses)));
  }, [contentId, partId]);

  if (!content || !part) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-stone-400">파트를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <Header title={part.title} subtitle={content.title} />
      <div className="px-4 py-5 space-y-4">
        {/* 학습 모드 안내 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
            <BookOpen size={18} className="text-blue-600 mx-auto mb-1" />
            <p className="text-[12px] font-semibold text-blue-700">한 줄씩 보기</p>
            <p className="text-[11px] text-blue-400">내용 확인하며 암기</p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
            <MessageSquare size={18} className="text-purple-600 mx-auto mb-1" />
            <p className="text-[12px] font-semibold text-purple-700">제목만 보고 말하기</p>
            <p className="text-[11px] text-purple-400">제목 보고 직접 말하기</p>
          </div>
        </div>

        <p className="text-[13px] text-stone-500">섹션을 탭하면 한 줄씩 보기로 시작합니다</p>

        {part.sections.map((section, i) => {
          const stat = sectionStats[i] ?? { total: 0, memorized: 0, percent: 0 };
          return (
            <div key={section.id} className="space-y-1">
              <SectionCard
                section={section}
                memorized={stat.memorized}
                total={stat.total}
                onClick={() =>
                  router.push(`/study/${contentId}/${partId}/${section.id}`)
                }
              />
              {/* 제목만 보고 말하기 버튼 */}
              <button
                onClick={() =>
                  router.push(`/recall/${contentId}/${partId}/${section.id}`)
                }
                className="w-full text-center text-[12px] text-purple-500 hover:text-purple-700 py-1.5 transition-colors"
              >
                제목만 보고 말하기 →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
