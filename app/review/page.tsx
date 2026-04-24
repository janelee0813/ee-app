"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import StudyItemCard from "@/components/StudyItemCard";
import StatusButtons from "@/components/StatusButtons";
import { getProgress, setItemStatus, clearItemStatus } from "@/utils/storage";
import { allContents } from "@/data/contents";
import { StudyItem, StudyStatus } from "@/types";
import { RefreshCw, CheckCircle, Trash2 } from "lucide-react";

interface ReviewEntry {
  item: StudyItem;
  contentId: string;
  partId: string;
  sectionId: string;
  sectionTitle: string;
  partTitle: string;
  timestamp: number;
  revealed: boolean;
}

export default function ReviewPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ReviewEntry[]>([]);
  const [statuses, setStatuses] = useState<Record<string, StudyStatus | undefined>>({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    const progress = getProgress();
    const wrongIds = new Set(progress.wrongAnswers.map((w) => w.itemId));

    // confused 상태인 항목도 포함
    const confusedIds = new Set(
      Object.entries(progress.itemStatuses)
        .filter(([, v]) => v === "confused")
        .map(([k]) => k)
    );

    const allIds = new Set([...wrongIds, ...confusedIds]);

    const result: ReviewEntry[] = [];
    const statusMap: Record<string, StudyStatus | undefined> = {};

    for (const content of allContents) {
      for (const part of content.parts) {
        for (const section of part.sections) {
          for (const item of section.items) {
            if (allIds.has(item.id)) {
              const wrongEntry = progress.wrongAnswers.find((w) => w.itemId === item.id);
              result.push({
                item,
                contentId: content.id,
                partId: part.id,
                sectionId: section.id,
                sectionTitle: section.title,
                partTitle: part.title,
                timestamp: wrongEntry?.timestamp ?? Date.now(),
                revealed: false,
              });
              statusMap[item.id] = progress.itemStatuses[item.id];
            }
          }
        }
      }
    }

    // 최신 순 정렬
    result.sort((a, b) => b.timestamp - a.timestamp);
    setEntries(result);
    setStatuses(statusMap);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleReveal = (index: number) => {
    setEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], revealed: true };
      return next;
    });
  };

  const handleStatus = (itemId: string, status: StudyStatus) => {
    setItemStatus(itemId, status);
    setStatuses((prev) => ({ ...prev, [itemId]: status }));
  };

  const handleClear = (itemId: string) => {
    clearItemStatus(itemId);
    setEntries((prev) => prev.filter((e) => e.item.id !== itemId));
    setStatuses((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  if (loading) {
    return (
      <div>
        <Header title="헷갈린 부분 복습" showBack={false} />
        <div className="flex items-center justify-center h-48">
          <p className="text-stone-400">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div>
        <Header title="헷갈린 부분 복습" showBack={false} />
        <div className="px-4 py-16 flex flex-col items-center gap-4 text-center">
          <CheckCircle size={56} className="text-teal-400" />
          <div>
            <p className="text-[18px] font-bold text-stone-700">완벽해요!</p>
            <p className="text-[14px] text-stone-400 mt-1">헷갈린 항목이 없습니다</p>
          </div>
          <button
            onClick={() => router.push("/study")}
            className="mt-4 px-6 py-3 rounded-xl bg-blue-700 text-white font-semibold text-[15px]"
          >
            학습하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="헷갈린 부분 복습" showBack={false} />
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-stone-500">
            헷갈림 표시된 항목 <span className="font-bold text-amber-600">{entries.length}개</span>
          </p>
          <button
            onClick={loadData}
            className="flex items-center gap-1 text-[12px] text-stone-400 hover:text-stone-600"
          >
            <RefreshCw size={13} />
            새로고침
          </button>
        </div>

        {entries.map((entry, i) => (
          <div key={entry.item.id} className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
            {/* 섹션 정보 */}
            <div className="px-4 py-2.5 bg-amber-50 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-amber-500 font-semibold">{entry.partTitle}</p>
                <p className="text-[13px] text-amber-800 font-semibold">{entry.sectionTitle}</p>
              </div>
              <button
                onClick={() => handleClear(entry.item.id)}
                className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-400 hover:text-amber-600 transition-colors"
                aria-label="목록에서 제거"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* 아이템 */}
            <div className="p-4 space-y-3">
              <StudyItemCard item={entry.item} revealed={entry.revealed} />

              {!entry.revealed ? (
                <button
                  onClick={() => handleReveal(i)}
                  className="w-full py-3 rounded-xl bg-stone-800 text-white font-semibold text-[15px] active:bg-stone-700 transition-colors"
                >
                  내용 확인
                </button>
              ) : (
                <StatusButtons
                  current={statuses[entry.item.id]}
                  onSelect={(s) => handleStatus(entry.item.id, s)}
                />
              )}

              {statuses[entry.item.id] === "memorized" && (
                <p className="text-center text-[12px] text-teal-600">
                  ✓ 외움! 목록에서 제거하려면 휴지통 버튼을 누르세요
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
