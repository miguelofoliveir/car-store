import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/products/product.model';
import { StockService } from '../stock.service';
import { StockModalComponent } from '../stock-modal/stock-modal.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  filters = {
    name: '',
    lowStockThreshold: null as number | null,
  };
  isLoading: boolean = false;

  constructor(private stockService: StockService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.stockService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.filteredProducts = products;
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesName = this.filters.name
        ? product.name.toLowerCase().includes(this.filters.name.toLowerCase())
        : true;

      const matchesLowStock =
        this.filters.lowStockThreshold !== null
          ? product.quantity <= this.filters.lowStockThreshold
          : true;

      return matchesName && matchesLowStock;
    });
  }

  openStockModal(product: Product): void {
    const dialogRef = this.dialog.open(StockModalComponent, {
      data: product,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
      }
    });
  }
}
