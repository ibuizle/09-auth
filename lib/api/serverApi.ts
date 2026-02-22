import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';
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
  const cookieStore = await cookies();

  const { data } = await api.get<NotesResponse>('/notes', {
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

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();

  const { data } = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
}

// ✅ важливо: повний AxiosResponse
export async function checkSession(): Promise<AxiosResponse<User | null>> {
  const cookieStore = await cookies();

  return api.get<User | null>('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
}