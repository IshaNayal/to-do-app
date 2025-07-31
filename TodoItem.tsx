'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Calendar } from 'lucide-react';
import { useMutateAction } from '@uibakery/data';
import updateTodoAction from '@/actions/updateTodo';
import deleteTodoAction from '@/actions/deleteTodo';
import type { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  userId: number;
  onTodoUpdated: () => void;
}

export function TodoItem({ todo, userId, onTodoUpdated }: TodoItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [updateTodo, isUpdating] = useMutateAction(updateTodoAction);
  const [deleteTodo, isDeleting] = useMutateAction(deleteTodoAction);

  const handleToggleComplete = async () => {
    try {
      await updateTodo({
        todoId: todo.id,
        userId,
        isDone: !todo.is_done,
      });
      onTodoUpdated();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo({
        todoId: todo.id,
        userId,
      });
      setShowDeleteDialog(false);
      onTodoUpdated();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={`p-4 border rounded-lg card-gradient ${todo.is_done ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.is_done}
          onCheckedChange={handleToggleComplete}
          disabled={isUpdating}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${todo.is_done ? 'line-through text-black' : 'text-black'}`}>
            {todo.task}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <Calendar className="h-3 w-3 text-black" />
            <span className="text-xs text-black">
              Created {formatDate(todo.created_at)}
            </span>
            
            {todo.is_done && (
              <Badge className="text-xs badge-gradient">
                Completed
              </Badge>
            )}
          </div>
        </div>
        
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-black hover:text-black hover:bg-gray-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md card-gradient">
            <DialogHeader>
              <DialogTitle className="gradient-text">Delete Task</DialogTitle>
            </DialogHeader>
            
            <p className="text-sm text-black mb-4">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
