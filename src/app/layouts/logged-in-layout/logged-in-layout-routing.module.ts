import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInLayoutComponent } from './logged-in-layout.component';
import { authGuard } from 'src/app/auth/auth.guard';

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
        data: { roles: ['admin'] },
        canActivate: [authGuard],
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../../products/products.module').then(
            (m) => m.ProductsModule
          ),
        data: { roles: ['admin', 'seller'] },
        canActivate: [authGuard],
      },
      {
        path: 'stock',
        loadChildren: () =>
          import('../../stock/stock.module').then((m) => m.StockModule),
        data: { roles: ['admin'] },
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('../../orders/orders.module').then((m) => m.OrdersModule),
        data: { roles: ['admin', 'seller', 'client'] },
        canActivate: [authGuard],
      },
      {
        path: 'client',
        loadChildren: () =>
          import('../../client/client.module').then((m) => m.ClientModule),
        data: { roles: ['admin', 'seller'] },
        canActivate: [authGuard],
      },
      {
        path: 'user-role',
        loadChildren: () =>
          import('../../user-role/user-role.module').then(
            (m) => m.UserRoleModule
          ),
        data: { roles: ['admin'] },
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoggedInLayoutRoutingModule {}
