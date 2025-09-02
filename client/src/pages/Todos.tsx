import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { TodosList } from '@/components/todos/TodosList';

const Todos = () => {
  return (
    <Layout>
      <TodosList />
    </Layout>
  );
};

export default Todos;