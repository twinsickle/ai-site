import React from 'react';
import { Product } from '@/lib/products';
import { Settings, ArrowRight, Check, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductConfiguratorProps {
  product: Product;
  config: Record<string, string>;
  onConfigChange: (config: Record<string, string>) => void;
  onBack?: () => void;
  onReserve?: (product: Product, config: Record<string, string>) => void;
}

export default function ProductConfigurator({ product, config, onConfigChange, onBack, onReserve }: ProductConfiguratorProps) {
  const handleOptionChange = (optionName: string, value: string) => {
    onConfigChange({ ...config, [optionName]: value });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {onBack && (
        <button 
          onClick={onBack}
          className="mb-8 text-zinc-400 hover:text-white flex items-center gap-2 transition group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Product Details
        </button>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Summary & Visual */}
        <div className="lg:w-1/3">
          <div className="sticky top-8 space-y-6">
            <div className="relative group">
               <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full aspect-square object-cover rounded-3xl shadow-2xl border border-zinc-800" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent rounded-3xl" />
              <div className="absolute bottom-6 left-6 right-6">
                 <h2 className="text-2xl font-black text-white tracking-tighter">{product.name}</h2>
                 <p className="text-zinc-400 text-sm">{product.category}</p>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                <Info size={14} />
                Your Configuration
              </h3>
              <div className="space-y-3">
                {Object.entries(config).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">{key}</span>
                    <span className="text-zinc-100 font-medium">{value}</span>
                  </div>
                ))}
                <div className="pt-4 mt-4 border-t border-zinc-800 flex justify-between items-end">
                  <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Estimated Price</span>
                  <span className="text-2xl font-black text-white">${product.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Configuration Options */}
        <div className="flex-1 bg-zinc-900/30 border border-zinc-800/50 p-8 lg:p-12 rounded-[40px] backdrop-blur-sm">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-zinc-100 tracking-tighter">Customize</h2>
            <p className="text-zinc-400 mt-2">Tailor the {product.name} to your specific needs.</p>
          </div>

          {product.options && product.options.length > 0 ? (
            <div className="space-y-10 mb-12">
              {product.options.map((option) => (
                <div key={option.name} className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    {option.name}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {option.values.map((val) => (
                      <button
                        key={val}
                        onClick={() => handleOptionChange(option.name, val)}
                        className={`px-6 py-4 rounded-2xl font-bold text-left transition-all border flex items-center justify-between ${
                          config[option.name] === val
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        {val}
                        {config[option.name] === val && <Check size={18} />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-zinc-500">This product has no customizable options.</p>
            </div>
          )}

          <div className="pt-8 border-t border-zinc-800">
            {onReserve && (
              <button 
                onClick={() => onReserve(product, config)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition transform hover:scale-105 active:scale-95 shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3"
              >
                Proceed to Reservation
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
