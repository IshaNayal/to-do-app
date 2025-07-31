'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus } from 'lucide-react';
import { useMutateAction } from '@uibakery/data';
import createTodoAction from '@/actions/createTodo';

const todoSchema = z.object({
  task: z.string().min(1, 'Task cannot be empty').max(500, 'Task is too long'),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface AddTodoDialogProps {
  userId: number;
  onTodoAdded: () => void;
}

export function AddTodoDialog({ userId, onTodoAdded }: AddTodoDialogProps) {
  const [open, setOpen] = useState(false);
  const [createTodo, isCreating] = useMutateAction(createTodoAction);

  const form = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      task: '',
    },
  });

  const onSubmit = async (data: TodoFormData) => {
    try {
      await createTodo({
        userId,
        task: data.task.trim(),
      });
      
      form.reset();
      setOpen(false);
      onTodoAdded();
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full btn-gradient">
          <Plus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md card-gradient">
        <DialogHeader>
          <DialogTitle className="gradient-text">Add New Task</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="What needs to be done?"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1 btn-gradient"
                disabled={isCreating}
              >
                {isCreating ? 'Adding...' : 'Add Task'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
