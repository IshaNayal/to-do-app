interface SessionData {
  userId: number;
  email: string;
  displayName?: string;
  profilePictureUrl?: string;
  provider?: string;
  isLoggedIn: boolean;
}

class SessionManager {
  private storageKey = 'todoapp_session';

  setSession(userData: { userId: number; email: string; displayName?: string; profilePictureUrl?: string; provider?: string }): void {
    const sessionData: SessionData = {
      ...userData,
      isLoggedIn: true,
    };
    localStorage.setItem(this.storageKey, JSON.stringify(sessionData));
  }

  getSession(): SessionData | null {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const session = this.getSession();
    return session?.isLoggedIn ?? false;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  getCurrentUserId(): number | null {
    const session = this.getSession();
    return session?.userId ?? null;
  }
}

export const sessionManager = new SessionManager();
