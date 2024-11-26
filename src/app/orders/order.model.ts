import { Product } from "../products/product.model";

export interface Order {
  id?: string;
  client: string;
  products: Product[];
  date: string;
  status: 'Pending' | 'Completed' | 'Canceled';
}
