
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useForumDataFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to fetch authors without using relationships
  const fetchAuthorDetails = async (authorIds) => {
    if (!authorIds || authorIds.length === 0) return {};
    
    // Filter out null/undefined and get unique IDs
    const uniqueIds = [...new Set(authorIds.filter(Boolean))];
    if (uniqueIds.length === 0) return {};

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .in('id', uniqueIds);

      if (error) throw error;

      const profileMap = {};
      if (data) {
        data.forEach(p => {
          profileMap[p.id] = p;
        });
      }
      return profileMap;
    } catch (err) {
      console.error('Error fetching author details:', err);
      return {};
    }
  };

  const fetchTopicsWithAuthors = useCallback(async ({ search = '', category = '', status = '' } = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch raw topics (Task 9: .select('*'))
      let query = supabase.from('forum_topics').select('*').order('created_at', { ascending: false });
      
      if (search) query = query.ilike('title', `%${search}%`);
      if (category) query = query.eq('category', category);
      if (status) query = query.eq('status', status);

      const { data: topics, error: topicsErr } = await query;
      if (topicsErr) throw topicsErr;

      if (!topics || topics.length === 0) return [];

      // Fetch authors for all topics separately
      const authorIds = topics.map(t => t.author_id);
      const profilesMap = await fetchAuthorDetails(authorIds);

      // Fetch reply counts without JOINs
      const topicIds = topics.map(t => t.id);
      const { data: replies } = await supabase
        .from('forum_replies')
        .select('topic_id')
        .in('topic_id', topicIds);
      
      const replyCounts = {};
      if (replies) {
        replies.forEach(r => {
          replyCounts[r.topic_id] = (replyCounts[r.topic_id] || 0) + 1;
        });
      }

      // Combine data
      return topics.map(topic => ({
        ...topic,
        profiles: profilesMap[topic.author_id] || null,
        replies_count: replyCounts[topic.id] || 0
      }));
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRepliesWithAuthors = useCallback(async (topicId) => {
    try {
      // Fetch replies without expansion
      const { data: replies, error: repliesErr } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });
        
      if (repliesErr) throw repliesErr;
      if (!replies || replies.length === 0) return [];

      const authorIds = replies.map(r => r.author_id);
      const profilesMap = await fetchAuthorDetails(authorIds);

      return replies.map(reply => ({
        ...reply,
        profiles: profilesMap[reply.author_id] || null
      }));
    } catch (err) {
      console.error('Error fetching replies:', err);
      return [];
    }
  }, []);

  const fetchTopicWithAuthorsAndReplies = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch single topic without expansion
      const { data: topic, error: topicErr } = await supabase
        .from('forum_topics')
        .select('*')
        .eq('id', id)
        .single();
        
      if (topicErr) throw topicErr;

      // Update views_count securely
      if (topic) {
        await supabase.from('forum_topics')
          .update({ views_count: (topic.views_count || 0) + 1 })
          .eq('id', id);
        topic.views_count = (topic.views_count || 0) + 1;
      }

      // Fetch replies and authors separately
      const enrichedReplies = await fetchRepliesWithAuthors(id);
      
      // Fetch author for topic separately
      const profilesMap = await fetchAuthorDetails([topic.author_id]);
      const enrichedTopic = {
        ...topic,
        profiles: profilesMap[topic.author_id] || null
      };

      return { topic: enrichedTopic, replies: enrichedReplies };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchRepliesWithAuthors]);

  return {
    loading,
    error,
    fetchTopicsWithAuthors,
    fetchTopicWithAuthorsAndReplies,
    fetchRepliesWithAuthors,
    fetchAuthorDetails
  };
}
