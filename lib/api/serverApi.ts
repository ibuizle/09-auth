import { cookies } from 'next/headers';
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
  perPage: number;
  search?: string;
  tag?: string;
}

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page: params.page,
      perPage: 12,
      ...(params.search ? { search: params.search } : {}),
      ...(params.tag ? { tag: params.tag } : {}),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

// Auth
export async function checkSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const { data } = await api.get<User | null>('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data ?? null;
}

// Users
export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const { data } = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}
