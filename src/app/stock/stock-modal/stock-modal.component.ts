import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StockService } from '../stock.service';
import { Product } from 'src/app/products/product.model';

@Component({
  selector: 'app-stock-modal',
  templateUrl: './stock-modal.component.html',
  styleUrls: ['./stock-modal.component.scss'],
})
export class StockModalComponent {
  stockForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private dialogRef: MatDialogRef<StockModalComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) {
    this.stockForm = this.fb.group({
      quantity: [product.quantity, [Validators.required, Validators.min(0)]],
    });
  }

  onSave(): void {
    this.isLoading = true;
    if (this.stockForm.invalid) {
      return;
    }

    const updatedQuantity = this.stockForm.value.quantity;

    this.stockService
      .updateProductQuantity(this.product.id!, updatedQuantity)
      .subscribe(() => {
        this.dialogRef.close(true);
      });
    this.isLoading = false;
  }

  onCancel(): void {
    this.isLoading = true;
    this.dialogRef.close(false);
    this.isLoading = false;
  }
}
