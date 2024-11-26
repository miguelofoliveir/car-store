import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersService } from '../orders.service';
import { Product } from '../../products/product.model';
import { Order } from '../order.model';
import { Client } from 'src/app/client/client.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  orderForm: FormGroup;
  products: Product[] = [];
  clients: Client[] = [];

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      clientId: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: ['Pending', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadClients();
  }

  loadProducts(): void {
    this.ordersService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  loadClients(): void {
    this.ordersService.getClients().subscribe((data: Client[]) => {
      this.clients = data;
    });
  }

  onSave(): void {
    if (this.orderForm.valid) {
      const { clientId, productId, quantity, status } = this.orderForm.value;
      const selectedClient = this.clients.find(
        (client) => client.id === clientId
      );

      const selectedProduct = this.products.find(
        (product) => product.id === productId
      );

      if (selectedClient && selectedProduct) {
        const newOrder: Order = {
          client: selectedClient.name,
          products: [
            {
              ...selectedProduct,
              quantity,
            },
          ],
          date: new Date().toISOString().split('T')[0],
          status,
        };

        if (status === 'Completed') {
          const currentStock = selectedProduct.quantity;
          const newStock = currentStock - quantity;

          if (newStock < 0) {
            alert(`Insufficient stock for product: ${selectedProduct.name}`);
            return;
          } else {
            this.ordersService
              .updateProductStock(selectedProduct.id.toString(), newStock)
              .subscribe({
                next: () => {
                  console.log(
                    `Stock updated for product: ${selectedProduct.name}`
                  );
                  this.createOrder(newOrder);
                },
                error: (err) => console.error(`Error updating stock: ${err}`),
              });
          }
        } else {
          this.createOrder(newOrder);
        }
      }
    }
  }

  createOrder(order: Order): void {
    this.ordersService.createOrder(order).subscribe(() => {
      console.log('Order created successfully!');
      this.router.navigate(['/orders']);
    });
  }

  onCancel(): void {
    this.router.navigate(['/orders']);
  }
}
