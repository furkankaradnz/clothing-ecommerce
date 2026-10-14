export interface Variant {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  priceDiff: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: string;
  discountPrice?: string | null;
  isFeatured?: boolean;
  isActive: boolean;
  material?: string | null;
  careInfo?: string | null;
  brand?: string | null;
  style?: string | null;
  fit?: string | null;
  category: Category;
  variants: Variant[];
  images: ProductImage[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: Pagination;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  style?: string;
  fit?: string;
  onSale?: boolean;
  featured?: boolean;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'name-asc';
}

// Filtre panelinde gösterilecek seçenekler
export interface FilterOptions {
  styles: string[];
  fits: string[];
  sizes: string[];
  colors: string[];
  priceRange: { min: number; max: number };
}
