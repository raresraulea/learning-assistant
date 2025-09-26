import axios from 'axios';
import type {
  DocumentModel,
  CreateDocumentDto,
  UpdateDocumentDto,
  RandomSubjectsRequest,
  ExerciseModel,
  CreateExerciseDto,
  UpdateExerciseDto,
  TestModel,
  CreateTestDto,
  TestWithExercisesDto
} from '../types';

const API_BASE_URL = 'https://localhost:7154/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const documentService = {
  async getAllDocuments(): Promise<DocumentModel[]> {
    const response = await api.get<DocumentModel[]>('/documents');
    return response.data;
  },

  async getDocumentById(id: number): Promise<DocumentModel> {
    const response = await api.get<DocumentModel>(`/documents/${id}`);
    return response.data;
  },

  async createDocument(document: CreateDocumentDto): Promise<DocumentModel> {
    const response = await api.post<DocumentModel>('/documents', document);
    return response.data;
  },

  async updateDocument(id: number, document: UpdateDocumentDto): Promise<DocumentModel> {
    const response = await api.put<DocumentModel>(`/documents/${id}`, document);
    return response.data;
  },

  async deleteDocument(id: number): Promise<void> {
    await api.delete(`/documents/${id}`);
  },

  async getRandomSubjects(request: RandomSubjectsRequest): Promise<string[]> {
    const response = await api.post<string[]>('/documents/random-subjects', request);
    return response.data;
  },
};

export const exerciseService = {
  async getAllExercises(): Promise<ExerciseModel[]> {
    const response = await api.get<ExerciseModel[]>('/exercises');
    return response.data;
  },

  async getExerciseById(id: number): Promise<ExerciseModel> {
    const response = await api.get<ExerciseModel>(`/exercises/${id}`);
    return response.data;
  },

  async createExercise(exercise: CreateExerciseDto): Promise<ExerciseModel> {
    const response = await api.post<ExerciseModel>('/exercises', exercise);
    return response.data;
  },

  async updateExercise(id: number, exercise: UpdateExerciseDto): Promise<ExerciseModel> {
    const response = await api.put<ExerciseModel>(`/exercises/${id}`, exercise);
    return response.data;
  },

  async deleteExercise(id: number): Promise<void> {
    await api.delete(`/exercises/${id}`);
  },

  async searchExercises(query?: string, tags?: string[]): Promise<ExerciseModel[]> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (tags) tags.forEach(tag => params.append('tags', tag));

    const response = await api.get<ExerciseModel[]>(`/exercises/search?${params.toString()}`);
    return response.data;
  },
};

export const testService = {
  async getAllTests(): Promise<TestModel[]> {
    const response = await api.get<TestModel[]>('/tests');
    return response.data;
  },

  async getTestById(id: number): Promise<TestWithExercisesDto> {
    const response = await api.get<TestWithExercisesDto>(`/tests/${id}`);
    return response.data;
  },

  async createTest(test: CreateTestDto): Promise<TestModel> {
    const response = await api.post<TestModel>('/tests', test);
    return response.data;
  },

  async generateRandomTest(test: CreateTestDto): Promise<TestWithExercisesDto> {
    const response = await api.post<TestWithExercisesDto>('/tests/generate', test);
    return response.data;
  },

  async deleteTest(id: number): Promise<void> {
    await api.delete(`/tests/${id}`);
  },
};