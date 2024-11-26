import { InjectionToken } from "@angular/core";

export interface Product {
    id?: number; 
    name: string;
    brand: string;
    price: number;
    description: string;
    category: string;
    image: string;
  }

  export const PRODUCT_TOKEN = new InjectionToken<Product>('Product');