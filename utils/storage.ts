import { UserProgress, StudyStatus } from "@/types";

const STORAGE_KEY = "ee_progress";

const defaultProgress: UserProgress = {
  itemStatuses: {},
  lastStudied: null,
  wrongAnswers: [],
};

export function getProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return JSON.parse(raw) as UserProgress;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.error("Failed to save progress");
  }
}

export function setItemStatus(itemId: string, status: StudyStatus): void {
  const progress = getProgress();
  progress.itemStatuses[itemId] = status;
  saveProgress(progress);
}

export function getItemStatus(itemId: string): StudyStatus | undefined {
  const progress = getProgress();
  return progress.itemStatuses[itemId];
}

export function setLastStudied(
  contentId: string,
  partId: string,
  sectionId: string,
  itemId?: string
): void {
  const progress = getProgress();
  progress.lastStudied = { contentId, partId, sectionId, itemId };
  saveProgress(progress);
}

export function addWrongAnswer(
  itemId: string,
  contentId: string,
  partId: string,
  sectionId: string
): void {
  const progress = getProgress();
  // 중복 제거 후 최신 기록 추가
  progress.wrongAnswers = progress.wrongAnswers.filter(
    (w) => w.itemId !== itemId
  );
  progress.wrongAnswers.push({
    itemId,
    contentId,
    partId,
    sectionId,
    timestamp: Date.now(),
  });
  progress.itemStatuses[itemId] = "confused";
  saveProgress(progress);
}

export function clearItemStatus(itemId: string): void {
  const progress = getProgress();
  delete progress.itemStatuses[itemId];
  progress.wrongAnswers = progress.wrongAnswers.filter(
    (w) => w.itemId !== itemId
  );
  saveProgress(progress);
}

export function resetAllProgress(): void {
  saveProgress(defaultProgress);
}
