import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { Profile } from './supabase-types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
    isAuthenticated: false
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check active sessions
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setAuthState({
            user: session.user,
            profile,
            session,
            loading: false,
            error: null,
            isAuthenticated: true
          });
        } else {
          setAuthState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            error: null,
            isAuthenticated: false
          });
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Authentication initialization failed',
          isAuthenticated: false
        }));
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setAuthState({
          user: session.user,
          profile,
          session,
          loading: false,
          error: null,
          isAuthenticated: true
        });
      } else {
        setAuthState({
          user: null,
          profile: null,
          session: null,
          loading: false,
          error: null,
          isAuthenticated: false
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data: { session } } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      if (!session) throw new Error('No session created after sign in');

      const profile = await fetchProfile(session.user.id);
      setAuthState({
        user: session.user,
        profile,
        session,
        loading: false,
        error: null,
        isAuthenticated: true
      });
    } catch (error) {
      const message = error instanceof AuthError 
        ? error.message 
        : 'Failed to sign in. Please check your credentials and try again.';
      
      setAuthState(prev => ({
        ...prev,
        error: message,
        isAuthenticated: false
      }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { username }
        }
      });
      
      if (error) throw error;
      if (!data.session) {
        throw new Error('Email confirmation required. Please check your inbox.');
      }

      const profile = await fetchProfile(data.user.id);
      setAuthState({
        user: data.user,
        profile,
        session: data.session,
        loading: false,
        error: null,
        isAuthenticated: true
      });
    } catch (error) {
      const message = error instanceof AuthError 
        ? error.message 
        : 'Registration failed. Please try again.';
      
      setAuthState(prev => ({
        ...prev,
        error: message,
        isAuthenticated: false
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setAuthState({
        user: null,
        profile: null,
        session: null,
        loading: false,
        error: null,
        isAuthenticated: false
      });
    } catch (error) {
      const message = error instanceof AuthError 
        ? error.message 
        : 'Failed to sign out. Please try again.';
      
      setAuthState(prev => ({
        ...prev,
        error: message
      }));
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!authState.user) {
      throw new Error('No authenticated user');
    }

    try {
      const { error, data } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authState.user.id)
        .select()
        .single();

      if (error) throw error;
      
      setAuthState(prev => ({
        ...prev,
        profile: data,
        error: null
      }));
    } catch (error) {
      const message = error instanceof Error 
        ? error.message 
        : 'Failed to update profile. Please try again.';
      
      setAuthState(prev => ({
        ...prev,
        error: message
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({
      ...prev,
      error: null
    }));
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState,
      signIn, 
      signUp, 
      signOut,
      updateProfile,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}