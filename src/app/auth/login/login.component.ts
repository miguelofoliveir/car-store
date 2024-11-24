import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.authService.login(this.email, this.password)) {
      const role = this.authService.getRole();
      this.router.navigate([role === 'admin' ? '/dashboard' : '/']);
    } else {
      this.error = 'Credenciais inválidas';
    }
  }
}
