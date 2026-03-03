
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useProfileSync } from '@/hooks/useProfileSync';

const AuthContext = createContext(undefined);

export const SupabaseAuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('user');

  useProfileSync(user);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    
    if (session?.user) {
      // Task 4: Fetch user role gracefully with .maybeSingle() and fallback
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();
          
        if (data && data.role) {
          setUserRole(data.role);
          setUser({ ...session.user, role: data.role });
        } else {
          setUserRole('user');
          setUser({ ...session.user, role: 'user' });
        }
      } catch (err) {
        console.error("Failed to fetch user role, defaulting to 'user':", err);
        setUserRole('user');
        setUser({ ...session.user, role: 'user' });
      }
    } else {
      setUser(null);
      setUserRole('user');
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    const { error } = await supabase.auth.signUp({ email, password, options });
    if (error) {
      toast({ variant: "destructive", title: "Sign up Failed", description: error.message });
    }
    return { error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ variant: "destructive", title: "Sign in Failed", description: error.message });
    }
    return { error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ variant: "destructive", title: "Sign out Failed", description: error.message });
    }
    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user, session, loading, userRole, signUp, signIn, signOut
  }), [user, session, loading, userRole, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an SupabaseAuthProvider');
  }
  return context;
};

// Export useSupabaseAuth as an alias to useAuth for backward compatibility and consistency
export const useSupabaseAuth = useAuth;
