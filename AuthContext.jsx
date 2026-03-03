import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'barbershop' or 'client'
  const [loading, setLoading] = useState(true);
  const [membershipTier, setMembershipTier] = useState('free'); // 'free' or 'premium'
  const { toast } = useToast();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = (session) => {
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    
    if (currentUser) {
      // Load user type and tier from metadata
      const type = currentUser.user_metadata?.user_type || 'client';
      const tier = currentUser.user_metadata?.tier || localStorage.getItem('barbeiros_membership_tier') || 'free';
      
      setUserType(type);
      setMembershipTier(tier);
    } else {
      setUserType(null);
      setMembershipTier('free');
    }
    
    setLoading(false);
  };

  const signUp = async (email, password, metadata = {}) => {
    // metadata should include { user_type: 'barbershop' | 'client' }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { ...metadata, tier: 'free' }
      }
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setMembershipTier('free');
    setUserType(null);
    return { error };
  };

  const upgradeToPremium = async () => {
    // Update metadata in Supabase
    if (user) {
      const { error } = await supabase.auth.updateUser({
        data: { tier: 'premium' }
      });
      
      if (!error) {
        setMembershipTier('premium');
        localStorage.setItem('barbeiros_membership_tier', 'premium');
        toast({
          title: "Parabéns! 🌟",
          description: "Agora é membro Premium com acesso a todas as funcionalidades exclusivas.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o plano. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  const downgradeToFree = async () => {
    if (user) {
        const { error } = await supabase.auth.updateUser({
            data: { tier: 'free' }
        });
        
        if (!error) {
            setMembershipTier('free');
            localStorage.setItem('barbeiros_membership_tier', 'free');
            toast({
              title: "Plano alterado",
              description: "A sua subscrição foi alterada para o plano Gratuito.",
            });
        }
    }
  };

  const value = {
    user,
    userType,
    loading,
    membershipTier,
    signUp,
    signIn,
    signOut,
    upgradeToPremium,
    downgradeToFree
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};