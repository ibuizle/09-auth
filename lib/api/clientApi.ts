import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

// Notes
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number; // keep for compatibility; backend expects 12
  search?: string;
  tag?: string;
}

export type CreateNoteParams = Pick<Note, 'title' | 'content' | 'tag'>;

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page: params.page,
      perPage: 12,
      ...(params.search ? { search: params.search } : {}),
      ...(params.tag ? { tag: params.tag } : {}),
    },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(note: CreateNoteParams): Promise<Note> {
  const { data } = await api.post<Note>('/notes', note);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

// Auth
export type AuthCredentials = {
  email: string;
  password: string;
};

export async function register(payload: AuthCredentials): Promise<User> {
  const { data } = await api.post<User>('/auth/register', payload);
  return data;
}

export async function login(payload: AuthCredentials): Promise<User> {
  const { data } = await api.post<User>('/auth/login', payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<User | null> {
  const { data } = await api.get<User | null>('/auth/session');
  return data ?? null;
}

// Users
export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me');
  return data;
}

export async function updateMe(payload: Partial<Pick<User, 'username'>>): Promise<User> {
  const { data } = await api.patch<User>('/users/me', payload);
  return data;
}
