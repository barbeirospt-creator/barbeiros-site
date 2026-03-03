
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function useDirectSupabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchTopics = useCallback(async ({ search = '', category = '', status = '' } = {}) => {
    setLoading(true);
    try {
      // Fetch topics without relationship expansion
      let query = supabase.from('forum_topics').select('*').order('created_at', { ascending: false });

      if (search) query = query.ilike('title', `%${search}%`);
      if (category) query = query.eq('category', category);
      if (status) query = query.eq('status', status);

      const { data: topics, error: err } = await query;
      if (err) throw err;
      if (!topics || topics.length === 0) return [];

      // Fetch profiles separately
      const authorIds = [...new Set(topics.map(t => t.author_id).filter(Boolean))];
      let profilesMap = {};
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url, email').in('id', authorIds);
        if (profiles) {
          profilesMap = profiles.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
        }
      }

      // Fetch replies counts separately
      const topicIds = topics.map(t => t.id);
      let replyCounts = {};
      if (topicIds.length > 0) {
        const { data: replies } = await supabase.from('forum_replies').select('topic_id').in('topic_id', topicIds);
        if (replies) {
          replyCounts = replies.reduce((acc, r) => {
            acc[r.topic_id] = (acc[r.topic_id] || 0) + 1;
            return acc;
          }, {});
        }
      }

      // Merge data
      return topics.map(topic => ({
        ...topic,
        profiles: profilesMap[topic.author_id] || null,
        replies: [{ count: replyCounts[topic.id] || 0 }] // Keep consistent structure
      }));

    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTopicDetail = useCallback(async (id) => {
    setLoading(true);
    try {
      // Fetch topic without expansion
      const { data: topic, error: topicErr } = await supabase
        .from('forum_topics')
        .select('*')
        .eq('id', id)
        .single();
      
      if (topicErr) throw topicErr;

      // Fetch replies without expansion
      const { data: replies, error: repliesErr } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('topic_id', id)
        .order('created_at', { ascending: true });

      if (repliesErr) throw repliesErr;

      // Fetch all needed profiles
      const authorIds = new Set([topic?.author_id, ...(replies || []).map(r => r.author_id)].filter(Boolean));
      let profilesMap = {};
      if (authorIds.size > 0) {
         const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url, email').in('id', Array.from(authorIds));
         if (profiles) {
           profilesMap = profiles.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
         }
      }

      // Update views safely
      if (topic) {
        supabase.from('forum_topics')
          .update({ views_count: (topic.views_count || 0) + 1 })
          .eq('id', id)
          .then();
      }

      // Merge data
      const enrichedTopic = { ...topic, profiles: profilesMap[topic.author_id] || null };
      const enrichedReplies = (replies || []).map(r => ({ ...r, profiles: profilesMap[r.author_id] || null }));

      return { topic: enrichedTopic, replies: enrichedReplies };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTopic = async (payload) => {
    if (!user) throw new Error("Not authenticated");
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('forum_topics').insert([{
        ...payload,
        author_id: user.id,
        status: 'approved'
      }]).select('*').single(); // Removed expansion
      if (err) throw err;
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createReply = async (topicId, content) => {
    if (!user) throw new Error("Not authenticated");
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('forum_replies').insert([{
        topic_id: topicId,
        author_id: user.id,
        content,
        status: 'approved'
      }]).select('*').single(); // Removed expansion
      if (err) throw err;
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTopic = async (id) => {
    setLoading(true);
    try {
      const { error: err } = await supabase.from('forum_topics').delete().eq('id', id);
      if (err) throw err;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReply = async (id) => {
    setLoading(true);
    try {
      const { error: err } = await supabase.from('forum_replies').delete().eq('id', id);
      if (err) throw err;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const moderateContent = async (targetId, targetType, action, reason) => {
    if (!user) throw new Error("Not authenticated");
    setLoading(true);
    try {
      const table = targetType === 'topic' ? 'forum_topics' : 'forum_replies';
      const { error: err1 } = await supabase.from(table).update({ status: action }).eq('id', targetId);
      if (err1) throw err1;

      const { error: err2 } = await supabase.from('forum_moderation').insert([{
        topic_id: targetType === 'topic' ? targetId : null,
        reply_id: targetType === 'reply' ? targetId : null,
        moderator_id: user.id,
        action,
        reason
      }]);
      if (err2) throw err2;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remaining group purchase methods left unchanged to avoid breaking existing functionality
  const fetchGroupPurchases = useCallback(async ({ search = '', status = '' } = {}) => {
    setLoading(true);
    try {
      let query = supabase.from('group_buys').select(`*, participants:group_buy_participants(count)`).order('created_at', { ascending: false });
      if (search) query = query.ilike('product_name', `%${search}%`);
      if (status) query = query.eq('status', status);
      const { data, error: err } = await query;
      if (err) throw err;
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGroupPurchaseDetail = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data: purchase, error: pErr } = await supabase.from('group_buys').select('*').eq('id', id).single();
      if (pErr) throw pErr;
      const { data: participants, error: partErr } = await supabase.from('group_buy_participants').select('*, profiles:user_id(full_name, email)').eq('group_buy_id', id);
      if (partErr) throw partErr;
      return { purchase, participants };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinGroupPurchase = async (id, quantity) => {
    if (!user) throw new Error("Not authenticated");
    setLoading(true);
    try {
      const { error: err } = await supabase.from('group_buy_participants').insert([{ group_buy_id: id, user_id: user.id, quantity_ordered: quantity }]);
      if (err) throw err;
      const { data: p } = await supabase.from('group_buys').select('current_participants').eq('id', id).single();
      await supabase.from('group_buys').update({ current_participants: (p?.current_participants || 0) + quantity }).eq('id', id);
    } catch (err) { throw err; } finally { setLoading(false); }
  };

  const createGroupPurchase = async (payload) => {
    if (!user) throw new Error("Not authenticated");
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('group_buys').insert([{ ...payload, created_by: user.id, status: 'active' }]).select().single();
      if (err) throw err;
      return data;
    } catch (err) { throw err; } finally { setLoading(false); }
  };

  const deleteGroupPurchase = async (id) => {
    setLoading(true);
    try {
      const { error: err } = await supabase.from('group_buys').delete().eq('id', id);
      if (err) throw err;
    } catch (err) { throw err; } finally { setLoading(false); }
  };

  return {
    loading,
    error,
    fetchTopics,
    fetchTopicDetail,
    createTopic,
    createReply,
    deleteTopic,
    deleteReply,
    moderateContent,
    fetchGroupPurchases,
    fetchGroupPurchaseDetail,
    joinGroupPurchase,
    createGroupPurchase,
    deleteGroupPurchase
  };
}
