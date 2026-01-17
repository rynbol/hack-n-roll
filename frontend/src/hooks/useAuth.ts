import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabase';
import {Session, User} from '@supabase/supabase-js';

/**
 * Authentication hook
 * Manages user authentication state and provides auth methods
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign in with phone number (OTP)
   */
  const signInWithPhone = async (phone: string) => {
    const {data, error} = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) throw error;
    return data;
  };

  /**
   * Verify OTP code
   */
  const verifyOtp = async (phone: string, token: string) => {
    const {data, error} = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) throw error;
    return data;
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    session,
    user,
    loading,
    isAuthenticated: !!user,
    signInWithPhone,
    verifyOtp,
    signOut,
  };
}
