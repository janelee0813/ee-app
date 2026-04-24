export type ContentType = "full" | "exam-outline";

export type ItemType =
  | "sentence"
  | "dialogue"
  | "verse"
  | "example"
  | "transition"
  | "prayer"
  | "heading";

export type StudyStatus = "memorized" | "confused" | "review";

export interface StudyItem {
  id: string;
  type: ItemType;
  speaker?: string;
  text: string;
  keywords?: string[];
  reference?: string;
}

export interface Section {
  id: string;
  title: string;
  items: StudyItem[];
}

export interface Part {
  id: string;
  title: string;
  sections: Section[];
}

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  parts: Part[];
}

export interface UserProgress {
  itemStatuses: {
    [itemId: string]: StudyStatus;
  };
  lastStudied: {
    contentId: string;
    partId: string;
    sectionId: string;
    itemId?: string;
  } | null;
  wrongAnswers: {
    itemId: string;
    contentId: string;
    partId: string;
    sectionId: string;
    timestamp: number;
  }[];
}

export type Difficulty = "easy" | "medium" | "hard";

export interface BlankItem {
  item: StudyItem;
  blankedText: string;
  hiddenKeywords: string[];
  revealed: boolean;
  status?: "correct" | "confused";
}
