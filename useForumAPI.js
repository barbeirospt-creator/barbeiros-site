
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

// Task 10: Updated hook to use direct Supabase client queries without relation expansions instead of Edge function
export function useForumAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfiles = async (ids) => {
    const uniqueIds = [...new Set(ids.filter(Boolean))];
    if (uniqueIds.length === 0) return {};
    const { data } = await supabase.from('profiles').select('id, full_name, email, avatar_url').in('id', uniqueIds);
    return (data || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
  };

  const getTopics = useCallback(async ({ search = '', category = '', status = '' } = {}) => {
    setLoading(true);
    try {
      let query = supabase.from('forum_topics').select('*').order('created_at', { ascending: false });
      if (search) query = query.ilike('title', `%${search}%`);
      if (category) query = query.eq('category', category);
      if (status) query = query.eq('status', status);

      const { data: topics, error: topicsErr } = await query;
      if (topicsErr) throw topicsErr;
      if (!topics || topics.length === 0) return [];

      const authorIds = topics.map(t => t.author_id);
      const profilesMap = await fetchProfiles(authorIds);

      const topicIds = topics.map(t => t.id);
      const { data: replies } = await supabase.from('forum_replies').select('topic_id').in('topic_id', topicIds);
      
      const replyCounts = (replies || []).reduce((acc, r) => {
        acc[r.topic_id] = (acc[r.topic_id] || 0) + 1;
        return acc;
      }, {});

      return topics.map(topic => ({
        ...topic,
        profiles: profilesMap[topic.author_id] || null,
        replies_count: replyCounts[topic.id] || 0,
        replies: [{ count: replyCounts[topic.id] || 0 }]
      }));
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getTopicDetail = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data: topic, error: topicErr } = await supabase.from('forum_topics').select('*').eq('id', id).single();
      if (topicErr) throw topicErr;

      const { data: replies, error: repliesErr } = await supabase.from('forum_replies').select('*').eq('topic_id', id).order('created_at', { ascending: true });
      if (repliesErr) throw repliesErr;

      const authorIds = [topic.author_id, ...(replies || []).map(r => r.author_id)];
      const profilesMap = await fetchProfiles(authorIds);

      return {
        topic: { ...topic, profiles: profilesMap[topic.author_id] || null },
        replies: (replies || []).map(r => ({ ...r, profiles: profilesMap[r.author_id] || null }))
      };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTopic = async (payload) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('forum_topics').insert([payload]).select('*').single();
      if (error) throw error;
      return data;
    } catch (err) { throw err; } finally { setLoading(false); }
  };

  const createReply = async (topic_id, content) => {
    const { data: { user } } = await supabase.auth.getUser();
    setLoading(true);
    try {
      const { data, error } = await supabase.from('forum_replies').insert([{ topic_id, content, author_id: user?.id, status: 'approved' }]).select('*').single();
      if (error) throw error;
      return data;
    } catch (err) { throw err; } finally { setLoading(false); }
  };

  const deleteTopic = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('forum_topics').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) { throw err; } finally { setLoading(false); }
  };

  const deleteReply = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('forum_replies').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) { throw err; } finally { setLoading(false); }
  };

  const moderateContent = async (targetId, targetType, modAction, reason) => {
    const { data: { user } } = await supabase.auth.getUser();
    setLoading(true);
    try {
      const table = targetType === 'topic' ? 'forum_topics' : 'forum_replies';
      await supabase.from(table).update({ status: modAction }).eq('id', targetId);
      await supabase.from('forum_moderation').insert([{
        topic_id: targetType === 'topic' ? targetId : null,
        reply_id: targetType === 'reply' ? targetId : null,
        moderator_id: user?.id,
        action: modAction,
        reason
      }]);
      return true;
    } catch (err) { throw err; } finally { setLoading(false); }
  };

  return {
    loading,
    error,
    createTopic,
    getTopics,
    getTopicDetail,
    createReply,
    deleteTopic,
    deleteReply,
    moderateContent
  };
}
