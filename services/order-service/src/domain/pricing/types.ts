export type Location = 'US' | 'EU' | 'ASIA';

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  category: string;
}

export interface PricingContext {
  location: Location;
  orderDate: Date;
}
