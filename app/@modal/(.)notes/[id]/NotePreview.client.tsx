'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';

import Modal from '@/components/Modal/Modal';

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal isOpen onClose={handleClose}>
      {isLoading && <p>Loading note...</p>}

      {isError && <p>Failed to load note.</p>}

      {!isLoading && !isError && data && (
        <div onClick={(e) => e.stopPropagation()}>
          {/* Видима кнопка закриття */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 12,
            }}
          >
            <button type="button" onClick={handleClose}>
              Close
            </button>
          </div>

          <h2>{data.title}</h2>

          <p>
            <b>Tag:</b> {data.tag}
          </p>

          <p>
            <b>Created:</b>{' '}
            {data.createdAt ? new Date(data.createdAt).toLocaleString() : '—'}
          </p>

          <p>{data.content}</p>
        </div>
      )}
    </Modal>
  );
}
