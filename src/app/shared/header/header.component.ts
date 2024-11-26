import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isMenuOpen = false;
  role: string | null = null;

  menuItems = [
    {
      label: 'Dashboard',
      link: '/dashboard',
      roles: ['admin', 'seller', 'client'],
    },
    { label: 'Produts', link: '/products', roles: ['admin', 'seller'] },
    { label: 'Orders', link: '/orders', roles: ['admin', 'seller', 'client'] },
    { label: 'Clients', link: '/client', roles: ['admin', 'seller'] },
    { label: 'Stock', link: '/stock', roles: ['admin', 'seller'] },
    { label: 'Users', link: '/users', roles: ['admin'] },
  ];

  constructor(private router: Router, private authService: AuthService) {
    this.role = this.authService.getRole();
  }

  logout(): void {
    localStorage.clear();
    this.isMenuOpen = false;
    this.router.navigate(['/login']);
  }

  canShow(item: { label: string; link: string; roles: string[] }): boolean {
    return item.roles.includes(this.role || '');
  }
}
