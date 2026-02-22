import { create } from 'zustand';
import type { NoteTag } from '@/types/note';

type NoteDraft = {
  title: string;
  content: string;
  tag: NoteTag;
};

export type NoteStore = {
  draft: NoteDraft;
  setDraft: (draft: NoteDraft) => void;
  resetDraft: () => void;
};

const initialDraft: NoteDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteStore>()((set) => ({
  draft: initialDraft,
  setDraft: (draft) => set({ draft }),
  resetDraft: () => set({ draft: initialDraft }),
}));