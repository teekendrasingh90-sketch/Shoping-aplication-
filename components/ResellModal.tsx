import React, { useState, useEffect } from 'react';
import type { Product, Address } from '../types';
import CloseIcon from './icons/CloseIcon';
import AddAddressModal from './AddAddressModal';
import LocationMarkerIcon from './icons/LocationMarkerIcon';

interface ResellModalProps {
  product: Product;
  onClose: () => void;
  onPlaceOrder: (orderData: { product: Product; finalPrice: number; address: Address; orderType: 'buy' | 'resell'; margin?: number }) => void;
  mode: 'buy' | 'resell';
}

const ResellModal: React.FC<ResellModalProps> = ({ product, onClose, onPlaceOrder, mode }) => {
  const [margin, setMargin] = useState<number>(mode === 'resell' ? 100 : 0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    if (mode === 'resell') {
      setFinalPrice(product.price + margin);
    } else {
      setFinalPrice(product.price);
    }
  }, [product.price, margin, mode]);

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMargin(isNaN(value) ? 0 : value);
  };

  const handlePlaceOrderClick = () => {
    if (!shippingAddress) {
      alert('Please enter your address');
      return;
    }
    onPlaceOrder({
        product, 
        finalPrice, 
        address: shippingAddress,
        orderType: mode,
        margin: mode === 'resell' ? margin : undefined
    });
    onClose();
  };
  
  const handleSaveAddress = (address: Address) => {
    setShippingAddress(address);
    setIsAddressModalOpen(false);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-auto transform transition-transform duration-300 scale-95" onClick={(e) => e.stopPropagation()}>
          <div className="p-5 border-b border-slate-200 relative">
            <h2 className="text-lg font-bold text-slate-800 text-center">
                {mode === 'resell' ? 'Resell Product' : 'Confirm Your Order'}
            </h2>
            <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <div className="p-5 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start space-x-4">
              <img src={product.imageUrls[0]} alt={product.name} className="w-24 h-24 rounded-lg object-cover shadow-sm"/>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-700">{product.name}</h3>
                <p className="text-sm text-slate-500">Base Price: <span className="font-bold">₹{product.price.toLocaleString('en-IN')}</span></p>
              </div>
            </div>

            {mode === 'resell' && (
              <>
                <div className="mt-6">
                  <label htmlFor="margin" className="block text-sm font-medium text-slate-700">Your Profit Margin (₹)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      name="margin"
                      id="margin"
                      className="block w-full rounded-md border-slate-300 pl-7 pr-12 focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                      placeholder="0.00"
                      value={margin}
                      onChange={handleMarginChange}
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-rose-50 rounded-lg text-center">
                    <p className="text-sm text-rose-800">Your Customer's Price</p>
                    <p className="text-2xl font-bold text-rose-600">₹{finalPrice.toLocaleString('en-IN')}</p>
                </div>
              </>
            )}

            {mode === 'buy' && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg text-center">
                    <p className="text-sm text-slate-800">Total Amount</p>
                    <p className="text-2xl font-bold text-slate-900">₹{finalPrice.toLocaleString('en-IN')}</p>
                </div>
            )}
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Shipping Address</h4>
              {shippingAddress ? (
                <div className="p-3 text-sm bg-slate-100 border border-slate-200 rounded-md">
                  <p className="font-semibold text-slate-900">{shippingAddress.name}</p>
                  <p className="text-slate-800">{shippingAddress.houseNo}, {shippingAddress.area}</p>
                  <p className="text-slate-800">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pinCode}</p>
                  <p className="text-slate-800">Phone: {shippingAddress.phone}</p>
                  <button onClick={() => setIsAddressModalOpen(true)} className="text-rose-600 text-xs font-semibold mt-1 hover:underline">Change Address</button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddressModalOpen(true)} 
                  className="flex items-center justify-center w-full border-2 border-dashed border-slate-300 text-slate-500 py-3 px-4 rounded-lg font-semibold hover:border-rose-400 hover:text-rose-500 transition-all duration-300 text-sm"
                >
                  <LocationMarkerIcon />
                  <span className="ml-2">Add Address</span>
                </button>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={handlePlaceOrderClick}
                disabled={!shippingAddress}
                className="flex items-center justify-center w-full bg-rose-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-base disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-rose-700"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddAddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
      />
    </>
  );
};

export default ResellModal;