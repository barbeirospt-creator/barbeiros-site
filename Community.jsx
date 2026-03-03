import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import PostComposer from "@/components/PostComposer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/customSupabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (postsError) {
        console.error("Error fetching posts:", postsError);
        throw postsError;
      }

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      const postIds = postsData.map(p => p.id);
      const postUserIds = [...new Set(postsData.map(p => p.user_id))].filter(Boolean);

      // 2. Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("post_comments")
        .select("*")
        .in("post_id", postIds);
      if (commentsError) console.error("Error fetching comments:", commentsError);

      const commentUserIds = commentsData ? [...new Set(commentsData.map(c => c.user_id))].filter(Boolean) : [];
      
      // 3. Fetch profiles for both posts and comments
      const allUserIds = [...new Set([...postUserIds, ...commentUserIds])];
      let profilesMap = {};
      if (allUserIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", allUserIds);
          
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        } else if (profilesData) {
          profilesMap = profilesData.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {});
        }
      }

      // 4. Fetch likes
      const { data: likesData, error: likesError } = await supabase
        .from("post_likes")
        .select("*")
        .in("post_id", postIds);
      if (likesError) console.error("Error fetching likes:", likesError);

      // 5. Assemble data
      const assembledPosts = postsData.map(post => {
        const postComments = (commentsData || [])
          .filter(c => c.post_id === post.id)
          .map(c => ({
            ...c,
            profiles: profilesMap[c.user_id] || { display_name: "Utilizador Desconhecido" }
          }))
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          
        const postLikes = (likesData || []).filter(l => l.post_id === post.id);
        const userHasLiked = user ? postLikes.some(l => l.user_id === user.id) : false;

        return {
          ...post,
          profiles: profilesMap[post.user_id] || { display_name: "Utilizador Desconhecido" },
          post_comments: postComments,
          likes_count: postLikes.length,
          userHasLiked
        };
      });

      setPosts(assembledPosts);
    } catch (err) {
      console.error("fetchPosts exception:", err);
      toast({ title: "Erro", description: "Não foi possível carregar as publicações.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (postId) => {
    const content = commentText[postId];
    if (!content || !content.trim()) return;
    
    try {
      const { error } = await supabase
        .from("post_comments")
        .insert([{ post_id: postId, user_id: user.id, content: content.trim() }]);
        
      if (error) throw error;
      
      setCommentText(prev => ({ ...prev, [postId]: "" }));
      fetchPosts(); // Refetch to get the new comment with profile
      toast({ title: "Sucesso", description: "Comentário adicionado com sucesso." });
    } catch (err) {
      console.error("Error adding comment:", err);
      toast({ title: "Erro", description: "Falha ao enviar comentário.", variant: "destructive" });
    }
  };

  const handleToggleLike = async (postId, hasLiked) => {
    try {
      if (hasLiked) {
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .match({ post_id: postId, user_id: user.id });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("post_likes")
          .insert([{ post_id: postId, user_id: user.id }]);
        if (error) throw error;
      }
      
      // Optimistically update UI or just refetch
      fetchPosts();
    } catch (err) {
      console.error("Error toggling like:", err);
      toast({ title: "Erro", description: "Não foi possível processar a ação.", variant: "destructive" });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-2">Comunidade <span className="text-[#FFD700]">Barbeiros</span></h1>
        
        <PostComposer onPostCreated={fetchPosts} />
        
        {loading ? (
          <div className="space-y-4">
             {[1,2,3].map(i => (
               <Card key={i} className="bg-black border-gray-800 animate-pulse">
                 <CardContent className="h-48 pt-6"></CardContent>
               </Card>
             ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="bg-black border-gray-800 text-center py-12">
            <p className="text-gray-400">Ainda não existem publicações. Seja o primeiro a partilhar!</p>
          </Card>
        ) : (
          posts.map(post => (
            <Card key={post.id} className="bg-black border-gray-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                      {post.profiles?.avatar_url ? (
                        <img src={post.profiles.avatar_url} alt={post.profiles.display_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 font-bold">
                          {post.profiles?.display_name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-bold">{post.profiles?.display_name || "Utilizador Desconhecido"}</p>
                      <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 whitespace-pre-wrap">{post.content}</p>
                
                <div className="flex items-center gap-6 mb-4">
                  <button 
                    onClick={() => handleToggleLike(post.id, post.userHasLiked)}
                    className={`flex items-center gap-2 text-sm transition-colors ${post.userHasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                  >
                    <Heart size={18} className={post.userHasLiked ? 'fill-current' : ''} />
                    <span>{post.likes_count || 0}</span>
                  </button>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MessageSquare size={18} />
                    <span>{post.post_comments?.length || 0}</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-800 pt-4 space-y-3">
                  {post.post_comments?.map(c => (
                    <div key={c.id} className="bg-gray-900/50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-bold text-gray-300">{c.profiles?.display_name || "Utilizador"}</p>
                        <span className="text-[10px] text-gray-600">{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-400">{c.content}</p>
                    </div>
                  ))}
                  
                  <div className="flex gap-2 mt-4 pt-2">
                    <input 
                      type="text" 
                      placeholder="Adicionar comentário..." 
                      className="flex-1 bg-gray-900 border border-gray-700 text-white p-2 rounded text-sm placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                      value={commentText[post.id] || ""}
                      onChange={e => setCommentText({...commentText, [post.id]: e.target.value})}
                      onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                    />
                    <Button size="sm" onClick={() => handleComment(post.id)} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
                      Comentar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AppLayout>
  );
}