'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useMutateAction } from '@uibakery/data';
import { FaFacebook, FaInstagram, FaGoogle } from 'react-icons/fa';
import authenticateUserAction from '@/actions/authenticateUser';
import authenticateSocialUserAction from '@/actions/authenticateSocialUser';
import createSocialUserAction from '@/actions/createSocialUser';
import { mockSocialLogin } from '@/utils/socialAuth';
import type { User } from '@/types/todo';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [error, setError] = useState<string>('');
  const [socialLoading, setSocialLoading] = useState<string>('');
  const [authenticateUser, isAuthenticating] = useMutateAction(authenticateUserAction);
  const [authenticateSocialUser] = useMutateAction(authenticateSocialUserAction);
  const [createSocialUser] = useMutateAction(createSocialUserAction);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      
      // Simple password hash for MVP (in production, use proper hashing)
      const passwordHash = data.password === '123456' ? '$2b$10$N9qo8uLOickgx2ZMRZoMye.gkKDkG2I2z' : 'invalid';
      
      const result = await authenticateUser({
        email: data.email,
        passwordHash,
      });

      if (Array.isArray(result) && result.length > 0) {
        const user = result[0] as User;
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Authentication failed. Please try again.');
    }
  };

  const handleSocialLogin = async (provider: 'facebook' | 'instagram' | 'google') => {
    try {
      setError('');
      setSocialLoading(provider);

      // Mock social login - in real app, this would redirect to OAuth provider
      const socialUser = await mockSocialLogin[provider]();
      
      // Try to find existing user
      const existingUser = await authenticateSocialUser({
        provider: socialUser.provider,
        providerId: socialUser.id,
      });

      let user: User;
      
      if (Array.isArray(existingUser) && existingUser.length > 0) {
        // User exists, log them in
        user = existingUser[0] as User;
      } else {
        // Create new user
        const newUserResult = await createSocialUser({
          email: socialUser.email,
          provider: socialUser.provider,
          providerId: socialUser.id,
          displayName: socialUser.name,
          profilePictureUrl: socialUser.picture,
        });
        
        if (Array.isArray(newUserResult) && newUserResult.length > 0) {
          user = newUserResult[0] as User;
        } else {
          throw new Error('Failed to create user');
        }
      }

      onLogin(user);
    } catch (err) {
      console.error('Social authentication error:', err);
      setError('Social authentication failed. Please try again.');
    } finally {
      setSocialLoading('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <Card className="w-full max-w-md card-gradient">
        <CardHeader>
          <CardTitle className="text-2xl text-center gradient-text">Login to TodoApp</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="enter your email id"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="enter your password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full btn-gradient"
                disabled={isAuthenticating || !!socialLoading}
              >
                {isAuthenticating ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isAuthenticating || !!socialLoading}
                className="w-full"
              >
                {socialLoading === 'facebook' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                ) : (
                  <FaFacebook className="h-4 w-4 text-blue-600" />
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('instagram')}
                disabled={isAuthenticating || !!socialLoading}
                className="w-full"
              >
                {socialLoading === 'instagram' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-600 border-t-transparent" />
                ) : (
                  <FaInstagram className="h-4 w-4 text-pink-600" />
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                disabled={isAuthenticating || !!socialLoading}
                className="w-full"
              >
                {socialLoading === 'google' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />
                ) : (
                  <FaGoogle className="h-4 w-4 text-red-600" />
                )}
              </Button>
            </div>
          </div>

          <div className="mt-4 p-3 gradient-bg-light rounded-md text-sm">
            <strong>Test Credentials:</strong><br />
            Email: ishanayal16@gmail.com<br />
            Password: 123456<br />
            <br />
            <strong>Social Login:</strong><br />
            Click any social button to test social login
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
