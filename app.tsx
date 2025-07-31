'use client';

import { useState, useEffect } from 'react';
import '@/styles/globals.css';
import { LoginForm } from '@/components/LoginForm';
import { TodoList } from '@/components/TodoList';
import { Toaster } from '@/components/ui/toaster';
import { sessionManager } from '@/utils/sessionManager';
import type { User } from '@/types/todo';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const session = sessionManager.getSession();
    if (session && session.isLoggedIn) {
      setUser({ 
        id: session.userId, 
        email: session.email,
        display_name: session.displayName,
        profile_picture_url: session.profilePictureUrl,
        provider: session.provider
      });
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    sessionManager.setSession({ 
      userId: userData.id, 
      email: userData.email,
      displayName: userData.display_name,
      profilePictureUrl: userData.profile_picture_url,
      provider: userData.provider
    });
    setUser(userData);
  };

  const handleLogout = () => {
    sessionManager.logout();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-4 spinner-gradient"></div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <TodoList user={user} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
      <Toaster />
    </>
  );
}

export default App;
