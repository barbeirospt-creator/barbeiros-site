
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AdminAuthContext = createContext();

// Hardcoded admin email
const ADMIN_EMAIL = 'barbeirospt@gmail.com';

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkIfAdmin = (email) => {
    return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  };

  const initializeAdminStatus = async (user) => {
    if (!user) {
      setAdminUser(null);
      localStorage.removeItem('isAdmin');
      return false;
    }

    const isAdmin = checkIfAdmin(user.email);
    
    if (isAdmin) {
      setAdminUser(user);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', user.email);
    } else {
      setAdminUser(null);
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminEmail');
    }
    
    return isAdmin;
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Check localStorage first for quick admin status check
        const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
        const storedAdminEmail = localStorage.getItem('adminEmail');
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Verify stored admin status matches current user
          if (storedIsAdmin && storedAdminEmail === session.user.email) {
            const isAdmin = checkIfAdmin(session.user.email);
            if (isAdmin) {
              setAdminUser(session.user);
            } else {
              // Clear invalid admin status
              await initializeAdminStatus(session.user);
            }
          } else {
            // Re-check admin status
            await initializeAdminStatus(session.user);
          }
        } else {
          // No session - clear admin state
          setAdminUser(null);
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminEmail');
        }
      } catch (error) {
        console.error('Error initializing admin auth:', error);
        setAdminUser(null);
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminEmail');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          await initializeAdminStatus(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setAdminUser(null);
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminEmail');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Attempt Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) throw error;

      // Check if logged-in user is admin
      const isAdmin = checkIfAdmin(data.user.email);
      
      if (!isAdmin) {
        // User authenticated but not admin - sign them out
        await supabase.auth.signOut();
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminEmail');
        
        const errorMessage = 'Access denied - admin privileges required';
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: errorMessage
        });
        
        return { user: null, error: new Error(errorMessage) };
      }

      // User is admin - set admin state
      setAdminUser(data.user);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', data.user.email);
      
      toast({
        title: "Login Successful",
        description: `Welcome, ${data.user.email}`
      });

      return { user: data.user, error: null };
      
    } catch (error) {
      console.error('Admin login error:', error);
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || 'Unable to login. Please check your credentials.'
      });
      
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setAdminUser(null);
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminEmail');
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    adminUser,
    loading,
    login,
    logout,
    isAdmin: !!adminUser && checkIfAdmin(adminUser.email)
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
