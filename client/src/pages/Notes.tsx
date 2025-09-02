import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { NotesList } from '@/components/notes/NotesList';

const Notes = () => {
  return (
    <Layout>
      <NotesList />
    </Layout>
  );
};

export default Notes;