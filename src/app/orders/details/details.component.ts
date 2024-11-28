import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../orders.service';
import { Order } from '../order.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  order: Order = {
    clientId: '',
    products: [],
    date: '',
    status: 'Pending',
  };
  role: string | null = null;
  currentClient: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.currentClient = this.authService.getUser()?.name || null;

    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.fetchOrder(orderId);
    }
  }

  fetchOrder(orderId: string): void {
    this.ordersService.getOrderById(orderId).subscribe((data: Order) => {
      if (this.role === 'client' && data.clientId !== this.currentClient) {
        alert('Access denied: You can only view your own orders.');
        this.router.navigate(['/orders']);
        return;
      }
      this.order = data;
    });
  }

  changeStatus(status: 'Pending' | 'Completed' | 'Canceled'): void {
    if (this.role === 'client') {
      alert('Access denied: Clients cannot change order status.');
      return;
    }

    if (this.order && this.order.id) {
      if (status === 'Completed') {
        let insufficientStock = false;

        this.order.products.forEach((product) => {
          this.ordersService
            .getProductById(product.id)
            .subscribe((dbProduct) => {
              const currentStock = dbProduct.quantity;
              const purchasedQuantity =
                this.order.products.find((p) => p.id === product.id)
                  ?.quantity || 0;

              const newStock = currentStock - purchasedQuantity;

              if (newStock < 0) {
                alert(`Insufficient stock for product: ${product.name}`);
                insufficientStock = true;
              } else {
                this.ordersService
                  .updateProductStock(product.id.toString(), newStock)
                  .subscribe({
                    next: () =>
                      console.log(`Stock updated for product ${product.name}`),
                    error: (err) =>
                      console.error(`Error updating stock: ${err}`),
                  });
              }
            });
        });

        if (insufficientStock) {
          return;
        }
      }

      this.ordersService
        .updateOrderStatus(this.order.id, status)
        .subscribe(() => {
          console.log(`Order status updated to ${status}`);
          this.order.status = status;
          this.router.navigate(['/orders']);
        });
    }
  }
}
