export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAt: number | null;
  images: string[];
  category:
    | "accessories"
    | "bottoms"
    | "outerwear"
    | "headwear"
    | "essentials"
    | "hoodies"
    | "tees"
    | "pants"
    | "jackets";
  badge: "New" | "Hot" | "Limited" | "Trending" | "Best Seller" | null;
  ratingAvg: number;
  reviewsCount: number;
  stock: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  qty: number;
  size: "S" | "M" | "L" | "XL";
}

export interface AuthUser {
  id: string;
  name: string;
  emailOrPhone: string;
  role: "user" | "admin";
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size: "S" | "M" | "L" | "XL";
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shipping: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  subtotal: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
