import { StudyItem, Difficulty, BlankItem } from "@/types";

export function generateBlankText(
  text: string,
  keywords: string[],
  difficulty: Difficulty
): { blankedText: string; hiddenKeywords: string[] } {
  if (!keywords || keywords.length === 0) {
    return { blankedText: text, hiddenKeywords: [] };
  }

  let count = 1;
  if (difficulty === "medium") count = 2;
  if (difficulty === "hard") count = keywords.length;

  // 키워드 중 실제로 텍스트에 있는 것만 필터링
  const validKeywords = keywords.filter((kw) => text.includes(kw));
  if (validKeywords.length === 0) {
    return { blankedText: text, hiddenKeywords: [] };
  }

  const shuffled = [...validKeywords].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  let blankedText = text;

  // 긴 키워드부터 처리 (부분 매칭 방지)
  const sorted = [...selected].sort((a, b) => b.length - a.length);
  for (const kw of sorted) {
    blankedText = blankedText.replace(kw, "（　　　）");
  }

  return { blankedText, hiddenKeywords: selected };
}

export function generateBlankItems(
  items: StudyItem[],
  difficulty: Difficulty
): BlankItem[] {
  return items
    .filter(
      (item) =>
        item.keywords &&
        item.keywords.length > 0 &&
        item.type !== "heading"
    )
    .map((item) => {
      const { blankedText, hiddenKeywords } = generateBlankText(
        item.text,
        item.keywords!,
        difficulty
      );
      return {
        item,
        blankedText,
        hiddenKeywords,
        revealed: false,
        status: undefined,
      };
    })
    .filter((bi) => bi.hiddenKeywords.length > 0);
}
