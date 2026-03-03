import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Heart, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ForumReplySection from './ForumReplySection';

export default function PostCard({ post }) {
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showReplies, setShowReplies] = useState(false);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', post.user_id).single();
      if (data) setAuthor(data);
    };
    fetchAuthor();
  }, [post.user_id]);

  const handleLike = async (e) => {
    e.stopPropagation();
    const newCount = likesCount + 1;
    setLikesCount(newCount);
    await supabase.from('forum_posts').update({ likes_count: newCount }).eq('id', post.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0 overflow-hidden">
          {author?.avatar_url ? (
            <img src={author.avatar_url} alt={author.display_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
              {(author?.display_name || 'U').charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h4 className="text-white font-semibold truncate">{post.title}</h4>
            <span className="text-xs text-gray-500 shrink-0">{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          
          <p className="text-sm text-gray-400 mb-4 whitespace-pre-wrap">{post.content}</p>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart size={14} />
              <span>{likesCount}</span>
            </button>
            
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#FFD700] transition-colors"
            >
              <MessageSquare size={14} />
              <span>Responder</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ForumReplySection postId={post.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}