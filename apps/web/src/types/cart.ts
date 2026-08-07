export interface CartItem {
  id: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  variant: {
    id: string;
    size: string;
    color: string;
    stock: number;
  };
  product: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Address {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  zipCode?: string;
  isDefault: boolean;
}
