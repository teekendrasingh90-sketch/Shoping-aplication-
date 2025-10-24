import React, { useState, useRef, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';
import ImageIcon from './icons/ImageIcon';
import type { Product } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (productData: Omit<Product, 'id'>) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset form when modal is closed
    if (!isOpen) {
      setTimeout(() => {
        setName('');
        setDescription('');
        setPrice('');
        setImagePreview(null);
        if(fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 300); // Animation delay
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !price || !imagePreview) {
      alert('Please fill all fields and upload an image.');
      return;
    }
    onAddProduct({
      name,
      description,
      price: parseFloat(price),
      imageUrls: [imagePreview], // In a real app, this would be an uploaded URL
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60] p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-auto transform transition-transform duration-300 scale-95" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 relative">
          <h2 className="text-lg font-bold text-slate-800 text-center">List a New Product</h2>
          <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 flex justify-center items-center h-48 bg-slate-100 px-6 py-5 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:border-rose-400"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Product preview" className="max-h-full max-w-full rounded-md object-contain" />
              ) : (
                <div className="space-y-1 text-center">
                  <ImageIcon />
                  <div className="flex text-sm text-slate-600">
                    <p className="pl-1">Upload a file or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <label htmlFor="product-name" className="block text-sm font-medium text-slate-700">Product Title</label>
            <input type="text" name="product-name" id="product-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
            <textarea id="description" name="description" rows={4} value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"></textarea>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (₹)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
              <input type="number" name="price" id="price" value={price} onChange={e => setPrice(e.target.value)} required className="block w-full rounded-md border-slate-300 pl-7 focus:border-rose-500 focus:ring-rose-500 sm:text-sm" placeholder="0.00" />
            </div>
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
              List Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;