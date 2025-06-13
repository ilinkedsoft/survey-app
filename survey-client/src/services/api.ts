import axios from 'axios';
import type { Question, SurveyResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getQuestions = async (): Promise<Question[]> => {
  const response = await api.get('/survey/questions');
  return response.data;
};

export const submitSurvey = async (responses: SurveyResponse[]): Promise<{ submissionId: number }> => {
  const response = await api.post('/survey/submit', { responses });
  return response.data;
}; 