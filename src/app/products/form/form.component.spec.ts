import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsService } from '../products.service';
import { FormComponent } from './form.component';
import { Product } from '../product.model';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getProductById',
      'addProduct',
      'updateProduct',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    productsServiceSpy = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      description: 'Test Description',
      category: 'Test Category',
      image: 'http://example.com/image.jpg',
      quantity: 4,
    };
    productsServiceSpy.getProductById.and.returnValue(of(mockProduct));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the form with product data when in edit mode', () => {
    component.isEditMode = true;
    component.ngOnInit();

    expect(component.productForm.value).toEqual({
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      description: 'Test Description',
      category: 'Test Category',
      image: 'http://example.com/image.jpg',
      quantity: 4,
    });
  });

  it('should navigate back on cancel', () => {
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should call addProduct when submitting a new product', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      description: 'Test Description',
      category: 'Test Category',
      image: 'http://example.com/image.jpg',
      quantity: 4,
    };

    component.isEditMode = false;
    component.productForm.setValue({
      name: mockProduct.name,
      brand: mockProduct.brand,
      price: mockProduct.price,
      description: mockProduct.description,
      category: mockProduct.category,
      image: mockProduct.image,
      quantity: mockProduct.quantity,
    });

    productsServiceSpy.addProduct.and.returnValue(of(mockProduct));
    component.onSubmit();

    expect(productsServiceSpy.addProduct).toHaveBeenCalledWith(
      jasmine.objectContaining({
        name: mockProduct.name,
        brand: mockProduct.brand,
        price: mockProduct.price,
        description: mockProduct.description,
        category: mockProduct.category,
        image: mockProduct.image,
        quantity: mockProduct.quantity,
      })
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should call updateProduct when editing an existing product', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      description: 'Test Description',
      category: 'Test Category',
      image: 'http://example.com/image.jpg',
      quantity: 4,
    };

    component.isEditMode = true;
    component.productId = '1';
    component.productForm.setValue({
      name: mockProduct.name,
      brand: mockProduct.brand,
      price: mockProduct.price,
      description: mockProduct.description,
      category: mockProduct.category,
      image: mockProduct.image,
      quantity: mockProduct.quantity,
    });

    productsServiceSpy.updateProduct.and.returnValue(of(mockProduct));
    component.onSubmit();

    expect(productsServiceSpy.updateProduct).toHaveBeenCalledWith(
      '1',
      jasmine.objectContaining({
        name: mockProduct.name,
        brand: mockProduct.brand,
        price: mockProduct.price,
        description: mockProduct.description,
        category: mockProduct.category,
        image: mockProduct.image,
        quantity: mockProduct.quantity,
      })
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should not submit the form if it is invalid', () => {
    component.productForm.setValue({
      name: '',
      brand: '',
      price: 0,
      description: '',
      category: '',
      image: '',
      quantity: 0,
    });

    component.onSubmit();

    expect(productsServiceSpy.addProduct).not.toHaveBeenCalled();
    expect(productsServiceSpy.updateProduct).not.toHaveBeenCalled();
  });
});
