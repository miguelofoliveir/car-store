import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoggedInLayoutComponent } from './layouts/logged-in-layout/logged-in-layout.component';
import { AccessDeniedComponent } from './auth/access-denied/access-denied.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./layouts/logged-in-layout/logged-in-layout.module').then(
        (m) => m.LoggedInLayoutModule
      ),
  },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
