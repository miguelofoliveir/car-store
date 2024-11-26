import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'create', component: FormComponent },
  { path: 'details/:id', component: DetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
