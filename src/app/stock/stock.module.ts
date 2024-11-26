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
import { StockComponent } from './stock.component';
import { ListComponent } from './list/list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StockModalComponent } from './stock-modal/stock-modal.component';

@NgModule({
  declarations: [StockComponent, ListComponent, StockModalComponent],
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
  ],
})
export class StockModule {}
