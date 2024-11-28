import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of(false)),
      getRole: jasmine.createSpy('getRole'),
      navigateToRole: jasmine
        .createSpy('navigateToRole')
        .and.returnValue(of(true)),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
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
    component.email = 'admin@example.com';
    component.password = 'admin123';
    authServiceMock.login.and.returnValue(of(true));

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith(
      'admin@example.com',
      'admin123'
    );
    expect(authServiceMock.navigateToRole).toHaveBeenCalled();
  });

  it('should set error message with invalid credentials', () => {
    component.email = 'admin@example.com';
    component.password = 'wrongpassword';
    authServiceMock.login.and.returnValue(of(false));

    component.onSubmit();

    expect(component.error).toBe('Invalid email or password.');
  });

  it('should display error message in the template', () => {
    component.error = 'Invalid email or password.';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.text-red-500')?.textContent).toContain(
      'Invalid email or password.'
    );
  });
});
