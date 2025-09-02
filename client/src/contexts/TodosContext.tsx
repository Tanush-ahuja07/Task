import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/lib/api';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Todo {
  id: string;
  task: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';

interface TodosContextType {
  todos: Todo[];
  isLoading: boolean;
  filter: TodoFilter;
  filteredTodos: Todo[];
  fetchTodos: () => Promise<void>;
  createTodo: (task: string) => Promise<Todo | null>;
  updateTodo: (id: string, task: string, completed: boolean) => Promise<boolean>;
  deleteTodo: (id: string) => Promise<boolean>;
  toggleTodo: (id: string) => Promise<boolean>;
  setFilter: (filter: TodoFilter) => void;
  completedCount: number;
  activeCount: number;
}

const TodosContext = createContext<TodosContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodosContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodosProvider');
  }
  return context;
};

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const { token } = useAuth();

  const filteredTodos = React.useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.filter(todo => !todo.completed).length;

  const fetchTodos = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const data = await apiService.get('/api/todos');
      setTodos(data.todos || data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to load todos",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTodo = async (task: string): Promise<Todo | null> => {
    try {
      const data = await apiService.post('/api/todos', { task, completed: false });
      const newTodo = data.todo || data;
      setTodos(prev => [newTodo, ...prev]);
      toast({
        title: "Todo created",
        description: "New task added to your list.",
      });
      return newTodo;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create todo",
        description: error.message,
      });
      return null;
    }
  };

  const updateTodo = async (id: string, task: string, completed: boolean): Promise<boolean> => {
    try {
      const data = await apiService.patch(`/api/todos/${id}`, { task, completed });
      const updatedTodo = data.todo || data;
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
      toast({
        title: "Todo updated",
        description: "Task has been updated.",
      });
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update todo",
        description: error.message,
      });
      return false;
    }
  };

  const deleteTodo = async (id: string): Promise<boolean> => {
    try {
      await apiService.delete(`/api/todos/${id}`);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast({
        title: "Todo deleted",
        description: "Task has been removed.",
      });
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete todo",
        description: error.message,
      });
      return false;
    }
  };

  const toggleTodo = async (id: string): Promise<boolean> => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return false;

    try {
      const data = await apiService.patch(`/api/todos/${id}`, { 
        task: todo.task, 
        completed: !todo.completed 
      });
      const updatedTodo = data.todo || data;
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update todo",
        description: error.message,
      });
      return false;
    }
  };

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  const value: TodosContextType = {
    todos,
    isLoading,
    filter,
    filteredTodos,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    completedCount,
    activeCount,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};