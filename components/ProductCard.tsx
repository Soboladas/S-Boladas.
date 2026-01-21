
import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetail: (p: Product) => void;
  theme: 'light' | 'dark';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetail, theme }) => {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600';

  return (
    <div className={`rounded-2xl overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 border flex flex-col ${theme === 'dark' ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-gray-100'}`}>
      <div 
        className="relative overflow-hidden cursor-pointer aspect-square"
        onClick={() => onViewDetail(product)}
      >
        <img 
          src={mainImage} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-widest">
            -{discount}%
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.rating}</span>
          </div>
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-2 py-0.5 rounded bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">{product.condition}</span>
        </div>
        
        <h3 
          className="text-xs font-black text-gray-800 dark:text-white line-clamp-2 mb-4 cursor-pointer hover:text-blue-500 transition-colors uppercase tracking-tight"
          onClick={() => onViewDetail(product)}
        >
          {product.name}
        </h3>

        <div className="mt-auto space-y-4">
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] font-bold line-through">MT {product.originalPrice.toLocaleString('pt-PT')}</span>
            <span className="text-lg font-black text-gray-900 dark:text-white">MT {product.price.toLocaleString('pt-PT')}</span>
          </div>

          <button 
            onClick={() => onAddToCart(product)}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 dark:bg-slate-700 text-white py-3 rounded-xl hover:bg-blue-600 transition-all text-[11px] font-black uppercase tracking-widest shadow-xl active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" /> Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
