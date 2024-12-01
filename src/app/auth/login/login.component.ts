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
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    this.isLoading = true;

    if (!this.email || !this.password) {
      this.error = 'Email and password are required.';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (isAuthenticated) => {
        this.isLoading = false;
        if (isAuthenticated) {
          const role = this.authService.getRole();
          this.authService.navigateToRole(role);
        } else {
          this.error = 'Invalid email or password.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error during login:', err);
        this.error = 'Invalid email or password.';
      },
    });
  }
}
