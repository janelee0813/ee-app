import { Content, Part, Section, UserProgress } from "@/types";

export interface PartProgress {
  partId: string;
  partTitle: string;
  total: number;
  memorized: number;
  confused: number;
  review: number;
  percent: number;
}

export interface OverallProgress {
  total: number;
  memorized: number;
  confused: number;
  review: number;
  untouched: number;
  percent: number;
  parts: PartProgress[];
}

export function getAllItems(content: Content) {
  return content.parts.flatMap((p) =>
    p.sections.flatMap((s) => s.items)
  );
}

export function calcPartProgress(
  part: Part,
  statuses: UserProgress["itemStatuses"]
): PartProgress {
  const items = part.sections.flatMap((s) => s.items);
  const total = items.length;
  const memorized = items.filter((i) => statuses[i.id] === "memorized").length;
  const confused = items.filter((i) => statuses[i.id] === "confused").length;
  const review = items.filter((i) => statuses[i.id] === "review").length;

  return {
    partId: part.id,
    partTitle: part.title,
    total,
    memorized,
    confused,
    review,
    percent: total > 0 ? Math.round((memorized / total) * 100) : 0,
  };
}

export function calcOverallProgress(
  content: Content,
  statuses: UserProgress["itemStatuses"]
): OverallProgress {
  const allItems = getAllItems(content);
  const total = allItems.length;
  const memorized = allItems.filter((i) => statuses[i.id] === "memorized").length;
  const confused = allItems.filter((i) => statuses[i.id] === "confused").length;
  const review = allItems.filter((i) => statuses[i.id] === "review").length;
  const untouched = total - memorized - confused - review;

  const parts = content.parts.map((p) => calcPartProgress(p, statuses));

  return {
    total,
    memorized,
    confused,
    review,
    untouched,
    percent: total > 0 ? Math.round((memorized / total) * 100) : 0,
    parts,
  };
}

export function getSectionProgress(
  section: Section,
  statuses: UserProgress["itemStatuses"]
) {
  const total = section.items.length;
  const memorized = section.items.filter(
    (i) => statuses[i.id] === "memorized"
  ).length;
  return { total, memorized, percent: total > 0 ? Math.round((memorized / total) * 100) : 0 };
}
