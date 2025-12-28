export interface CreateOrderInput {
  items: {
    productId: string;
    quantity: number;
  }[];
}