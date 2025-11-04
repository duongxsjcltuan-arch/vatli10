// FIX: Provided full content for types.ts to define shared types and resolve module errors.
export enum Section {
  HERO = 'hero',
  THEORY = 'lý thuyết',
  SIMULATION = 'mô phỏng',
  PRACTICE = 'luyện tập',
  TUTOR = 'gia sư',
  VIDEO = 'video',
  FLASHCARD = 'flashcard',
  CLASSROOM = 'lớp học',
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
}

export interface PracticeQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}