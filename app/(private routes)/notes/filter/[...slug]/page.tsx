import type { Metadata } from 'next';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params; // 🔥 ОБОВ'ЯЗКОВО await

  const rawTag = slug?.[0] ?? 'all';
  const tag = decodeURIComponent(rawTag);

  const isAll = tag === 'all';
  const title = isAll ? 'All notes | NoteHub' : `${tag} notes | NoteHub`;
  const description = isAll
    ? 'Browse all notes in NoteHub.'
    : `Browse notes filtered by "${tag}" in NoteHub.`;

  const url = `https://notehub.app/notes/filter/${slug?.map(encodeURIComponent).join('/')}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params; // 🔥 теж await
  const tag = slug?.[0] ?? 'all';

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: '',
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}