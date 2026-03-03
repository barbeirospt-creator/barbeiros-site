import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ZoomOut as formatDistanceToNow } from 'lucide-react';
import { useForumRealtime } from '@/hooks/useForumRealtime';

export default function ForumReplySection({ postId }) {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchReplies();
  }, [postId]);

  useForumRealtime(null, postId, (newRep) => {
    setReplies(prev => [...prev, newRep]);
  });

  const fetchReplies = async () => {
    const { data } = await supabase
      .from('forum_replies')
      .select('*, profiles(display_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (data) setReplies(data);
  };

  const handleReplySubmit = async () => {
    if (!newReply.trim()) return;
    setLoading(true);
    await supabase.from('forum_replies').insert([{
      post_id: postId,
      user_id: user.id,
      content: newReply
    }]);
    setNewReply('');
    setLoading(false);
    fetchReplies();
  };

  return (
    <div className="mt-4 pl-8 border-l-2 border-gray-800 space-y-4">
      {replies.map(reply => (
        <div key={reply.id} className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden">
              {reply.profiles?.avatar_url && <img src={reply.profiles.avatar_url} alt="avatar" className="w-full h-full object-cover" />}
            </div>
            <span className="text-sm font-medium text-gray-300">{reply.profiles?.display_name || 'Anónimo'}</span>
            <span className="text-xs text-gray-500">
              {new Date(reply.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-400">{reply.content}</p>
        </div>
      ))}
      
      <div className="flex gap-2 mt-4">
        <Textarea 
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="Escreva uma resposta..."
          className="bg-gray-900 border-gray-700 text-white min-h-[60px]"
          disabled={loading}
        />
        <Button onClick={handleReplySubmit} disabled={loading || !newReply.trim()} className="bg-gray-800 text-white hover:bg-gray-700 shrink-0">
          Responder
        </Button>
      </div>
    </div>
  );
}