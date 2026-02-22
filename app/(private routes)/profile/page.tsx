import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import css from './page.module.css';
import { getMe } from '@/lib/api/serverApi';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'Your profile in NoteHub.',
  openGraph: {
    title: 'Profile | NoteHub',
    description: 'Your profile in NoteHub.',
    url: 'https://notehub.app/profile',
    images: [{ url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg' }],
  },
};

export default async function ProfilePage() {
  const user = await getMe().catch(() => null);

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" prefetch={false} className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || 'https://ac.goit.global/fullstack/react/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user?.username ?? 'your_username'}</p>
          <p>Email: {user?.email ?? 'your_email@example.com'}</p>
        </div>
      </div>
    </main>
  );
}
