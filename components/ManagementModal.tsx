import React from 'react';
import CloseIcon from './icons/CloseIcon';
import ProductListingIcon from './icons/ProductListingIcon';
import BankDetailIcon from './icons/BankDetailIcon';
import AccountsIcon from './icons/AccountsIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface ManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductListingClick: () => void;
  onBankDetailClick: () => void;
}

const ManagementModal: React.FC<ManagementModalProps> = ({ isOpen, onClose, onProductListingClick, onBankDetailClick }) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      label: 'Product Listing',
      icon: <ProductListingIcon />,
      action: onProductListingClick,
    },
    {
      label: 'Bank Detail',
      icon: <BankDetailIcon />,
      action: onBankDetailClick,
    },
    {
      label: 'Accounts',
      icon: <AccountsIcon />,
      action: () => alert('Accounts feature coming soon!'),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60] p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm m-auto transform transition-transform duration-300 scale-95" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 relative">
          <h2 className="text-lg font-bold text-slate-800 text-center">Settings</h2>
          <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={item.action}
                  className="w-full flex items-center p-3 text-left text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <span className="text-slate-500">{item.icon}</span>
                  <span className="ml-4 font-medium flex-grow">{item.label}</span>
                  <span className="text-slate-400">
                    <ChevronRightIcon />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagementModal;