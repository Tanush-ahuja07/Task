import React from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '@/contexts/NotesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, FileText, Calendar, SortAsc, SortDesc, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export const NotesList = () => {
  const {
    filteredNotes,
    isLoading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useNotes();

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-24" />
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Notes</h1>
          <p className="text-muted-foreground mt-1">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
          </p>
        </div>
        <Button asChild className="gradient-primary text-white shadow-[var(--shadow-elegant)]">
          <Link to="/notes/new" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </Link>
        </Button>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search notes by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 border-border focus:ring-primary focus:border-primary"
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32 h-12">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={toggleSortOrder}
          className="w-24 h-12 border-border hover:bg-card-hover"
        >
          {sortOrder === 'asc' ? (
            <SortAsc className="w-4 h-4" />
          ) : (
            <SortDesc className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <Link key={note.id} to={`/notes/${note.id}`}>
              <Card className="card-elegant hover:shadow-[var(--shadow-card-hover)] transition-[var(--transition-smooth)] cursor-pointer group">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-[var(--transition-smooth)] line-clamp-2">
                        {note.title || 'Untitled'}
                      </h3>
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                    </div>
                    
                    <div 
                      className="text-sm text-muted-foreground line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: note.content?.replace(/<[^>]*>/g, '') || 'No content'
                      }}
                    />
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {note.content?.replace(/<[^>]*>/g, '').split(' ').length || 0} words
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            {searchTerm ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Create your first note to get started organizing your thoughts'
            }
          </p>
          {!searchTerm && (
            <Button asChild className="gradient-primary text-white shadow-[var(--shadow-elegant)]">
              <Link to="/notes/new" className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Your First Note</span>
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};