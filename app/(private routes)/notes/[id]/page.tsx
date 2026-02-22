import type { Metadata } from 'next';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params; // 🔥 ОБОВ'ЯЗКОВО await

  try {
    const note = await fetchNoteById(id);

    const title = `${note.title} | NoteHub`;
    const description =
      note.content?.replace(/\s+/g, ' ').trim().slice(0, 140) ||
      'View note details in NoteHub.';
    const url = `https://notehub.app/notes/${encodeURIComponent(id)}`;

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
  } catch {
    return {
      title: 'Note not found | NoteHub',
      description: 'This note does not exist in NoteHub.',
    };
  }
}

export default async function NoteDetailsPage(props: Props) {
  const queryClient = new QueryClient();

  const { id } = await props.params; // 🔥 теж await

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}