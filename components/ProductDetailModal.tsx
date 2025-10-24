import React, { useState, useMemo } from 'react';
import type { Product } from '../types';
import CloseIcon from './icons/CloseIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import ProductCard from './ProductCard';

interface ProductDetailModalProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
  onBuyNow: (product: Product) => void;
  onResell: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, allProducts, onClose, onBuyNow, onResell, onProductClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.imageUrls.length) % product.imageUrls.length);
  };

  const relatedProducts = useMemo(() => {
    return allProducts.filter(p => p.id !== product.id).slice(0, 6);
  }, [allProducts, product.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-slate-50 rounded-xl shadow-2xl w-full h-full max-w-4xl m-auto relative transform transition-transform duration-300 scale-95" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 z-20 transition-colors">
          <CloseIcon />
        </button>
        <div className="flex flex-col md:flex-row h-full">
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-slate-100 relative flex items-center justify-center rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
            <img 
              src={product.imageUrls[currentImageIndex]} 
              alt={`${product.name} image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain max-h-[50vh] md:max-h-full" 
            />
            {product.imageUrls.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 text-slate-700 hover:bg-white hover:text-rose-500 transition-all">
                  <ChevronLeftIcon />
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 text-slate-700 hover:bg-white hover:text-rose-500 transition-all">
                  <ChevronRightIcon />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.imageUrls.map((_, index) => (
                        <div key={index} onClick={() => setCurrentImageIndex(index)} className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${index === currentImageIndex ? 'bg-rose-500' : 'bg-white/80'}`}></div>
                    ))}
                </div>
              </>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col p-6 overflow-y-auto">
            <div className="flex-grow">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">{product.name}</h1>
              <p className="text-2xl font-bold text-rose-600 my-3">₹{product.price.toLocaleString('en-IN')}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button onClick={() => onBuyNow(product)} className="w-full bg-rose-500 text-white py-3 px-4 rounded-lg text-base font-semibold hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all">
                Buy Now
              </button>
              <button onClick={() => onResell(product)} className="w-full bg-rose-100 text-rose-600 py-3 px-4 rounded-lg text-base font-semibold hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all">
                Resell
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
                <h2 className="text-lg font-semibold text-slate-700 mb-4">You might also like</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {relatedProducts.map(relatedProduct => (
                        <ProductCard 
                            key={relatedProduct.id}
                            product={relatedProduct}
                            onProductClick={onProductClick}
                        />
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
