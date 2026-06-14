import React, { useState, useRef, useEffect } from 'react';

import { Send, Bot, User, Loader2, Laptop, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  activeTab: 'chat' | 'display';
  onToggleView: () => void;
  isMobile: boolean;
  renderInputOnly?: boolean;
}

export default function ChatInterface({ 
  messages, 
  isLoading, 
  onSendMessage, 
  activeTab, 
  onToggleView,
  isMobile,
  renderInputOnly = false
}: ChatInterfaceProps) {
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

  if (renderInputOnly) {
    return (
      <div className="p-4 sm:p-6 bg-zinc-900 border-t border-zinc-800">
        <div className="relative flex items-center gap-2 max-w-5xl mx-auto w-full">
          <div className="relative flex-1 flex items-center">
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="How can I help you today?"
              disabled={isLoading}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-zinc-500 disabled:opacity-50 transition text-sm sm:text-base"
            />
            <button 
              onClick={handleSend}
              disabled={mounted ? (isLoading || !input.trim()) : true}
              className="absolute right-1.5 sm:right-2 p-2.5 sm:p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:bg-zinc-700 shadow-lg shadow-blue-900/20"
            >
              <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
          {isMobile && (
            <button 
              onClick={onToggleView}
              className={`p-3 rounded-2xl transition flex items-center justify-center border border-zinc-700/50 ${
                activeTab === 'display' 
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 shadow-lg shadow-blue-900/20' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
              title={activeTab === 'display' ? "Switch to Chat" : "Switch to Store"}
            >
              {activeTab === 'display' ? <MessageSquare size={20} /> : <Laptop size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-zinc-900 border-r border-zinc-800 shadow-2xl z-20 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-black text-zinc-100 leading-tight text-sm sm:text-base">EcoAssistant</h2>
            <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Online & Thinking</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="animate-spin text-blue-500" size={18} />}
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 scrollbar-hide scroll-smooth"
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

      {(!isMobile || renderInputOnly) && (
        <div className="p-4 sm:p-6 bg-zinc-900 border-t border-zinc-800">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <input 
                ref={inputRef}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="How can I help you today?"
                disabled={isLoading}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-zinc-500 disabled:opacity-50 transition text-sm sm:text-base"
              />
              <button 
                onClick={handleSend}
                disabled={mounted ? (isLoading || !input.trim()) : true}
                className="absolute right-1.5 sm:right-2 p-2.5 sm:p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:bg-zinc-700 shadow-lg shadow-blue-900/20"
              >
                <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
            {isMobile && (
              <button 
                onClick={onToggleView}
                className={`p-3 rounded-2xl transition flex items-center justify-center border border-zinc-700/50 ${
                  activeTab === 'display' 
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 shadow-lg shadow-blue-900/20' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
                title={activeTab === 'display' ? "Switch to Chat" : "Switch to Store"}
              >
                {activeTab === 'display' ? <MessageSquare size={20} /> : <Laptop size={20} />}
              </button>
            )}
          </div>
          <p className="text-[9px] sm:text-[10px] text-center text-zinc-600 mt-3 sm:mt-4 font-bold uppercase tracking-tighter">
            Powered by Gemini 3.1 Flash-Lite
          </p>
        </div>
      )}
    </div>
  );
}
