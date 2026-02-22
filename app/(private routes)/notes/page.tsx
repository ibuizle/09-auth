import { redirect } from 'next/navigation';

export default function NotesIndexPage() {
  redirect('/notes/filter/all');
}
