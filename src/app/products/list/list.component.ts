import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { MatDialog } from '@angular/material/dialog';
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
  displayedColumns: string[] = [
    'name',
    'brand',
    'price',
    'description',
    'category',
    'image',
    'actions',
  ];
  filters = {
    name: '',
    brand: '',
    category: '',
  };
  isLoading: boolean = false;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productsService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filteredProducts = products;
        this.extractCategories();
      },
      complete: () => (this.isLoading = false),
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
    this.isLoading = true;
    this.router.navigate(['/products/edit', productId]).then(() => {
      this.isLoading = false;
    });
  }

  onDelete(productId: number): void {
    this.isLoading = true;
    this.productsService.deleteProduct(productId).subscribe({
      next: () => this.loadProducts(),
      complete: () => (this.isLoading = false),
    });
  }

  onAdd(): void {
    this.isLoading = true;
    this.router.navigate(['/products/add']).then(() => {
      this.isLoading = false;
    });
  }

  onViewDetails(product: Product): void {
    this.isLoading = true;
    this.dialog.open(DetailsComponent, {
      data: product,
    });
    this.isLoading = false;
  }
}
