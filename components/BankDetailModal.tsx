import React from 'react';
import CloseIcon from './icons/CloseIcon';
import type { SavedAccount } from '../types';

interface BankDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedAccounts: SavedAccount[];
}

const BankDetailModal: React.FC<BankDetailModalProps> = ({ isOpen, onClose, savedAccounts }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60] p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-auto transform transition-transform duration-300 scale-95" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 relative">
          <h2 className="text-lg font-bold text-slate-800 text-center">Saved Bank Details</h2>
          <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
            <p className="text-sm text-slate-600 mb-4">
                This is a list of all your saved account details for quick reference.
            </p>
            {savedAccounts.length > 0 ? (
                <div className="space-y-3">
                    {savedAccounts.map(account => (
                        <div key={account.id} className="p-4 border border-slate-200 rounded-lg">
                            <h3 className="font-semibold text-slate-800">{account.name}</h3>
                            <div className="mt-2 text-sm text-slate-600 space-y-1">
                                <p><span className="font-medium">Phone:</span> {account.phone}</p>
                                <p><span className="font-medium">UPI ID:</span> {account.upiId}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-slate-500">No bank details saved yet.</p>
                    <p className="text-sm text-slate-400 mt-1">Save your details from the Profile Settings to see them here.</p>
                </div>
            )}
             <div className="mt-6 text-center">
                <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                Close
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetailModal;