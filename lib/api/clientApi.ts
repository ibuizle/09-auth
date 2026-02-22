import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

type FetchNotesParams = {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
};

type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

export async function fetchNotes(params: FetchNotesParams): Promise<NotesResponse> {
  const { data } = await api.get<NotesResponse>('/notes', {
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

export async function createNote(payload: Pick<Note, 'title' | 'content' | 'tag'>): Promise<Note> {
  const { data } = await api.post<Note>('/notes', payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

// -------- AUTH --------
type AuthPayload = {
  email: string;
  password: string;
};

export async function register(payload: AuthPayload): Promise<User> {
  const { data } = await api.post<User>('/auth/register', payload);
  return data;
}

export async function login(payload: AuthPayload): Promise<User> {
  const { data } = await api.post<User>('/auth/login', payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<User | null> {
  const { data } = await api.get<User | null>('/auth/session');
  return data;
}

// -------- USER --------
export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me');
  return data;
}

export async function updateMe(payload: Partial<User>): Promise<User> {
  const { data } = await api.patch<User>('/users/me', payload);
  return data;
}