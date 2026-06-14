import React from 'react';
import { Product } from '@/lib/products';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  selectedIds?: string[];
}

export default function ProductList({ products, onProductClick, selectedIds = [] }: ProductListProps) {
  const isComparisonMode = selectedIds.length > 0 || (onProductClick && onProductClick.toString().includes('handleToggleProductSelection'));
  
  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100">Our Products</h2>
          <p className="text-zinc-500 mt-1">
            {selectedIds.length > 0 
              ? `${selectedIds.length} product${selectedIds.length === 1 ? '' : 's'} selected for comparison`
              : 'Browse our sustainable collection'
            }
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map(p => (
          <ProductCard 
            key={p.id} 
            product={p} 
            onClick={onProductClick} 
            selected={selectedIds.includes(p.id)}
          />
        ))}
      </div>
    </div>
  );
}
