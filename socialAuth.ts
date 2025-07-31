// Mock social authentication utilities
// In a real app, these would integrate with actual OAuth providers

export interface SocialUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  provider: 'facebook' | 'instagram' | 'google';
}

// Mock social login functions
export const mockSocialLogin = {
  facebook: (): Promise<SocialUser> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'fb_' + Math.random().toString(36).substr(2, 9),
          email: 'user@facebook.com',
          name: 'Facebook User',
          picture: '/assets/images/default.svg',
          provider: 'facebook'
        });
      }, 1000);
    });
  },

  instagram: (): Promise<SocialUser> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'ig_' + Math.random().toString(36).substr(2, 9),
          email: 'user@instagram.com',
          name: 'Instagram User',
          picture: '/assets/images/default.svg',
          provider: 'instagram'
        });
      }, 1000);
    });
  },

  google: (): Promise<SocialUser> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'google_' + Math.random().toString(36).substr(2, 9),
          email: 'user@google.com',
          name: 'Google User',
          picture: '/assets/images/default.svg',
          provider: 'google'
        });
      }, 1000);
    });
  }
};
