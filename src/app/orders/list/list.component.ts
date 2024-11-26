import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { Order } from '../order.model';
import { Router } from '@angular/router';

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

  constructor(private ordersService: OrdersService, private router: Router) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.ordersService.getOrders().subscribe((data: Order[]) => {
      this.orders = data;
      this.filteredOrders = [...this.orders];
    });
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter((order) => {
      const matchesClient = order.client
        .toLowerCase()
        .includes(this.filters.client.toLowerCase());
      const matchesStatus =
        !this.filters.status || order.status === this.filters.status;
      const matchesDate =
        !this.filters.date || order.date === this.filters.date;
      return matchesClient && matchesStatus && matchesDate;
    });
  }

  viewDetails(orderId: string): void {
    this.router.navigate(['/orders/details', orderId]);
  }
}
