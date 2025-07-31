'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Circle, LogOut, User } from 'lucide-react';
import { useLoadAction } from '@uibakery/data';
import loadTodosAction from '@/actions/loadTodos';
import { AddTodoDialog } from './AddTodoDialog';
import { TodoItem } from './TodoItem';
import type { Todo, User as UserType } from '@/types/todo';

interface TodoListProps {
  user: UserType;
  onLogout: () => void;
}

export function TodoList({ user, onLogout }: TodoListProps) {
  const [todos, loading, error, refresh] = useLoadAction(loadTodosAction, [], { userId: user.id });

  const todoStats = useMemo(() => {
    const todoList = todos as Todo[];
    const completed = todoList.filter(todo => todo.is_done).length;
    const pending = todoList.length - completed;
    return { total: todoList.length, completed, pending };
  }, [todos]);

  const completedTodos = useMemo(() => 
    (todos as Todo[]).filter(todo => todo.is_done), [todos]
  );
  
  const pendingTodos = useMemo(() => 
    (todos as Todo[]).filter(todo => !todo.is_done), [todos]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 spinner-gradient mx-auto mb-4"></div>
          <p className="text-black">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <Card className="max-w-md card-gradient">
          <CardContent className="pt-6">
            <p className="text-center text-black">Failed to load todos. Please try again.</p>
            <Button onClick={refresh} className="w-full mt-4 btn-gradient">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="mb-6 card-gradient">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle className="text-2xl gradient-text">My Tasks</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            
            <div className="text-sm text-black">
              Welcome back, {user.display_name || user.email}!
              {user.provider && user.provider !== 'email' && (
                <span className="text-xs text-gray-600 ml-2">
                  (via {user.provider})
                </span>
              )}
            </div>
            
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Badge className="badge-gradient">{todoStats.total} Total</Badge>
                <Badge className="badge-gradient">{todoStats.pending} Pending</Badge>
                <Badge className="badge-gradient">{todoStats.completed} Completed</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Add Todo */}
        <div className="mb-6">
          <AddTodoDialog userId={user.id} onTodoAdded={refresh} />
        </div>

        {/* Pending Tasks */}
        {pendingTodos.length > 0 && (
          <Card className="mb-6 card-gradient">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Circle className="h-5 w-5" style={{ color: 'var(--gradient-middle)' }} />
                Pending Tasks ({pendingTodos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    userId={user.id}
                    onTodoUpdated={refresh}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Tasks */}
        {completedTodos.length > 0 && (
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5" style={{ color: 'var(--gradient-end)' }} />
                Completed Tasks ({completedTodos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    userId={user.id}
                    onTodoUpdated={refresh}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {todoStats.total === 0 && (
          <Card className="card-gradient">
            <CardContent className="pt-12 pb-12 text-center">
              <Circle className="h-12 w-12 text-black mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">No tasks yet</h3>
              <p className="text-black mb-6">Get started by adding your first task!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
