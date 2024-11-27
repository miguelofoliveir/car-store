import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (authService.isAuthenticated()) {
    if (!requiredRoles || authService.hasRole(requiredRoles)) {
      return true;
    } else {
      router.navigate(['/access-denied']);
      return false;
    }
  }

  router.navigate(['/login']);
  return false;
};
