"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import PartCard from "@/components/PartCard";
import { allContents } from "@/data/contents";
import { getProgress } from "@/utils/storage";
import { calcPartProgress } from "@/utils/progress";
import { Content } from "@/types";

export default function PartListPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.contentId as string;

  const [content, setContent] = useState<Content | null>(null);
  const [partProgresses, setPartProgresses] = useState<ReturnType<typeof calcPartProgress>[]>([]);

  useEffect(() => {
    const found = allContents.find((c) => c.id === contentId);
    if (!found) return;
    setContent(found);

    const p = getProgress();
    setPartProgresses(found.parts.map((part) => calcPartProgress(part, p.itemStatuses)));
  }, [contentId]);

  if (!content) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-stone-400">콘텐츠를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <Header title={content.title} subtitle="파트 선택" />
      <div className="px-4 py-5 space-y-3">
        <p className="text-[13px] text-stone-500">학습할 파트를 선택하세요</p>

        {content.parts.map((part, i) => {
          const prog = partProgresses[i];
          return (
            <PartCard
              key={part.id}
              part={part}
              percent={prog?.percent ?? 0}
              memorized={prog?.memorized ?? 0}
              total={prog?.total ?? 0}
              onClick={() => router.push(`/study/${contentId}/${part.id}`)}
            />
          );
        })}
      </div>
    </div>
  );
}
