import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  filters = {
    name: '',
    brand: '',
    category: '',
  };

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private dialog: MatDialog,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.filteredProducts = products;
      this.extractCategories();
    });
  }

  extractCategories(): void {
    const uniqueCategories = new Set(
      this.products.map((product) => product.category)
    );
    this.categories = Array.from(uniqueCategories);
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesName = this.filters.name
        ? product.name.toLowerCase().includes(this.filters.name.toLowerCase())
        : true;
      const matchesBrand = this.filters.brand
        ? product.brand.toLowerCase().includes(this.filters.brand.toLowerCase())
        : true;
      const matchesCategory = this.filters.category
        ? product.category === this.filters.category
        : true;
      return matchesName && matchesBrand && matchesCategory;
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

  onViewDetails(product: Product): void {
    this.dialog.open(ModalComponent, {
      data: {
        component: DetailsComponent, 
        inputs: { product }, 
      },
    });
  }
}
