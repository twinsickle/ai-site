import React from 'react';
import { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  selected?: boolean;
}

export default function ProductCard({ product, onClick, selected }: ProductCardProps) {
  return (
    <div 
      className={`bg-zinc-900 p-4 rounded-xl shadow-xl border transition flex flex-col relative group ${selected ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-800'} ${onClick ? 'cursor-pointer hover:border-blue-500/50' : 'hover:border-zinc-700'}`}
      onClick={() => onClick?.(product)}
    >
      {selected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      )}
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
      <div className="flex-1">
        <h3 className="text-xl font-bold text-zinc-100">{product.name}</h3>
        <p className="text-zinc-400 mb-2">{product.category}</p>
        <p className="text-blue-400 font-bold text-lg mb-4">${product.price}</p>
      </div>
      <div className={`w-full py-2 rounded-lg transition font-bold text-center text-sm ${selected ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-white group-hover:bg-zinc-700'}`}>
        {selected ? 'Added to Compare' : 'View Details & Configure'}
      </div>
    </div>
  );
}
