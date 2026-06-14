'use client';

import React, { useState } from 'react';
import { products, Product, Reservation } from '@/lib/products';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import ProductConfigurator from './ProductConfigurator';
import ProductComparison from './ProductComparison';
import ReservationForm from './ReservationForm';
import ChatInterface, { Message } from './ChatInterface';
import { ShoppingCart, Home, Laptop, ArrowLeft, Trash2, CheckCircle, BrainCircuit, CalendarCheck, Scale } from 'lucide-react';
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

  const handleSendMessage = async (content: string) => {
    const newMessages = [...messages, { role: 'user' as const, content }];
    setMessages(newMessages);
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
      
      if (data.uiAction) {
        if (data.uiAction.type === 'reserve') {
          handleReserve(data.uiAction.product, data.uiAction.config || {});
        } else if (data.uiAction.type === 'update_config') {
          setActiveConfig(prev => ({ ...prev, ...data.uiAction.config }));
        } else {
          // Reset comparison state when AI moves away from list/comparison
          if (data.uiAction.type !== 'list' && data.uiAction.type !== 'comparison') {
            setIsComparisonMode(false);
            setSelectedForComparison([]);
          }
          setViewState(data.uiAction);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error connecting to the AI agent.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const showAllProducts = () => {
    setIsComparisonMode(false);
    setSelectedForComparison([]);
    setViewState({ type: 'list', products: products });
  };

  const toggleComparisonMode = () => {
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
    setSelectedForComparison(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const showProductDetail = (product: Product) => {
    setIsComparisonMode(false);
    setSelectedForComparison([]);
    setViewState({ type: 'detail', product });
  };

  const showProductConfig = (product: Product) => {
    setIsComparisonMode(false);
    setSelectedForComparison([]);
    
    // Initialize config if switching to a new product
    const initialConfig: Record<string, string> = {};
    product.options?.forEach(opt => {
      initialConfig[opt.name] = opt.values[0];
    });
    setActiveConfig(initialConfig);
    
    setViewState({ type: 'config', product });
  };

  const showWelcome = () => {
    setIsComparisonMode(false);
    setSelectedForComparison([]);
    setViewState({ type: 'welcome' });
  };

  const handleReserve = (product: Product, config: Record<string, string>) => {
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
    setCurrentReservation(null);
    setIsComparisonMode(false);
    setSelectedForComparison([]);
    showWelcome();
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans">
      <ChatInterface 
        messages={messages} 
        isLoading={isLoading} 
        onSendMessage={handleSendMessage} 
      />

      {/* Visual Display Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation for Manual Control */}
        <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md z-10">
          <div className="flex gap-4">
            <button 
              onClick={showWelcome}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${viewState.type === 'welcome' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Home size={18} />
              Home
            </button>
            <button 
              onClick={showAllProducts}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${viewState.type === 'list' && !isComparisonMode ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Laptop size={18} />
              Products
            </button>
            <button 
              onClick={toggleComparisonMode}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${(viewState.type === 'comparison' || isComparisonMode) ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Scale size={18} />
              {isComparisonMode ? `Finish Selection (${selectedForComparison.length})` : 'Compare Products'}
            </button>
            {currentReservation && (
              <button 
                onClick={() => {
                  setIsComparisonMode(false);
                  setSelectedForComparison([]);
                  setViewState({ type: 'reservation', reservation: currentReservation });
                }}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${viewState.type === 'reservation' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <CalendarCheck size={18} />
                Reservation
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 font-mono uppercase tracking-widest">
            <BrainCircuit size={14} className="text-blue-500" />
            Gemini Powered Agent
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative flex flex-col">
          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
            <motion.div
              key={viewState.type + (viewState.type === 'detail' ? viewState.product.id : '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {viewState.type === 'welcome' && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                    <Laptop size={40} className="text-blue-500" />
                  </div>
                  <h1 className="text-6xl font-black text-zinc-100 mb-6 tracking-tighter">
                    Eco<span className="text-blue-500">Shop</span>
                  </h1>
                  <p className="text-xl text-zinc-400 max-w-lg mb-10 leading-relaxed">
                    The next generation of sustainable electronics. 
                    Talk to our AI assistant to find the perfect gear.
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={showAllProducts}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition transform hover:scale-105 shadow-xl shadow-blue-900/40"
                    >
                      Browse Catalog
                    </button>
                  </div>
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

          {/* Comparison Selection Banner */}
          <AnimatePresence>
            {isComparisonMode && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-blue-600 p-6 shadow-2xl border-t border-blue-400/30 backdrop-blur-xl z-20 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Scale className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Comparison Mode Active</h3>
                    <p className="text-blue-100 text-sm">Select 2 or more products to compare their features and specs.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setIsComparisonMode(false);
                      setSelectedForComparison([]);
                    }}
                    className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition flex items-center gap-2"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={toggleComparisonMode}
                    disabled={selectedForComparison.length < 2}
                    className={`px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 ${selectedForComparison.length >= 2 ? 'bg-white text-blue-600 hover:bg-zinc-100' : 'bg-white/50 text-blue-600/50 cursor-not-allowed'}`}
                  >
                    {selectedForComparison.length < 2 ? 'Select at least 2' : `Compare ${selectedForComparison.length} Products`}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toast Notification */}
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
      </div>
    </div>
  );
}
