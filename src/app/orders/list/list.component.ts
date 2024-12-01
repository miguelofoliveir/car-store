import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { Order } from '../order.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  filters: { client: string; status: string; date: string } = {
    client: '',
    status: '',
    date: '',
  };
  role: string | null = null;
  isLoading: boolean = false;

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading = true;
    this.ordersService.getOrders().subscribe((data: Order[]) => {
      if (this.role === 'client') {
        const clientName = this.authService.getUser()?.name;
        this.orders = data.filter((order) => order.clientId === clientName);
      } else {
        this.orders = data;
      }
      this.filteredOrders = [...this.orders];
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    this.isLoading = true;
    this.filteredOrders = this.orders.filter((order) => {
      const matchesClient = this.filters.client
        ? order.clientId
            .toLowerCase()
            .includes(this.filters.client.toLowerCase())
        : true;
      const matchesStatus =
        !this.filters.status || order.status === this.filters.status;
      const matchesDate =
        !this.filters.date || order.date === this.filters.date;

      return matchesClient && matchesStatus && matchesDate;
    });
    this.isLoading = false;
  }

  viewDetails(orderId: string): void {
    this.isLoading = true;
    this.router.navigate(['/orders/details', orderId]);
    this.isLoading = false;
  }
}
