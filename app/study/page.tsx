"use client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { allContents } from "@/data/contents";
import { getProgress } from "@/utils/storage";
import { calcOverallProgress } from "@/utils/progress";
import ProgressBar from "@/components/ProgressBar";
import { useEffect, useState } from "react";

export default function StudyPage() {
  const router = useRouter();
  const [progresses, setProgresses] = useState<Record<string, number>>({});

  useEffect(() => {
    const p = getProgress();
    const result: Record<string, number> = {};
    for (const content of allContents) {
      result[content.id] = calcOverallProgress(content, p.itemStatuses).percent;
    }
    setProgresses(result);
  }, []);

  return (
    <div>
      <Header title="암기 학습" showBack={false} />
      <div className="px-4 py-5 space-y-4">
        <p className="text-[13px] text-stone-500">학습할 콘텐츠를 선택하세요</p>

        {allContents.map((content) => (
          <button
            key={content.id}
            onClick={() => router.push(`/study/${content.id}`)}
            className="w-full bg-white rounded-2xl border border-stone-200 p-5 text-left active:bg-stone-50 transition-colors shadow-sm"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  content.type === "exam-outline"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {content.type === "exam-outline" ? "시험준비" : "전체 원문"}
                </span>
                <h2 className="text-[17px] font-semibold text-stone-800 mt-2">{content.title}</h2>
                <p className="text-[13px] text-stone-400 mt-0.5">{content.parts.length}개 파트</p>
              </div>
            </div>
            <ProgressBar
              percent={progresses[content.id] ?? 0}
              label="진행률"
              size="sm"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
