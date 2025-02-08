import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthContextType, SignInParams, SignUpParams } from '../types';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });
  
        return () => subscription?.unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, []);

  const signIn = async (params: SignInParams) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      if (params.method === 'email') {
        const { error } = await supabase.auth.signInWithPassword({
          email: params.email,
          password: params.password,
        });
        if (error) throw error;
      }
      else if (params.method === 'google') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
        });
        if (error) throw error;
      }
      else if (params.method === 'otp') {
        console.info('Inside OTP')
        if (params.code) {
          console.info('Verifying OTP')
          const { error } = await supabase.auth.verifyOtp({
            phone: `+91${params.phone}`,
            token: params.code,
            type: 'sms',
          });
          if (error) throw error;
        } else {
          console.info('Generate OTP')
          const { error } = await supabase.auth.signInWithOtp({
            phone: `+91${params.phone}`
          });
          if (error) throw error;
        }
      }
      console.info('User is successfully authenticated.')
    } catch (error) {
      console.error('Error while authentication.', error)
      setAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (params: SignUpParams) => {
    setLoading(true);
    setAuthError(null);

    try {
      if (params.method === 'email') {
        const { error } = await supabase.auth.signUp({
          email: params.email,
          password: params.password,
          options: {
            data: {
              displayName: params.displayName
            }
          }
        });
        if (error) throw error;
      }
      else if (params.method === 'phone') {
        if (params.code) {
          const { error } = await supabase.auth.verifyOtp({
            phone: params.phone,
            token: params.code,
            type: 'sms'
          });
          if (error) throw error;
        } else {
          console.log('Inside sign up for phone')
          const { error } = await supabase.auth.signUp({
            phone: `${+91}params.phone`,
            password: params.password,
            options: {
              data: {
                displayName: params.displayName
              }
            }
          })
          if (error) throw error;
        }
      }
    } catch (error) {
      console.log('Error while signup', error)
      setAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      setAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    signIn,
    signUp,
    signOut,
    authError
  }), [user, loading, authError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);