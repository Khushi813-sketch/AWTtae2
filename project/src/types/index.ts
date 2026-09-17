export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  mrp: number;
  unit: string;
  image_url: string;
  stock: number;
  tags: string[];
  is_available: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  city: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
}
