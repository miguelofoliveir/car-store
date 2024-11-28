import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { OrdersService } from '../orders.service';
import { FormComponent } from './form.component';
import { of } from 'rxjs';
import { Product } from '../../products/product.model';
import { Client } from '../../client/client.model';
@Component({ template: '' })
class DummyComponent {}

const routes: Routes = [{ path: 'orders', component: DummyComponent }];

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockOrdersService: jasmine.SpyObj<OrdersService>;

  beforeEach(async () => {
    mockOrdersService = jasmine.createSpyObj('OrdersService', [
      'getProducts',
      'getClients',
      'createOrder',
      'updateProductStock',
    ]);

    await TestBed.configureTestingModule({
      declarations: [FormComponent, DummyComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should load products and clients on init', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Product 1',
        brand: 'Brand A',
        price: 100,
        description: 'Product 1 description',
        category: 'Category A',
        image: 'image1.jpg',
        quantity: 10,
      },
    ];

    const mockClients: Client[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        address: '123 Main St, City, Country',
      },
    ];

    mockOrdersService.getProducts.and.returnValue(of(mockProducts));
    mockOrdersService.getClients.and.returnValue(of(mockClients));

    fixture.detectChanges();

    expect(component.products).toEqual(mockProducts);
    expect(component.clients).toEqual(mockClients);
    expect(mockOrdersService.getProducts).toHaveBeenCalled();
    expect(mockOrdersService.getClients).toHaveBeenCalled();
  });

  it('should call createOrder on save', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Product 1',
      brand: 'Brand A',
      price: 100,
      description: 'Product 1 description',
      category: 'Category A',
      image: 'image1.jpg',
      quantity: 10,
    };

    const mockClient: Client = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      address: '123 Main St, City, Country',
    };

    const mockOrder = {
      clientId: mockClient.name,
      products: [
        {
          ...mockProduct,
          quantity: 1,
        },
      ],
      date: new Date().toISOString().split('T')[0],
      status: 'Pending' as 'Pending',
    };

    mockOrdersService.getProducts.and.returnValue(of([mockProduct]));
    mockOrdersService.getClients.and.returnValue(of([mockClient]));
    mockOrdersService.createOrder.and.returnValue(of(mockOrder));

    fixture.detectChanges();

    component.orderForm.setValue({
      clientId: mockClient.id,
      productId: mockProduct.id,
      quantity: 1,
      status: 'Pending',
    });

    component.onSave();

    expect(mockOrdersService.createOrder).toHaveBeenCalledWith(
      jasmine.objectContaining({
        clientId: mockClient.name,
        products: [
          jasmine.objectContaining({
            id: mockProduct.id,
            quantity: 1,
          }),
        ],
        status: 'Pending',
      })
    );
  });

  it('should not submit the form if it is invalid', () => {
    component.orderForm.setValue({
      clientId: '',
      productId: '',
      quantity: 0,
      status: 'Pending',
    });

    component.onSave();

    expect(mockOrdersService.createOrder).not.toHaveBeenCalled();
  });

  it('should navigate to orders on cancel', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.onCancel();
    expect(routerSpy).toHaveBeenCalledWith(['/orders']);
  });
});
