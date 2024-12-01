import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalOrders = 0;
  totalClients = 0;
  isLoading: boolean = false;
  orderStatusData: { name: string; value: number }[] = [];
  lowStockData: { name: string; value: number }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.http
      .get<any[]>(`${environment.apiUrl}/products`)
      .subscribe((products) => {
        this.totalProducts = products.length;
        this.lowStockData = products
          .filter((product) => product.quantity <= 5)
          .map((product) => ({ name: product.name, value: product.quantity }));
      });

    this.http.get<any[]>(`${environment.apiUrl}/orders`).subscribe((orders) => {
      this.totalOrders = orders.length;
      const statusCounts = orders.reduce(
        (acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        },
        { Completed: 0, Pending: 0, Canceled: 0 }
      );
      this.orderStatusData = [
        { name: 'Completed', value: statusCounts.Completed },
        { name: 'Pending', value: statusCounts.Pending },
        { name: 'Canceled', value: statusCounts.Canceled },
      ];
    });

    this.http
      .get<any[]>(`${environment.apiUrl}/clients`)
      .subscribe((clients) => {
        this.totalClients = clients.length;
      });
    this.isLoading = false;
  }
}
