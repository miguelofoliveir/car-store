import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Email and password are required.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (isAuthenticated) => {
        if (isAuthenticated) {
          const role = this.authService.getRole();
          this.authService.navigateToRole(role);
        } else {
          this.error = 'Invalid email or password.';
        }
      },
      error: (err) => {
        console.error('Error during login:', err);
        this.error = 'Invalid email or password.';
      },
    });
  }
}
