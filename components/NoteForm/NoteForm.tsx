'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { createNote, type CreateNoteParams } from '@/lib/api/clientApi';
import { useNoteStore } from '@/lib/store/noteStore';
import type { NoteTag } from '@/types/note';

import css from './NoteForm.module.css';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, resetDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: (payload: CreateNoteParams) => createNote(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      resetDraft();
      router.back();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: CreateNoteParams = {
      title: draft.title.trim(),
      content: draft.content.trim(),
      tag: draft.tag,
    };

    mutation.mutate(payload);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.field}>
        <label htmlFor="title" className={css.label}>
          Title
        </label>
        <input
          id="title"
          className={css.input}
          type="text"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          required
        />
      </div>

      <div className={css.field}>
        <label htmlFor="content" className={css.label}>
          Content
        </label>
        <textarea
          id="content"
          className={css.textarea}
          value={draft.content}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          required
        />
      </div>

      <div className={css.field}>
        <label htmlFor="tag" className={css.label}>
          Tag
        </label>
        <select
          id="tag"
          className={css.select}
          value={draft.tag}
          onChange={(e) => setDraft({ ...draft, tag: e.target.value as NoteTag })}
          required
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button className={css.submitButton} type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save'}
        </button>

        <button
          className={css.cancelButton}
          type="button"
          onClick={() => router.back()}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
      </div>

      {mutation.isError && <p className={css.error}>Error creating note</p>}
    </form>
  );
}