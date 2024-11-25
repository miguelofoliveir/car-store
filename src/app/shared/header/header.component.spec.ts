import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule } from '@angular/material/button';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule, MatButtonModule],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render logo with correct link', () => {
    const logoElement = fixture.debugElement.query(
      By.css('a[href="https://www.amxhealthcare.com"]')
    );
    expect(logoElement).toBeTruthy();
    const imgElement = logoElement.query(By.css('img'));
    expect(imgElement.attributes['alt']).toContain('AMX Healthcare Logo');
  });

  it('should render navigation links', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('nav a'));
    expect(navLinks.length).toBe(4);
    expect(navLinks[0].nativeElement.textContent).toContain('Dashboard');
    expect(navLinks[1].nativeElement.textContent).toContain('Products');
    expect(navLinks[2].nativeElement.textContent).toContain('Orders');
    expect(navLinks[3].nativeElement.textContent).toContain('Clients');
  });

  it('should render logout button in desktop view', () => {
    const logoutButton = fixture.debugElement.query(By.css('button'));
    expect(logoutButton).toBeTruthy();
    expect(logoutButton.nativeElement.textContent).toContain('Logout');
  });

  it('should toggle mobile menu visibility', () => {
    component.isMenuOpen = false;
    fixture.detectChanges();
    let mobileMenu = fixture.debugElement.query(By.css('.mobile-menu'));
    expect(mobileMenu).toBeFalsy();

    component.isMenuOpen = true;
    fixture.detectChanges();
    mobileMenu = fixture.debugElement.query(By.css('.mobile-menu'));
    expect(mobileMenu).toBeTruthy();
  });

  it('should render logout button inside mobile menu', () => {
    component.isMenuOpen = true;
    fixture.detectChanges();
    const mobileLogoutButton = fixture.debugElement.query(
      By.css('.mobile-menu button')
    );
    expect(mobileLogoutButton).toBeTruthy();
    expect(mobileLogoutButton.nativeElement.textContent).toContain('Logout');
  });
});
