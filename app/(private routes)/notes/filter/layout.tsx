import React from 'react';
import s from './LayoutNotes.module.css'; //

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function FilterLayout({ children, sidebar }: LayoutProps) {
  return (
    <div className={s.container}>
      <aside className={s.sidebar}>
        {sidebar}
      </aside>
      <div className={s.notesWrapper}>
        {children}
      </div>
    </div>
  );
}