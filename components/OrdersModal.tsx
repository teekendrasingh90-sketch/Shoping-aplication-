import React from 'react';
import type { Order } from '../types';
import CloseIcon from './icons/CloseIcon';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose, orders }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold text-slate-800">Your Orders</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
              <CloseIcon />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
              <p className="text-slate-500">You haven't placed any orders yet.</p>
              <button onClick={onClose} className="mt-4 bg-rose-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-rose-600 transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {orders.map(order => (
                <div key={order.id} className="flex items-start space-x-4 p-3 bg-slate-50 rounded-lg">
                  <img src={order.product.imageUrls[0]} alt={order.product.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-grow">
                    <h3 className="text-sm font-semibold text-slate-800">{order.product.name}</h3>
                    <p className="text-xs text-slate-500 mb-1">
                      Ordered on: {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    
                    {order.orderType === 'resell' ? (
                        <>
                            <p className="text-sm text-slate-600">
                                Customer Price: <span className="font-bold text-slate-800">₹{order.finalPrice.toLocaleString('en-IN')}</span>
                            </p>
                             <p className="text-sm text-green-600 font-semibold">
                                Your Profit: ₹{order.margin?.toLocaleString('en-IN') || 0}
                            </p>
                        </>
                    ) : (
                         <p className="text-sm text-slate-600">
                           Total Price: <span className="font-bold text-slate-800">₹{order.finalPrice.toLocaleString('en-IN')}</span>
                        </p>
                    )}
                    
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <h4 className="text-xs font-semibold text-slate-700">Shipping to:</h4>
                      <div className="text-xs text-slate-800 mt-1">
                        <p className="font-medium text-slate-900">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.houseNo}, {order.shippingAddress.area}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
                        <p>Phone: {order.shippingAddress.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersModal;