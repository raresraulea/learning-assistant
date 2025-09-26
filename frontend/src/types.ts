export interface DocumentModel {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  subjects: string[];
}

export interface CreateDocumentDto {
  name: string;
  content: string;
  subjects: string[];
}

export interface UpdateDocumentDto {
  name?: string;
  content?: string;
  subjects?: string[];
}

export interface RandomSubjectsRequest {
  count: number;
  documentIds?: number[];
}

// New Exercise and Test types
export interface ExerciseModel {
  id: number;
  title: string;
  content: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface CreateExerciseDto {
  title: string;
  content: string;
  description?: string;
  tags: string[];
}

export interface UpdateExerciseDto {
  title?: string;
  content?: string;
  description?: string;
  tags?: string[];
}

export interface TestModel {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  exerciseCount: number;
  tags: string[];
}

export interface CreateTestDto {
  name: string;
  description?: string;
  exerciseCount: number;
  tags: string[];
  exerciseIds?: number[];
}

export interface TestWithExercisesDto {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  exercises: ExerciseModel[];
}

// Speech Recognition API types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};