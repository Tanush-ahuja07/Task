import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '@/contexts/NotesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Trash2, Sparkles, Loader2, Check, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const NoteEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, createNote, updateNote, deleteNote, enhanceNote, isLoading } = useNotes();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState('');
  const [showEnhancedPreview, setShowEnhancedPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const isNew = id === 'new';
  const note = isNew ? null : notes.find(n => n.id === id);

  useEffect(() => {
    if (!isNew && note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note, isNew]);

  useEffect(() => {
    setHasChanges(true);
  }, [title, content]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;

    setIsSaving(true);
    try {
      if (isNew) {
        const newNote = await createNote(title || 'Untitled', content);
        if (newNote) {
          navigate(`/notes/${newNote.id}`);
        }
      } else {
        const success = await updateNote(id!, title, content);
        if (success) {
          setHasChanges(false);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew || !id) return;
    
    const success = await deleteNote(id);
    if (success) {
      navigate('/notes');
    }
  };

  const handleEnhance = async () => {
    if (!content.trim()) return;

    setIsEnhancing(true);
    try {
      const enhanced = await enhanceNote(id,content);
      if (enhanced) {
        setEnhancedContent(enhanced);
        setShowEnhancedPreview(true);
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  const acceptEnhancement = () => {
    // updateNote(id!, title, enhancedContent);
    setContent(enhancedContent);
    setShowEnhancedPreview(false);
    setEnhancedContent('');
    setHasChanges(true);
  };

  const discardEnhancement = () => {
    setShowEnhancedPreview(false);
    setEnhancedContent('');
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
  };

  if (isLoading && !isNew) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isNew && !note) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-card-foreground">Note not found</h2>
        <p className="text-muted-foreground mt-2">The note you're looking for doesn't exist.</p>
        <Button 
          onClick={() => navigate('/notes')} 
          className="mt-4"
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/notes')}
              className="hover:bg-card-hover"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-card-foreground">
              {isNew ? 'New Note' : 'Edit Note'}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={handleEnhance}
              disabled={!content.trim() || isEnhancing}
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              {isEnhancing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isEnhancing ? 'Enhancing...' : 'Enhance'}
            </Button>

            {!isNew && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Note</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the note "{title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button 
              onClick={handleSave}
              disabled={(!title.trim() && !content.trim()) || isSaving}
              className="gradient-primary text-white shadow-[var(--shadow-elegant)]"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Editor */}
        <Card className="card-elegant">
          <CardHeader className="pb-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-card-foreground font-medium">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="text-xl  font-semibold border-1 shadow-none px-0 py-2 focus:ring-0 focus:border-0 placeholder:text-muted-foreground"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-card-foreground font-medium">Content</Label>
              <div className="min-h-[400px] border border-border rounded-lg overflow-hidden bg-background" style={{ padding: '16px' }}>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  placeholder="Start writing your note..."
                  style={{ height: '400px', padding: '8px', paddingBottom: '32px' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

      
      </div>

      {/* Enhancement Preview Dialog */}
      <Dialog open={showEnhancedPreview} onOpenChange={setShowEnhancedPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-white overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span>AI Enhanced Version</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: enhancedContent }} />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={discardEnhancement}>
                <X className="w-4 h-4 mr-2" />
                Discard
              </Button>
              <Button onClick={acceptEnhancement} className="bg-success hover:bg-success/90 text-success-foreground">
                <Check className="w-4 h-4 mr-2" />
                Accept Enhancement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};