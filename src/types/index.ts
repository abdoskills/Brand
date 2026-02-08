export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAt: number | null;
  currency: string;
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
    | "jackets"
    | "tops";
  badge: "New" | "Hot" | "Limited" | "Trending" | "Best Seller" | null;
  isActive: boolean;
  isFeatured?: boolean;
  collectionTag?: string | null;
  ratingAvg: number;
  reviewsCount: number;
  stock: number;
  inStock: boolean;
  features: string[];
  sizes: string[];
  createdAt: string;
  isNew?: boolean;
  brand?: string;
  highlights?: string[];
  sku?: string;
  materials?: string | null;
  care?: string | null;
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
  guestId?: string;
  items: OrderItem[];
  shipping: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  subtotal: number;
  total: number;
  status: "preparing" | "shipping" | "shipped" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
