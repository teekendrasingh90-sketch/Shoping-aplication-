import React from 'react';
import type { CartItem } from '../types';
import CloseIcon from './icons/CloseIcon';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity }) => {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold text-slate-800">Your Cart</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
              <CloseIcon />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
              <p className="text-slate-500">Your cart is empty.</p>
              <button onClick={onClose} className="mt-4 bg-rose-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-rose-600 transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-start space-x-4">
                  <img src={item.imageUrls[0]} alt={item.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-grow">
                    <h3 className="text-sm font-semibold text-slate-800">{item.name}</h3>
                    <p className="text-sm text-slate-500">₹{item.price.toLocaleString('en-IN')}</p>
                    <div className="flex items-center mt-2">
                       <div className="flex items-center border border-slate-200 rounded-md">
                        <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                        >
                            <MinusIcon />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                         <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:bg-slate-100"
                            aria-label="Increase quantity"
                        >
                            <PlusIcon />
                        </button>
                       </div>
                       <button onClick={() => onRemoveItem(item.id)} className="ml-auto text-red-500 hover:text-red-700" aria-label="Remove item">
                        <TrashIcon />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="p-4 border-t bg-slate-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-600 font-medium">Subtotal</span>
                <span className="font-bold text-lg text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <button className="w-full bg-rose-500 text-white py-3 rounded-md font-semibold hover:bg-rose-600 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;