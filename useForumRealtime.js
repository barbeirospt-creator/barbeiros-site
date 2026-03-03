
import { useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useForumRealtime({ onTopicUpdate, onReplyUpdate, onModeration }) {
  useEffect(() => {
    const topicsSubscription = supabase.channel('public:forum_topics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_topics' }, payload => {
        if (onTopicUpdate) onTopicUpdate(payload);
      }).subscribe();

    const repliesSubscription = supabase.channel('public:forum_replies')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_replies' }, payload => {
        if (onReplyUpdate) onReplyUpdate(payload);
      }).subscribe();

    const moderationSubscription = supabase.channel('public:forum_moderation')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_moderation' }, payload => {
        if (onModeration) onModeration(payload);
      }).subscribe();

    return () => {
      supabase.removeChannel(topicsSubscription);
      supabase.removeChannel(repliesSubscription);
      supabase.removeChannel(moderationSubscription);
    };
  }, [onTopicUpdate, onReplyUpdate, onModeration]);
}
