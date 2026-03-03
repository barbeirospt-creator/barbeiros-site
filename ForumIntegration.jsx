
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useForumRealtime } from '@/hooks/useForumRealtime';

const ForumContext = createContext(null);

export function ForumIntegration({ children }) {
  // Task 5: Handle missing roles or null responses from useUserRoles gracefully
  const rawRoles = useUserRoles();
  
  // Default fallback if useUserRoles returns null or undefined
  const defaultRoles = {
    role: 'user',
    loading: false,
    isAdmin: () => false,
    isModerator: () => false,
    canCreateTopic: () => false,
    canReplyToTopic: () => false,
    canModerateContent: () => false,
    canEditTopic: () => false
  };

  const roles = rawRoles || defaultRoles;

  const [stats, setStats] = useState({ totalTopics: 0, pendingModeration: 0 });

  useForumRealtime({
    onTopicUpdate: () => console.log('Topic updated, refresh needed'),
    onReplyUpdate: () => console.log('Reply updated, refresh needed')
  });

  return (
    <ForumContext.Provider value={{ roles, stats, setStats }}>
      {children}
    </ForumContext.Provider>
  );
}

export const useForumContext = () => useContext(ForumContext);
