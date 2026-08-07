export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  productName: string;
  unitPrice: string;
  quantity: number;
  variant: {
    size: string;
    color: string;
    product: {
      slug: string;
      images: { url: string }[];
    };
  };
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  zipCode?: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalPrice: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  payment: { method: string; status: string } | null;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string };
}

export interface PaymentForm {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}
