import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    // Mock do AuthService
    authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(false), 
      getRole: jasmine.createSpy('getRole')
    };

    // Mock do Router
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        FormsModule, 
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not call AuthService login if email or password is empty', () => {
    component.email = '';
    component.password = '';
    component.onSubmit();

    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call AuthService login with valid credentials', () => {
    component.email = 'admin@test.com';
    component.password = '1234';
    authServiceMock.login.and.returnValue(true); // Simula login bem-sucedido

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith('admin@test.com', '1234');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set error message with invalid credentials', () => {
    component.email = 'admin@test.com';
    component.password = 'wrongpassword';
    authServiceMock.login.and.returnValue(false); 

    component.onSubmit();

    expect(component.error).toBe('Credenciais inválidas');
  });

  it('should display error message in the template', () => {
    component.error = 'Credenciais inválidas';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.text-red-500')?.textContent).toContain('Credenciais inválidas');
  });
});