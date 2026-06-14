'use client';

import React, { useState, useEffect } from 'react';
import { products, Product, Reservation } from '@/lib/products';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import ProductConfigurator from './ProductConfigurator';
import ProductComparison from './ProductComparison';
import ReservationForm from './ReservationForm';
import ChatInterface, { Message } from './ChatInterface';
import { ShoppingCart, Home, Laptop, ArrowLeft, Trash2, CheckCircle, BrainCircuit, CalendarCheck, Scale, Bot, User, ChevronLeft, ChevronRight, MessageSquare, ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ViewState = 
  | { type: 'welcome' }
  | { type: 'list', products: Product[] }
  | { type: 'detail', product: Product }
  | { type: 'config', product: Product }
  | { type: 'comparison', products: Product[] }
  | { type: 'reservation', reservation: Reservation };

export default function MainApp() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'welcome' });
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I can help you find information about our eco-friendly products. Ask me to show products, details about a specific one, or compare items.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConfig, setActiveConfig] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'chat' | 'display'>('chat');
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [lastAiMessage, setLastAiMessage] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [isAiMessageCollapsed, setIsAiMessageCollapsed] = useState(false);

  useEffect(() => {
    if (activeTab === 'chat') {
      setLastAiMessage(null);
      setIsAiMessageCollapsed(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (lastAiMessage) {
      setIsAiMessageCollapsed(false);
    }
  }, [lastAiMessage]);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = async (content: string) => {
    const newMessages = [...messages, { role: 'user' as const, content }];
    setMessages(newMessages);
    setLastUserMessage(content);
    setLastAiMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          reservation: currentReservation,
          currentView: {
            type: viewState.type,
            activeConfig: viewState.type === 'config' ? activeConfig : undefined
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'ai', content: data.content }]);
      setLastUserMessage(null);
      
      if (data.uiAction) {
        setLastAiMessage(data.content);
        if (data.uiAction.type === 'reserve') {
          handleReserve(data.uiAction.product, data.uiAction.config || {});
        } else if (data.uiAction.type === 'update_config') {
          setActiveConfig(prev => ({ ...prev, ...data.uiAction.config }));
        } else {
          if (data.uiAction.type !== 'list' && data.uiAction.type !== 'comparison') {
            setIsComparisonMode(false);
            setSelectedForComparison([]);
          }
          setViewState(data.uiAction);
          setActiveTab('display');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error connecting to the AI agent.' }]);
      setLastUserMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const showAllProducts = () => {
    dismissAiMessage();
    setIsComparisonMode(false);
    setSelectedForComparison([]);
    setViewState({ type: 'list', products: products });
  };

  const toggleComparisonMode = () => {
    dismissAiMessage();
    if (isComparisonMode) {
      if (selectedForComparison.length >= 2) {
        const productsToCompare = products.filter(p => selectedForComparison.includes(p.id));
        setViewState({ type: 'comparison', products: productsToCompare });
        setIsComparisonMode(false);
      } else if (selectedForComparison.length === 0) {
        setIsComparisonMode(false);
      }
    } else {
      setIsComparisonMode(true);
      setViewState({ type: 'list', products: products });
    }
  };

  const handleToggleProductSelection = (productId: string) => {
    dismissAiMessage();
    setSelectedForComparison(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const showProductDetail = (product: Product) => {
    dismissAiMessage();
    setIsComparisonMode(false);
    setSelectedForComparison([]);
    setViewState({ type: 'detail', product });
  };

  const showProductConfig = (product: Product) => {
    dismissAiMessage();
    setIsComparisonMode(false);
    setSelectedForComparison([]);
    
    const initialConfig: Record<string, string> = {};
    product.options?.forEach(opt => {
      initialConfig[opt.name] = opt.values[0];
    });
    setActiveConfig(initialConfig);
    
    setViewState({ type: 'config', product });
  };

  const showWelcome = () => {
    dismissAiMessage();
    setIsComparisonMode(false);
    setSelectedForComparison([]);
    setViewState({ type: 'welcome' });
  };

  const handleReserve = (product: Product, config: Record<string, string>) => {
    dismissAiMessage();
    setIsComparisonMode(false);
    setSelectedForComparison([]);
    const reservation: Reservation = {
      product,
      config,
      date: new Date().toISOString()
    };
    setCurrentReservation(reservation);
    setViewState({ type: 'reservation', reservation });
    setShowToast(`Reservation started for ${product.name}`);
    setTimeout(() => setShowToast(null), 3000);
  };

  const clearReservation = () => {
    dismissAiMessage();
    setCurrentReservation(null);
    setIsComparisonMode(false);
    setSelectedForComparison([]);
    showWelcome();
  };

  const isMobile = mounted && windowWidth < 768;

  const dismissAiMessage = () => {
    setLastAiMessage(null);
    setLastUserMessage(null);
    setIsAiMessageCollapsed(false);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
        <AnimatePresence initial={false}>
          {(!isMobile || activeTab === 'chat') && (isChatExpanded || isMobile) && (
            <motion.div 
              initial={false}
              animate={{ 
                width: !mounted ? '400px' : (isMobile ? '100%' : (isChatExpanded ? '400px' : '0%')),
                flexGrow: !mounted ? 0 : (isMobile ? (activeTab === 'chat' ? 1 : 0) : (isChatExpanded ? 0 : 0)),
                flexShrink: isMobile && activeTab === 'chat' ? 1 : 0,
                flexBasis: !mounted ? '400px' : (isMobile ? (activeTab === 'chat' ? '0px' : '0px') : (isChatExpanded ? '400px' : '0px')),
                opacity: !mounted ? 1 : (isMobile ? (activeTab === 'chat' ? 1 : 0) : (isChatExpanded ? 1 : 0)),
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, opacity: { duration: 0.2 } }}
              className={`${(activeTab === 'chat' || !isMobile) ? 'flex' : 'hidden'} md:flex md:h-full border-r border-zinc-900 overflow-hidden shrink-0 relative z-30`}
            >
              <div className="w-full h-full md:min-w-[320px]">
                <ChatInterface 
                  messages={messages} 
                  isLoading={isLoading} 
                  onSendMessage={handleSendMessage}
                  activeTab={activeTab}
                  onToggleView={() => setActiveTab(activeTab === 'chat' ? 'display' : 'chat')}
                  isMobile={isMobile}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`${activeTab === 'display' || !isMobile ? 'flex' : 'hidden'} md:flex flex-1 flex-col overflow-hidden md:h-full relative`}>
          <motion.div
            animate={{
              flexGrow: !mounted ? 1 : (isMobile ? (activeTab === 'display' ? 1 : 0) : 1),
              opacity: !mounted ? 1 : (isMobile ? (activeTab === 'display' ? 1 : 0) : 1),
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30, 
              opacity: { duration: activeTab === 'display' ? 0 : 0.2 },
              flexGrow: { duration: activeTab === 'display' ? 0 : undefined }
            }}
            className="flex-1 flex flex-col h-full"
          >
            <button 
              onClick={() => setIsChatExpanded(!isChatExpanded)}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 w-6 h-12 bg-zinc-900 border border-l-0 border-zinc-800 rounded-r-xl items-center justify-center text-zinc-500 hover:text-white transition-colors shadow-xl"
              title={isChatExpanded ? "Collapse Chat" : "Expand Chat"}
            >
              {isChatExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md z-10 overflow-x-auto">
              <div className="flex gap-2 sm:gap-4 shrink-0">
                <button 
                  onClick={showWelcome}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-2 text-sm sm:text-base ${viewState.type === 'welcome' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Home size={18} />
                  <span className="hidden xs:inline">Home</span>
                </button>
                <button 
                  onClick={showAllProducts}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-2 text-sm sm:text-base ${viewState.type === 'list' && !isComparisonMode ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Laptop size={18} />
                  <span className="hidden xs:inline">Products</span>
                </button>
                <button 
                  onClick={toggleComparisonMode}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-2 text-sm sm:text-base ${(viewState.type === 'comparison' || isComparisonMode) ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Scale size={18} />
                  <span className="hidden xs:inline">{isComparisonMode ? `Finish (${selectedForComparison.length})` : 'Compare'}</span>
                </button>
                {currentReservation && (
                  <button 
                    onClick={() => {
                      dismissAiMessage();
                      setIsComparisonMode(false);
                      setSelectedForComparison([]);
                      setViewState({ type: 'reservation', reservation: currentReservation });
                    }}
                    className={`px-2 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-2 text-sm sm:text-base ${viewState.type === 'reservation' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <CalendarCheck size={18} />
                    <span className="hidden xs:inline">Reservation</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono uppercase tracking-widest ml-4 shrink-0">
                <BrainCircuit size={14} className="text-blue-500" />
                <span className="hidden sm:inline">Gemini Powered Agent</span>
              </div>
            </div>

            <div className="flex-1 overflow-hidden relative flex flex-col-reverse">
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewState.type + (viewState.type === 'detail' ? viewState.product.id : '')}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0 }}
                    className="h-full"
                  >
                    {viewState.type === 'welcome' && (
                      <div className="flex flex-col items-center justify-center min-h-full py-12 text-center">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-2xl shadow-blue-500/10"
                        >
                          <Laptop size={40} className="text-blue-500" />
                        </motion.div>
                        <motion.h1 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-4xl sm:text-6xl font-black text-zinc-100 mb-6 tracking-tighter"
                        >
                          Eco<span className="text-blue-500">Shop</span>
                        </motion.h1>
                        <motion.p 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-lg sm:text-xl text-zinc-400 max-w-lg mb-10 leading-relaxed px-4"
                        >
                          The next generation of sustainable electronics. 
                          Talk to our AI assistant to find the perfect gear.
                        </motion.p>
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-8 sm:px-0"
                        >
                          <button 
                            onClick={showAllProducts}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition transform hover:scale-105 shadow-xl shadow-blue-900/40 w-full sm:w-auto"
                          >
                            Browse Catalog
                          </button>
                          <button 
                            onClick={() => setActiveTab('chat')}
                            className={`${!isMobile ? 'hidden' : 'bg-zinc-800'} hover:bg-zinc-700 text-white px-10 py-4 rounded-2xl font-bold transition transform hover:scale-105 w-full sm:w-auto`}
                          >
                            Chat with Assistant
                          </button>
                        </motion.div>
                      </div>
                    )}

                    {viewState.type === 'list' && (
                      <ProductList 
                        products={viewState.products} 
                        onProductClick={isComparisonMode ? (p) => handleToggleProductSelection(p.id) : showProductDetail} 
                        selectedIds={isComparisonMode ? selectedForComparison : []}
                      />
                    )}

                    {viewState.type === 'detail' && (
                      <ProductDetail 
                        product={viewState.product} 
                        onBack={showAllProducts} 
                        onConfigure={showProductConfig}
                      />
                    )}

                    {viewState.type === 'config' && (
                      <ProductConfigurator 
                        product={viewState.product} 
                        config={activeConfig}
                        onConfigChange={(newConfig) => setActiveConfig(newConfig)}
                        onBack={() => showProductDetail(viewState.product)} 
                        onReserve={handleReserve}
                      />
                    )}

                    {viewState.type === 'comparison' && (
                      <ProductComparison 
                        products={viewState.products} 
                        onBack={showAllProducts}
                      />
                    )}

                    {viewState.type === 'reservation' && (
                      <ReservationForm 
                        reservation={viewState.reservation}
                        onBack={() => showProductDetail(viewState.reservation.product)}
                        onComplete={clearReservation}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {isComparisonMode && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="bg-blue-600 p-4 sm:p-6 shadow-2xl border-t border-blue-400/30 backdrop-blur-xl z-20 flex flex-col sm:flex-row justify-between items-center gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <Scale className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white">Comparison Mode</h3>
                        <p className="text-blue-100 text-xs sm:text-sm">Select 2+ products.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => {
                          setIsComparisonMode(false);
                          setSelectedForComparison([]);
                        }}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={toggleComparisonMode}
                        disabled={selectedForComparison.length < 2}
                        className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${selectedForComparison.length >= 2 ? 'bg-white text-blue-600 hover:bg-zinc-100' : 'bg-white/50 text-blue-600/50 cursor-not-allowed'}`}
                      >
                        {selectedForComparison.length < 2 ? 'Select 2+' : `Compare (${selectedForComparison.length})`}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showToast && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 20, x: '-50%' }}
                    className="fixed bottom-10 left-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl shadow-blue-900/50 flex items-center gap-3"
                  >
                    <CheckCircle size={20} />
                    {showToast}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isMobile && activeTab === 'display' && (lastAiMessage || (isLoading && lastUserMessage)) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="z-40 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-md shrink-0 overflow-hidden"
          >
            <div className="max-w-4xl mx-auto w-full p-3 sm:p-4 flex flex-col gap-3 relative">
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg mt-1 ${isLoading ? 'bg-zinc-800' : 'bg-blue-600 shadow-blue-900/20'}`}>
                  {isLoading ? (
                    <User size={18} className="text-zinc-400" />
                  ) : (
                    <Bot size={18} className="text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isLoading ? 'text-zinc-500' : 'text-blue-400'}`}>
                      {isLoading ? 'Your Message' : 'Assistant Message'}
                    </span>
                    <div className="flex items-center gap-1">
                      {isLoading && (
                        <div className="flex items-center gap-2 mr-2">
                          <span className="text-[10px] text-zinc-500 font-medium animate-pulse">Assistant is thinking...</span>
                          <Loader2 size={12} className="text-blue-500 animate-spin" />
                        </div>
                      )}
                      <button 
                        onClick={() => setIsAiMessageCollapsed(!isAiMessageCollapsed)}
                        className="text-zinc-500 hover:text-white transition-colors p-1"
                        title={isAiMessageCollapsed ? "Expand message" : "Collapse message"}
                      >
                        {isAiMessageCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button 
                        onClick={() => {
                          setLastAiMessage(null);
                          setLastUserMessage(null);
                        }}
                        className="text-zinc-500 hover:text-white transition-colors p-1"
                        title="Dismiss"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <motion.div 
                    animate={{ height: isAiMessageCollapsed ? '1.25rem' : 'auto' }}
                    className={`overflow-y-auto custom-scrollbar pr-2 ${isAiMessageCollapsed ? 'overflow-hidden' : 'max-h-[20vh]'}`}
                  >
                    <p className={`text-sm text-zinc-200 leading-relaxed ${isAiMessageCollapsed ? 'truncate' : (isLoading ? 'italic text-zinc-400' : '')}`}>
                      {isLoading ? lastUserMessage : lastAiMessage}
                    </p>
                  </motion.div>
                </div>
              </div>

              {!isAiMessageCollapsed && (
                <div className="flex gap-2 items-center justify-end">
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className="p-3 rounded-xl transition flex items-center justify-center border border-zinc-700/50 bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    title="Switch to Chat"
                  >
                    <MessageSquare size={18} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && (
        <div className="shrink-0 bg-zinc-900 z-50 border-t border-zinc-800">
          <ChatInterface 
            messages={messages} 
            isLoading={isLoading} 
            onSendMessage={handleSendMessage}
            activeTab={activeTab}
            onToggleView={() => setActiveTab(activeTab === 'chat' ? 'display' : 'chat')}
            isMobile={isMobile}
            renderInputOnly={true}
          />
        </div>
      )}
    </div>
  );
}
