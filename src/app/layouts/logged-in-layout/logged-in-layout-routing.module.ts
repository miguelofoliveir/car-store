import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInLayoutComponent } from './logged-in-layout.component';

const routes: Routes = [
  {
    path: '',
    component: LoggedInLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../../products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'stock',
        loadChildren: () =>
          import('../../stock/stock.module').then((m) => m.StockModule),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('../../orders/orders.module').then((m) => m.OrdersModule),
      },
      {
        path: 'client',
        loadChildren: () =>
          import('../../client/client.module').then((m) => m.ClientModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoggedInLayoutRoutingModule {}
