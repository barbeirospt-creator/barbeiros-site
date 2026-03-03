
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function useUserRoles() {
  const { user } = useAuth();
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole('user');
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        // Task 1: Changed from .single() to .maybeSingle()
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        // Task 1: Handle missing roles gracefully with fallback
        if (data && data.role) {
          setRole(data.role);
        } else {
          setRole('user');
        }
      } catch (err) {
        console.error('Error fetching role:', err);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  // Task 7: Update admin checks to ensure fallback safety
  const safeRole = role || 'user';

  return {
    role: safeRole,
    loading,
    isAdmin: () => safeRole === 'admin',
    isModerator: () => safeRole === 'admin' || safeRole === 'moderator',
    canCreateTopic: () => !!user,
    canReplyToTopic: () => !!user,
    canModerateContent: () => safeRole === 'admin' || safeRole === 'moderator',
    canEditTopic: (authorId) => safeRole === 'admin' || safeRole === 'moderator' || (user && user.id === authorId)
  };
}
