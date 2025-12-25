export interface CreateProductBody {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface StockChangeBody {
  amount: number;
}

export interface ProductIdParams {
  id: string;
}
