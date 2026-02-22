'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api/clientApi';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';

import css from '../../NotesPage.module.css';

interface Props {
  tag: string;
}

export default function NotesClient({ tag }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 500);

  const handleSearch = (value: string) => {
    setCurrentPage(1);
    debouncedSearch(value);
  };

  // лишаємо оригінальний tag (щоб не зламати "Todo/Work/Personal...")
  const rawTag = tag ?? '';
  // тільки для перевірки "all" — робимо lower
  const isAll = rawTag.trim().toLowerCase() === 'all';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', currentPage, search, rawTag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search,
        ...(rawTag && !isAll ? { tag: rawTag } : {}),
      }),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [rawTag]);

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />

        <Link
          href="/notes/action/create"
          className={css.button}
          aria-label="Create note"
          prefetch={false}
        >
          Create note +
        </Link>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {!isLoading && !isError && data && (
        <>
          {data.notes.length > 0 ? <NoteList notes={data.notes} /> : <p>No notes found</p>}

          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          />
        </>
      )}
    </div>
  );
}