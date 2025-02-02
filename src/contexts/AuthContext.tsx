import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, SignInParams, SignUpParams } from '../types';



const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const storedSession = await AsyncStorage.getItem('supabaseSession');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        setUser(session.user);
      }
      setLoading(false);
    };

    setLoading(true);
    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          await AsyncStorage.setItem('supabaseSession', JSON.stringify(session));
        } else {
          await AsyncStorage.removeItem('supabaseSession');
        }
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
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
        if (params.code) {
          const { error } = await supabase.auth.verifyOtp({
            phone: params.phone,
            token: params.code,
            type: 'sms',
          });
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.signInWithOtp({
            phone: params.phone
          });
          if (error) throw error;
        }
      }
    } catch (error) {
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
            type: 'sms',
          });
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.signUp({
            phone: params.phone,
            password: ''
          });
          if (error) throw error;
        }
      }
    } catch (error) {
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

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signIn, 
        signUp, 
        signOut,
        authError 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);