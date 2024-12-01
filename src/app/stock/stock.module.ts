import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StockRoutingModule } from './stock-routing.module';
import { ListComponent } from './list/list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StockModalComponent } from './stock-modal/stock-modal.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ListComponent, StockModalComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    SharedModule,
  ],
})
export class StockModule {}
