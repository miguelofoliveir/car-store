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
    this.ordersService.getOrders().subscribe((data: Order[]) => {
      if (this.role === 'client') {
        const clientName = this.authService.getUser()?.name;
        this.orders = data.filter((order) => order.client === clientName);
      } else {
        this.orders = data;
      }
      this.filteredOrders = [...this.orders];
    });
  }

  applyFilters(): void {
    if (this.role === 'client') {
      this.filters.client = '';
    }

    this.filteredOrders = this.orders.filter((order) => {
      const matchesStatus =
        !this.filters.status || order.status === this.filters.status;
      const matchesDate =
        !this.filters.date || order.date === this.filters.date;
      return matchesStatus && matchesDate;
    });
  }

  viewDetails(orderId: string): void {
    this.router.navigate(['/orders/details', orderId]);
  }
}
