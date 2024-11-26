import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './order.model';
import { Product } from '../products/product.model';
import { Client } from '../client/client.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private ordersUrl = 'http://localhost:3000/orders';
  private productsUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.ordersUrl}/${id}`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${productId}`);
  }  

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>('http://localhost:3000/clients');
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.ordersUrl, order);
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.ordersUrl}/${id}`, { status });
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.ordersUrl}/${id}`);
  }

  updateProductStock(productId: string, newQuantity: number): Observable<void> {
    return this.http.patch<void>(`${this.productsUrl}/${productId}`, {
      quantity: newQuantity,
    });
  }
}
