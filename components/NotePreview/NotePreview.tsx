'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
// Імпорт стилів з правильних папок
import sModal from '@/components/Modal/Modal.module.css'; //
import sDetails from './NoteDetails.module.css'; // (має лежати поруч)

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) return null;

  return (
    <div className={sModal.backdrop} onClick={handleClose}>
      <div className={sModal.modal} onClick={(e) => e.stopPropagation()}>
        {note ? (
          <div className={sDetails.item}>
            <div className={sDetails.header}>
              <h2>{note.title}</h2>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
               <span className={sDetails.tag}>#{note.tag}</span>
               <span className={sDetails.date}>{note.createdAt}</span> 
            </div>
            <p className={sDetails.content}>{note.content}</p>
          </div>
        ) : (
          <p>Note not found</p>
        )}
      </div>
    </div>
  );
}