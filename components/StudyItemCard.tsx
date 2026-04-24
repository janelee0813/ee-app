import { StudyItem } from "@/types";

interface StudyItemCardProps {
  item: StudyItem;
  revealed: boolean;
}

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  sentence: { label: "문장", color: "bg-blue-100 text-blue-700" },
  verse: { label: "성경구절", color: "bg-teal-100 text-teal-700" },
  example: { label: "예화", color: "bg-amber-100 text-amber-700" },
  transition: { label: "주제전환", color: "bg-purple-100 text-purple-700" },
  prayer: { label: "기도문", color: "bg-rose-100 text-rose-700" },
  dialogue: { label: "대화", color: "bg-indigo-100 text-indigo-700" },
  heading: { label: "제목", color: "bg-stone-100 text-stone-600" },
};

function PrayerText({ text }: { text: string }) {
  const lines = text.split(" / ");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => (
        <p key={i} className="text-[17px] leading-relaxed text-stone-800">
          {line}
        </p>
      ))}
    </div>
  );
}

export default function StudyItemCard({ item, revealed }: StudyItemCardProps) {
  const badge = TYPE_BADGE[item.type] ?? { label: item.type, color: "bg-stone-100 text-stone-600" };

  if (!revealed) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 p-5 text-center">
        <span className="text-stone-400 text-[15px]">먼저 입으로 말해본 뒤 확인하세요</span>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-5 space-y-3 ${
      item.type === "verse"
        ? "bg-teal-50 border-teal-200"
        : item.type === "prayer"
        ? "bg-rose-50 border-rose-200"
        : item.type === "transition"
        ? "bg-purple-50 border-purple-200"
        : item.type === "example"
        ? "bg-amber-50 border-amber-200"
        : "bg-white border-stone-200"
    }`}>
      <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badge.color}`}>
        {badge.label}
      </span>

      {item.type === "prayer" ? (
        <PrayerText text={item.text} />
      ) : item.type === "verse" ? (
        <p className="text-[18px] font-semibold text-teal-800 leading-snug">{item.text}</p>
      ) : (
        <p className="text-[17px] leading-relaxed text-stone-800">{item.text}</p>
      )}

      {item.reference && (
        <p className="text-[13px] text-stone-400 italic">{item.reference}</p>
      )}
    </div>
  );
}
