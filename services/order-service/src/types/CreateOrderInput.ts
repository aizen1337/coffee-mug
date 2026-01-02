import { Location, OrderItem } from "@src/domain/pricing/types";

export interface CreateOrderInput {
  customer: string;
  items: OrderItem[];
  location: Location;
}
