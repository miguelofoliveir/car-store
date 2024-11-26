import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../products/product.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  updateProductQuantity(
    productId: number,
    quantity: number
  ): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${productId}`, {
      quantity,
    });
  }
}
