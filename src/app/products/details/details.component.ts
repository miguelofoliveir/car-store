import { Component, Inject } from '@angular/core';
import { Product } from '../product.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public product: Product) {}
}
