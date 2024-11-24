import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: any = null;

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    const mockUsers = [
      { email: 'admin@test.com', password: '1234', role: 'admin' },
      { email: 'seller@test.com', password: '1234', role: 'seller' },
      { email: 'client@test.com', password: '1234', role: 'client' },
    ];

    const user = mockUsers.find((u) => u.email === email && u.password === password);

    if (user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }

    return false;
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  getUser(): any {
    return this.user || JSON.parse(localStorage.getItem('user') || 'null');
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }
}
