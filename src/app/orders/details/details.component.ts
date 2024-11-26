import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../orders.service';
import { Order } from '../order.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  order: Order = {
    client: '',
    products: [],
    date: '',
    status: 'Pending',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.fetchOrder(orderId);
    }
  }

  fetchOrder(orderId: string): void {
    this.ordersService.getOrderById(orderId).subscribe((data: Order) => {
      this.order = data;
    });
  }

  changeStatus(status: 'Pending' | 'Completed' | 'Canceled'): void {
    if (this.order && this.order.id) {
      if (status === 'Completed') {
        let insufficientStock = false;

        this.order.products.forEach((product) => {
          const idProdutStrig = product.id.toString();
          this.ordersService
            .getProductById(idProdutStrig)
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
