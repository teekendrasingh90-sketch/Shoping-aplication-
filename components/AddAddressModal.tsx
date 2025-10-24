import React, { useState, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';
import type { Address } from '../types';
import { indianStates } from '../constants';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({ isOpen, onClose, onSave }) => {
  const [address, setAddress] = useState<Omit<Address, 'name'>>({
    phone: '',
    houseNo: '',
    area: '',
    city: '',
    pinCode: '',
    state: '',
  });
   const [name, setName] = useState('');
   const [errors, setErrors] = useState<{ phone?: string; pinCode?: string }>({});

  useEffect(() => {
    if (!isOpen) {
      // Reset form on close
      setAddress({ phone: '', houseNo: '', area: '', city: '', pinCode: '', state: '' });
      setName('');
      setErrors({});
    }
  }, [isOpen]);

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'phone') {
      if (!/^[6-9]\d{9}$/.test(value)) {
        error = 'Must be a valid 10-digit Indian mobile number.';
      }
    }
    if (name === 'pinCode') {
      if (!/^\d{6}$/.test(value)) {
        error = 'Must be a valid 6-digit Indian PIN code.';
      }
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else {
      setAddress(prev => ({ ...prev, [name]: value }));
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneError = validateField('phone', address.phone);
    const pinCodeError = validateField('pinCode', address.pinCode);

    if (phoneError || pinCodeError) {
        setErrors({ phone: phoneError, pinCode: pinCodeError });
        return;
    }

    const fullAddress = { name, ...address };
    // Simple validation for other fields
    for (const key in fullAddress) {
        if (!fullAddress[key as keyof typeof fullAddress].trim()) {
            const fieldName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
            alert(`Please fill out the ${fieldName} field.`);
            return;
        }
    }
    onSave(fullAddress as Address);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60] p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-auto transform transition-transform duration-300 scale-95" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 relative">
          <h2 className="text-lg font-bold text-slate-800 text-center">Add Shipping Address</h2>
          <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
            <input type="text" name="name" id="name" value={name} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
            <input type="tel" name="phone" id="phone" value={address.phone} onChange={handleInputChange} required className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm ${errors.phone ? 'border-red-500' : ''}`} />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="houseNo" className="block text-sm font-medium text-slate-700">House No. / Building Name</label>
            <input type="text" name="houseNo" id="houseNo" value={address.houseNo} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-slate-700">Area / Colony</label>
            <input type="text" name="area" id="area" value={address.area} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
              <input type="text" name="city" id="city" value={address.city} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="pinCode" className="block text-sm font-medium text-slate-700">PIN Code</label>
              <input type="text" name="pinCode" id="pinCode" value={address.pinCode} onChange={handleInputChange} required className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm ${errors.pinCode ? 'border-red-500' : ''}`} />
              {errors.pinCode && <p className="mt-1 text-xs text-red-600">{errors.pinCode}</p>}
            </div>
          </div>
          <div>
              <label htmlFor="state" className="block text-sm font-medium text-slate-700">State</label>
              <select name="state" id="state" value={address.state} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm">
                <option value="" disabled>Select State</option>
                {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
          </div>
          <div className="pt-5 flex justify-end gap-3">
             <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;