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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoggedInLayoutRoutingModule {}
