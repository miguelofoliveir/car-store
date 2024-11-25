import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      category: ['', [Validators.required]],
      image: ['']
    });

    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.isEditMode = true;
      this.productsService.getProductById(this.productId).subscribe((product: Product) => {
        this.productForm.patchValue(product);
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData: Product = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productsService.updateProduct(this.productId, productData).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.productsService.addProduct(productData).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}