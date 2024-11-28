import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getRole']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule, MatButtonModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo with the correct attributes', () => {
    const logoElement = fixture.debugElement.query(By.css('a'));
    expect(logoElement).toBeTruthy();
    const imgElement = logoElement.query(By.css('img'));
    expect(imgElement).toBeTruthy();
    expect(imgElement.attributes['alt']).toContain('AMX Healthcare Logo');
  });


  it('should call logout and navigate to login', () => {
    const logoutButton = fixture.debugElement.query(
      By.css('button[color="warn"]')
    );
    expect(logoutButton).toBeTruthy();

    logoutButton.nativeElement.click();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(localStorage.length).toBe(0);
  });
});
