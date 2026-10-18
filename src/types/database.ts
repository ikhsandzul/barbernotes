export type PaymentMethod = 'Cash' | 'QRIS';

export interface Barber {
  id: string;
  name: string;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  barber_id: string;
  service_id: string | null;
  customer_name: string;
  total_price: number;
  payment_method: PaymentMethod;
  created_at: string;
  barber?: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    name: string;
    price: number;
  } | null;
}
