import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ForumTopicCard({ topic }) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate(`/forum/${topic.id}`)}
      className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-[#FFD700]/50 transition-all shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{topic.name}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{topic.description}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] shrink-0">
          <MessageCircle size={20} />
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-gray-500 mt-4 pt-4 border-t border-gray-800">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>Criado {new Date(topic.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
}