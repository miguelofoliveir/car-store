import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  onEdit(productId: number): void {
    this.router.navigate(['/products/edit', productId]);
  }

  onDelete(productId: number): void {
    this.productsService.deleteProduct(productId).subscribe(() => {
      this.loadProducts();
    });
  }

  onAdd(): void {
    this.router.navigate(['/products/add']);
  }
}
