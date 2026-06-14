import React from 'react';
import { Product } from '@/lib/products';
import { Settings, ArrowRight, Zap, Shield, Recycle } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack?: () => void;
  onConfigure?: (product: Product) => void;
}

export default function ProductDetail({ product, onBack, onConfigure }: ProductDetailProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {onBack && (
        <button 
          onClick={onBack}
          className="mb-8 text-zinc-400 hover:text-white flex items-center gap-2 transition group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Catalog
        </button>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Visual Section */}
        <div className="lg:w-1/2">
          <div className="sticky top-8">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-64 sm:h-[400px] lg:h-[600px] object-cover rounded-2xl lg:rounded-[40px] shadow-2xl border border-zinc-800" 
            />
          </div>
        </div>

        {/* Information Section */}
        <div className="flex-1 space-y-12">
          <div>
            <span className="text-blue-500 font-bold uppercase tracking-widest text-xs">{product.category}</span>
            <h2 className="text-4xl sm:text-6xl font-black mt-2 mb-6 text-zinc-100 tracking-tighter leading-none">{product.name}</h2>
            <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.features.map((f, i) => (
              <div key={i} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl flex items-start gap-4 hover:bg-zinc-900 transition">
                <div className="p-2 bg-blue-600/10 rounded-xl">
                   {i % 3 === 0 ? <Zap size={20} className="text-blue-500" /> : 
                    i % 3 === 1 ? <Shield size={20} className="text-blue-500" /> : 
                    <Recycle size={20} className="text-blue-500" />}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-100 mb-1">Feature Highlight</h4>
                  <p className="text-sm text-zinc-400">{f}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-10 rounded-[40px] shadow-2xl shadow-blue-900/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-white text-3xl font-black tracking-tight mb-2">Ready to customize?</h3>
                <p className="text-blue-100">Select colors, storage, and other sustainable options.</p>
              </div>
              {onConfigure && (
                <button 
                  onClick={() => onConfigure(product)}
                  className="w-full md:w-auto bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg transition transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
                >
                  Configure Now
                  <Settings size={20} />
                </button>
              )}
            </div>
          </div>
          
          <div className="pt-8 border-t border-zinc-900 flex justify-between items-center text-zinc-500">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium uppercase tracking-widest">In Stock</span>
             </div>
             <p className="text-3xl font-black text-white">${product.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
