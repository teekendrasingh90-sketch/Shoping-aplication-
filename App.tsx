import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ResellModal from './components/ResellModal';
import OrdersModal from './components/OrdersModal';
import AddProductModal from './components/AddProductModal';
import ProfileModal from './components/ProfileModal';
import ManagementModal from './components/ManagementModal';
import BankDetailModal from './components/BankDetailModal';
import ProductDetailModal from './components/ProductDetailModal';
import AuthModal from './components/AuthModal';
import PasswordPromptModal from './components/PasswordPromptModal';
import { products as initialProducts } from './constants';
import type { Product, Order, UserProfile, SavedAccount, Address } from './types';

const initialUser: UserProfile = {
  name: 'Spark User',
  username: 'sparkuser',
  phone: '9876543210',
  profilePic: 'https://i.pravatar.cc/150?u=sparkuser',
  upiId: 'spark@upi',
  password: 'password123',
};

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'buy' | 'resell'>('buy');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const savedUsersJSON = localStorage.getItem('spark-users');
      const parsedUsers = savedUsersJSON ? JSON.parse(savedUsersJSON) : [];

      if (parsedUsers.length === 0) {
        localStorage.setItem('spark-users', JSON.stringify([initialUser]));
        return [initialUser];
      }
      
      const migratedUsers = parsedUsers.map((u: any) => {
          if (!u.username && u.phone) {
              return { ...u, username: u.phone };
          }
          return u;
      });
      
      if (JSON.stringify(migratedUsers) !== JSON.stringify(parsedUsers)) {
          localStorage.setItem('spark-users', JSON.stringify(migratedUsers));
      }
      
      return migratedUsers;
    } catch (error) {
      console.error("Failed to process users from localStorage", error);
      localStorage.setItem('spark-users', JSON.stringify([initialUser]));
      return [initialUser];
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const isAuthenticated = !!currentUser;

  useEffect(() => {
    try {
      const loggedInUsername = sessionStorage.getItem('spark-currentUsername');
      if (loggedInUsername) {
        const savedUsers = JSON.parse(localStorage.getItem('spark-users') || '[]');
        const user = savedUsers.find((u: UserProfile) => u.username === loggedInUsername);
        if (user) {
          setCurrentUser(user);
        }
      }
    } catch (error) {
      console.error("Failed to restore session", error);
    }
  }, []);

  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([
    { id: 1, name: 'Customer A', phone: '1112223330', upiId: 'customera@upi' },
    { id: 2, name: 'Customer B', phone: '4445556660', upiId: 'customerb@upi' },
  ]);

  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [isBankDetailModalOpen, setIsBankDetailModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleProductClick = (product: Product) => {
    setViewingProduct(product);
  };

  const handleCloseDetailModal = () => {
    setViewingProduct(null);
  };

  const handleOpenBuyModal = (product: Product) => {
    setViewingProduct(null);
    setSelectedProduct(product);
    setModalMode('buy');
  };

  const handleOpenResellModal = (product: Product) => {
    setViewingProduct(null);
    setSelectedProduct(product);
    setModalMode('resell');
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };
  
  const handlePlaceOrder = (orderData: { product: Product; finalPrice: number; address: Address; orderType: 'buy' | 'resell'; margin?: number }) => {
    const { address, ...restOfOrderData } = orderData;
    const newOrder: Order = {
      id: Date.now(),
      ...restOfOrderData,
      shippingAddress: address,
      orderDate: new Date().toISOString(),
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      id: Date.now(),
      ...productData,
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
    setIsAddProductModalOpen(false);
  };

  const handleOpenProductListing = () => {
    setIsManagementModalOpen(false);
    setIsAddProductModalOpen(true);
  };

  const handleOpenBankDetails = () => {
    setIsManagementModalOpen(false);
    setIsBankDetailModalOpen(true);
  };
  
  const handleProfileClick = () => {
    if (isAuthenticated) {
      setIsProfileModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };
  
  const handleLogin = (credentials: { username: string; password?: string }): boolean => {
    const user = users.find(u => u.username === credentials.username && u.password === credentials.password);
    if (user) {
      setCurrentUser(user);
      sessionStorage.setItem('spark-currentUsername', user.username);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('spark-currentUsername');
    setIsProfileModalOpen(false);
  };

  const handleUpdateProfile = (newProfileData: UserProfile) => {
    if (!currentUser) return;

    const updatedProfile = { ...currentUser, ...newProfileData };

    const updatedUsers = users.map(user => 
      user.username === currentUser.username ? updatedProfile : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('spark-users', JSON.stringify(updatedUsers));
    setCurrentUser(updatedProfile);

    setSavedAccounts(prevAccounts => {
        const existingAccountIndex = prevAccounts.findIndex(acc => acc.phone === updatedProfile.phone);

        if (existingAccountIndex > -1) {
            const updatedAccounts = [...prevAccounts];
            updatedAccounts[existingAccountIndex] = {
                ...prevAccounts[existingAccountIndex],
                name: updatedProfile.name,
                upiId: updatedProfile.upiId,
            };
            return updatedAccounts;
        } else {
            const newAccount: SavedAccount = {
                id: Date.now(),
                name: updatedProfile.name,
                phone: updatedProfile.phone,
                upiId: updatedProfile.upiId,
            };
            return [...prevAccounts, newAccount];
        }
    });

    setIsProfileModalOpen(false);
  };
  
  const handleTriggerAddProduct = () => {
    setPasswordError('');
    setIsPasswordPromptOpen(true);
  };

  const handlePasswordCheck = (password: string) => {
    if (password === 'Cj@jaat11') {
      setPasswordError('');
      setIsPasswordPromptOpen(false);
      setIsManagementModalOpen(true);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);
  
  const orderCount = useMemo(() => orders.length, [orders]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        orderCount={orderCount}
        onOrdersClick={() => setIsOrdersModalOpen(true)}
        onAddProductClick={handleTriggerAddProduct}
        onProfileClick={handleProfileClick}
        currentUser={currentUser}
      />
      <main className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">Discover Products</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onProductClick={handleProductClick}
                onBuyNow={handleOpenBuyModal}
                onResell={handleOpenResellModal}
              />
            ))}
          </div>
        </div>
      </main>
      
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          allProducts={products}
          onClose={handleCloseDetailModal}
          onBuyNow={handleOpenBuyModal}
          onResell={handleOpenResellModal}
          onProductClick={handleProductClick}
        />
      )}

      {selectedProduct && (
        <ResellModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
          onPlaceOrder={handlePlaceOrder}
          mode={modalMode}
        />
      )}
      <OrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        orders={orders}
      />
      <ManagementModal
        isOpen={isManagementModalOpen}
        onClose={() => setIsManagementModalOpen(false)}
        onProductListingClick={handleOpenProductListing}
        onBankDetailClick={handleOpenBankDetails}
      />
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
      {currentUser && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userProfile={currentUser}
          onSave={handleUpdateProfile}
          onLogout={handleLogout}
        />
      )}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
      <BankDetailModal
        isOpen={isBankDetailModalOpen}
        onClose={() => setIsBankDetailModalOpen(false)}
        savedAccounts={savedAccounts}
      />
       <PasswordPromptModal
        isOpen={isPasswordPromptOpen}
        onClose={() => setIsPasswordPromptOpen(false)}
        onSubmit={handlePasswordCheck}
        error={passwordError}
      />
    </div>
  );
}

export default App;