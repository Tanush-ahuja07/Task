import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/lib/api';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  searchTerm: string;
  sortBy: 'date' | 'title';
  sortOrder: 'asc' | 'desc';
  filteredNotes: Note[];
  fetchNotes: () => Promise<void>;
  createNote: (title: string, content: string) => Promise<Note | null>;
  updateNote: (id: string, title: string, content: string) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  enhanceNote: (id: string, content?:string) => Promise<string | null>;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: 'date' | 'title') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { token } = useAuth();

  const filteredNotes = React.useMemo(() => {
    let filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [notes, searchTerm, sortBy, sortOrder]);

  const fetchNotes = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const data = await apiService.get('/api/notes');
      setNotes(data.notes || data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to load notes",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (title: string, content: string): Promise<Note | null> => {
    try {
      const data = await apiService.post('/api/notes', { title, content });
      const newNote = data.note || data;
      setNotes(prev => [newNote, ...prev]);
      toast({
        title: "Note created",
        description: "Your note has been saved.",
      });
      return newNote;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create note",
        description: error.message,
      });
      return null;
    }
  };

  const updateNote = async (id: string, title: string, content: string): Promise<boolean> => {
    try {
      const data = await apiService.patch(`/api/notes/${id}`, { title, content });
      const updatedNote = data.note || data;
      setNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
      toast({
        title: "Note updated",
        description: "Your changes have been saved.",
      });
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update note",
        description: error.message,
      });
      return false;
    }
  };

  const deleteNote = async (id: string): Promise<boolean> => {
    try {
      await apiService.delete(`/api/notes/${id}`);
      setNotes(prev => prev.filter(note => note.id !== id));
      toast({
        title: "Note deleted",
        description: "The note has been removed.",
      });
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete note",
        description: error.message,
      });
      return false;
    }
  };

  const enhanceNote = async (id: string, content?:string): Promise<string | null> => {
    try {
      const response = await apiService.post(`/api/notes/${id}/ai/enhance`,{content:content});
      console.log('Enhance response:', response);
       
      let enhanced = response.enhancedContent || response.content || null;
      if (typeof enhanced === 'string') {
        // Remove preceding ```html and any trailing ``` (with or without whitespace)
        enhanced = enhanced.replace(/^```html\s*/i, '').replace(/\s*```\s*$/i, '');
      }
      return enhanced;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Enhancement failed",
        description: "Could not enhance the note at this time.",
      });
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  const value: NotesContextType = {
    notes,
    isLoading,
    searchTerm,
    sortBy,
    sortOrder,
    filteredNotes,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    enhanceNote,
    setSearchTerm,
    setSortBy,
    setSortOrder,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};