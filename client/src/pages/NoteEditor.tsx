import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { NoteEditor } from '@/components/notes/NoteEditor';

const NoteEditorPage = () => {
  return (
    <Layout>
      <NoteEditor />
    </Layout>
  );
};

export default NoteEditorPage;