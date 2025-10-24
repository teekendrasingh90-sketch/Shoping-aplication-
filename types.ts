export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
}

// FIX: Added missing CartItem interface.
export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  name: string;
  username: string;
  phone: string;
  profilePic: string;
  upiId: string;
  password?: string;
}

export interface SavedAccount {
  id: number;
  name: string;
  phone: string;
  upiId: string;
}

export interface Address {
  name: string;
  phone: string;
  houseNo: string;
  area: string;
  city: string;
  pinCode: string;
  state: string;
}

export interface Order {
  id: number;
  product: Product;
  finalPrice: number;
  orderDate: string;
  shippingAddress: Address;
  orderType: 'buy' | 'resell';
  margin?: number;
}