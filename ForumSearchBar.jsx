import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ForumSearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({ topics: [], posts: [] });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setResults({ topics: [], posts: [] });
        return;
      }
      
      const [topicsRes, postsRes] = await Promise.all([
        supabase.from('forum_topics').select('*').ilike('name', `%${searchTerm}%`).limit(3),
        supabase.from('forum_posts').select('*').ilike('title', `%${searchTerm}%`).limit(5)
      ]);
      
      setResults({
        topics: topicsRes.data || [],
        posts: postsRes.data || []
      });
      setIsOpen(true);
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Pesquisar no fórum..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10 bg-gray-900 border-gray-700 text-white"
        />
      </div>

      {isOpen && (results.topics.length > 0 || results.posts.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
          {results.topics.length > 0 && (
            <div className="p-2 border-b border-gray-800">
              <h4 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">Tópicos</h4>
              {results.topics.map(topic => (
                <div 
                  key={topic.id}
                  onClick={() => navigate(`/forum/${topic.id}`)}
                  className="px-2 py-1.5 hover:bg-gray-800 cursor-pointer rounded text-sm text-white"
                >
                  {topic.name}
                </div>
              ))}
            </div>
          )}
          {results.posts.length > 0 && (
            <div className="p-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">Posts</h4>
              {results.posts.map(post => (
                <div 
                  key={post.id}
                  onClick={() => navigate(`/forum/${post.topic_id}`)}
                  className="px-2 py-1.5 hover:bg-gray-800 cursor-pointer rounded text-sm text-gray-300"
                >
                  {post.title}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}