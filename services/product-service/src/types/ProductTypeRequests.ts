// src/types/ProductTypeRequests.ts
export interface CreateProductTypeBody {
  name: string;
  category: string;
  price: number;
}

export interface RestockProductTypeBody {
  amount: number;
}

export interface ProductTypeIdParams {
  id: string;
}
