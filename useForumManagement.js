
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useForumManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase.from('forum_categories').select('*');
    if (error) throw error;
    return data;
  }, []);

  const fetchTopics = useCallback(async (options = {}) => {
    setLoading(true);
    let query = supabase.from('forum_topics').select(`
      *,
      forum_categories(name, color),
      profiles:user_id(full_name, avatar_url)
    `).order('created_at', { ascending: false });

    if (options.status) query = query.eq('status', options.status);
    if (options.category_id) query = query.eq('category_id', options.category_id);
    
    const { data, error } = await query;
    setLoading(false);
    if (error) throw error;
    return data;
  }, []);

  const fetchTopicDetails = useCallback(async (topicId) => {
    const { data: topic, error: topicError } = await supabase
      .from('forum_topics')
      .select('*, forum_categories(name, color), profiles:user_id(full_name, avatar_url)')
      .eq('id', topicId)
      .single();
    
    if (topicError) throw topicError;

    const { data: replies, error: repliesError } = await supabase
      .from('forum_replies')
      .select('*, profiles:user_id(full_name, avatar_url)')
      .eq('post_id', topicId) // mapping to existing schema structure
      .order('created_at', { ascending: true });

    if (repliesError) throw repliesError;

    return { topic, replies };
  }, []);

  const invokeAction = async (action, payload) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('forum-api', {
        body: { action, payload }
      });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchCategories,
    fetchTopics,
    fetchTopicDetails,
    createTopic: (payload) => invokeAction('create_topic', payload),
    createReply: (payload) => invokeAction('create_reply', payload),
    moderateContent: (payload) => invokeAction('moderate_content', payload)
  };
}
