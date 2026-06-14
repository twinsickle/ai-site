import React from 'react';
import { Product } from '@/lib/products';
import { ArrowLeft } from 'lucide-react';

interface ProductComparisonProps {
  products: Product[];
  onBack?: () => void;
}

export default function ProductComparison({ products, onBack }: ProductComparisonProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">Product Comparison</h2>
        <div className="flex gap-4 w-full sm:w-auto">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition"
            >
              <ArrowLeft size={18} />
              Back to Catalog
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(p => (
          <div key={p.id} className="bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-800 border-t-4 border-t-blue-500 flex flex-col">
            <h3 className="text-2xl font-bold mb-4 text-zinc-100">{p.name}</h3>
            <div className="space-y-4 flex-1">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">Price</span>
                <span className="font-bold text-blue-400">${p.price}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">Category</span>
                <span className="text-zinc-300">{p.category}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-2">Features</span>
                <ul className="text-sm space-y-1">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center text-zinc-400">
                      <span className="mr-2 text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
