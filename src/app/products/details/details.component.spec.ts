import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  const mockProduct = {
    name: 'Test Product',
    brand: 'Test Brand',
    price: 99.99,
    description: 'This is a test product',
    category: 'Test Category',
    image: 'https://portal.euqueroinvestir.com/wp-content/uploads/2024/07/carros-de-luxo-destaque.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { product: mockProduct },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product details', () => {
    const nameElement = fixture.debugElement.query(
      By.css('div:contains("Name:") + span')
    ).nativeElement;
    const brandElement = fixture.debugElement.query(
      By.css('div:contains("Brand:") + span')
    ).nativeElement;
    const priceElement = fixture.debugElement.query(
      By.css('div:contains("Price:") + span')
    ).nativeElement;
    const descriptionElement = fixture.debugElement.query(
      By.css('div:contains("Description:") + p')
    ).nativeElement;
    const categoryElement = fixture.debugElement.query(
      By.css('div:contains("Category:") + span')
    ).nativeElement;

    expect(nameElement.textContent.trim()).toBe(mockProduct.name);
    expect(brandElement.textContent.trim()).toBe(mockProduct.brand);
    expect(priceElement.textContent.trim()).toBe(
      mockProduct.price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    );
    expect(descriptionElement.textContent.trim()).toBe(mockProduct.description);
    expect(categoryElement.textContent.trim()).toBe(mockProduct.category);
  });

  it('should display the product image if available', () => {
    const imageElement = fixture.debugElement.query(
      By.css('img')
    ).nativeElement;
    expect(imageElement).toBeTruthy();
    expect(imageElement.src).toBe(mockProduct.image);
  });

  it('should not display an image if not available', () => {
    component.product.image = null;
    fixture.detectChanges();
    const imageElement = fixture.debugElement.query(By.css('img'));
    expect(imageElement).toBeNull();
  });
});