import React, { useState, useEffect, useRef } from 'react';
import OrdersIcon from './icons/OrdersIcon';
import UserIcon from './icons/UserIcon';
import SearchIcon from './icons/SearchIcon';
import CloseIcon from './icons/CloseIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';
import type { UserProfile } from '../types';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  orderCount: number;
  onOrdersClick: () => void;
  onAddProductClick: () => void;
  onProfileClick: () => void;
  currentUser: UserProfile | null;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange, orderCount, onOrdersClick, onAddProductClick, onProfileClick, currentUser }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleToggleSearch = () => {
    if (isSearchOpen) {
      onSearchChange(''); // Clear search when closing
    }
    setIsSearchOpen(!isSearchOpen);
  };
  
  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  return (
    <header className="bg-gray-900 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {isSearchOpen ? (
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for products..."
            className="w-full h-10 px-4 border-0 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search for products"
          />
        ) : (
          <div className="flex items-center gap-3">
             <button
              onClick={onAddProductClick}
              className="text-slate-300 hover:text-rose-500 transition-colors"
              aria-label="Add new product via link"
            >
              <PlusCircleIcon className="h-7 w-7" />
            </button>
            <h1 className="text-xl font-bold text-rose-500">
              Spark
            </h1>
          </div>
        )}

        <div className="flex items-center space-x-4 flex-shrink-0">
          <button
            onClick={handleToggleSearch}
            className="text-slate-300 hover:text-rose-500 transition-colors"
            aria-label={isSearchOpen ? "Close search bar" : "Open search bar"}
          >
            {isSearchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>
          <button 
            onClick={onProfileClick}
            className="text-slate-300 hover:text-rose-500 transition-colors"
            aria-label="Open user profile"
          >
            {currentUser ? (
              <img src={currentUser.profilePic} alt="User Profile" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <UserIcon />
            )}
          </button>
          <button 
            onClick={onOrdersClick}
            className="text-slate-300 hover:text-rose-500 transition-colors relative"
            aria-label={`Open orders with ${orderCount} items`}
          >
            <OrdersIcon />
            {orderCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {orderCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;