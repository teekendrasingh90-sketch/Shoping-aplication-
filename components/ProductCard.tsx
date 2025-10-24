
import React from 'react';
import type { Product } from '../types';
import ShareIcon from './icons/ShareIcon';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onResell: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onBuyNow, onResell }) => {

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onProductClick
    const shareData = {
      title: product.name,
      text: `${product.name} - Check out this amazing product!\n${product.description}`,
      url: window.location.href, // In a real app, this would be the product's specific URL
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert('Web Share API is not supported in your browser.');
      }
    } catch (err) {
      console.error('Error sharing product:', err);
    }
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product);
  };

  const handleResellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResell(product);
  };

  return (
    <div 
      onClick={() => onProductClick(product)}
      className="bg-white rounded-lg shadow-md overflow-hidden group transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col cursor-pointer"
    >
      <div className="relative bg-slate-100">
        <img src={product.imageUrls[0]} alt={product.name} className="w-full h-40 sm:h-48 object-contain" />
         <button 
          onClick={handleShare}
          aria-label="Share Product"
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-2 text-slate-700 hover:bg-white hover:text-rose-500 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <ShareIcon />
        </button>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h3>
        <p className="text-md font-bold text-slate-900 mt-1">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
       <div className="p-2 pt-0 grid grid-cols-2 gap-2">
        <button 
          onClick={handleBuyClick}
          className="text-sm font-semibold text-rose-600 bg-rose-50 rounded-md py-2 px-2 hover:bg-rose-100 transition-colors duration-200"
        >
          Buy Now
        </button>
        <button 
          onClick={handleResellClick}
          className="text-sm font-semibold text-rose-600 bg-rose-50 rounded-md py-2 px-2 hover:bg-rose-100 transition-colors duration-200"
        >
          Resell
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
