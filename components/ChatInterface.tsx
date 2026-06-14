import React, { useState, useRef, useEffect } from 'react';

import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export default function ChatInterface({ messages, isLoading, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    // Initial focus
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading && mounted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, mounted]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="w-1/3 flex flex-col bg-zinc-900 border-r border-zinc-800 shadow-2xl z-20">
      <div className="p-6 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-black text-zinc-100 leading-tight">EcoAssistant</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Online & Thinking</p>
          </div>
        </div>
        {isLoading && <Loader2 className="animate-spin text-blue-500" size={20} />}
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-zinc-800' : 'bg-blue-600/20 text-blue-500'}`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-zinc-100 text-zinc-900 font-medium rounded-tr-none' 
                    : 'bg-zinc-800 text-zinc-200 border border-zinc-700/50 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-zinc-800/50 border border-zinc-700/30 p-4 rounded-2xl rounded-tl-none flex gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-6 bg-zinc-900 border-t border-zinc-800">
        <div className="relative flex items-center">
          <input 
            ref={inputRef}
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="How can I help you today?"
            disabled={isLoading}
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-zinc-500 disabled:opacity-50 transition"
          />
          <button 
            onClick={handleSend}
            disabled={mounted ? (isLoading || !input.trim()) : true}
            className="absolute right-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:bg-zinc-700 shadow-lg shadow-blue-900/20"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-zinc-600 mt-4 font-bold uppercase tracking-tighter">
          Powered by Gemini 3.5 Flash
        </p>
      </div>
    </div>
  );
}
