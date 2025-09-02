import React, { useState } from 'react';
import { useTodos, TodoFilter } from '@/contexts/TodosContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, CheckCircle, Circle, ListTodo, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const TodosList = () => {
  const {
    filteredTodos,
    isLoading,
    filter,
    setFilter,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    activeCount,
    completedCount,
  } = useTodos();

  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const success = await createTodo(newTodoText.trim());
    if (success) {
      setNewTodoText('');
    }
  };

  const handleEditTodo = (id: string, currentText: string) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingText.trim()) return;

    const todo = filteredTodos.find(t => t.id === editingId);
    if (!todo) return;

    const success = await updateTodo(editingId, editingText.trim(), todo.completed);
    if (success) {
      setEditingId(null);
      setEditingText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleToggleTodo = async (id: string) => {
    await toggleTodo(id);
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
  };

  const filterOptions: { value: TodoFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: activeCount + completedCount },
    { value: 'active', label: 'Active', count: activeCount },
    { value: 'completed', label: 'Completed', count: completedCount },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-20" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Todos</h1>
          <p className="text-muted-foreground mt-1">
            {activeCount} active, {completedCount} completed
          </p>
        </div>

        {/* New Todo Form */}
        <Card className="card-elegant">
          <CardContent className="p-4">
            <form onSubmit={handleCreateTodo} className="flex gap-3">
              <div className="relative flex-1">
                <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="Add a new todo..."
                  className="pl-10 h-12 border-border focus:ring-primary focus:border-primary"
                />
              </div>
              <Button 
                type="submit" 
                disabled={!newTodoText.trim()}
                className="gradient-primary text-white shadow-[var(--shadow-elegant)] h-12 px-6"
              >
                Add Todo
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {filterOptions.map(({ value, label, count }) => (
          <Button
            key={value}
            onClick={() => setFilter(value)}
            variant={filter === value ? 'default' : 'outline'}
            className={`h-10 ${
              filter === value 
                ? 'bg-primary text-primary-foreground' 
                : 'border-border hover:bg-card-hover'
            }`}
          >
            {label}
            <Badge 
              variant="secondary" 
              className={`ml-2 ${
                filter === value 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Todos List */}
      {filteredTodos.length > 0 ? (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <Card key={todo.id} className="card-elegant">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleTodo(todo.id)}
                    className="w-5 h-5"
                  />
                  
                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                        />
                        <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p 
                          className={`text-card-foreground ${
                            todo.completed 
                              ? 'line-through text-muted-foreground' 
                              : ''
                          }`}
                        >
                          {todo.task}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created {format(new Date(todo.createdAt), 'MMM d, yyyy')}
                          </span>
                          {todo.completed && (
                            <Badge 
                              variant="secondary" 
                              className="bg-success-subtle text-success text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {editingId !== todo.id && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditTodo(todo.id, todo.task)}
                        className="hover:bg-card-hover"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this todo? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteTodo(todo.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ListTodo className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            {filter === 'completed' 
              ? 'No completed todos' 
              : filter === 'active' 
                ? 'No active todos' 
                : 'No todos yet'
            }
          </h3>
          <p className="text-muted-foreground">
            {filter === 'completed' 
              ? 'Complete some todos to see them here' 
              : filter === 'active' 
                ? 'All your todos are completed!' 
                : 'Add your first todo to get organized'
            }
          </p>
        </div>
      )}
    </div>
  );
};