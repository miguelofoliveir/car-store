import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<boolean> {
    console.log('Current API URL:', environment.apiUrl);
console.log('Production Mode:', environment.production);
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  getRole(): string | null {
    const user = this.getUser();
    console.log('User role:', user ? user.role : null);
    return user?.role || null;
  }

  hasRole(requiredRoles: string[]): boolean {
    const role = this.getRole();
    return requiredRoles.includes(role || '');
  }

  navigateToRole(role: string | null): void {
    console.log('Navigating to role:', role);
    const roleRoutes: { [key: string]: string } = {
      admin: '/dashboard',
      seller: '/products',
      client: '/orders',
    };

    if (role && roleRoutes[role.toLowerCase()]) {
      console.log(`Navigating to: ${roleRoutes[role.toLowerCase()]}`);
      this.router
        .navigate([roleRoutes[role.toLowerCase()]])
        .catch((err) => console.error('Navigation error:', err));
    } else {
      console.error(`No route defined for this role: ${role}`);
      this.router.navigate(['/access-denied']);
    }
  }
}
