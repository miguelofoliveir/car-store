import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrdersService } from '../orders.service';
import { FormComponent } from './form.component';
import { of } from 'rxjs';
import { Order } from '../order.model';
import { Product } from 'src/app/products/product.model';
import { Client } from 'src/app/client/client.model';

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
      declarations: [FormComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should load products and clients on init', () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', quantity: 10 },
    ] as Product[];
    const mockClients = [{ id: '1', name: 'John Doe' }] as Client[];

    mockOrdersService.getProducts.and.returnValue(of(mockProducts));
    mockOrdersService.getClients.and.returnValue(of(mockClients));

    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.products).toEqual(mockProducts);
    expect(component.clients).toEqual(mockClients);
    expect(mockOrdersService.getProducts).toHaveBeenCalled();
    expect(mockOrdersService.getClients).toHaveBeenCalled();
  });

  it('should call createOrder on save', () => {
    const mockOrder = {
      client: 'John Doe',
      products: [{ id: '1', name: 'Product 1', quantity: 1 }],
      date: '2024-11-26',
      status: 'Pending',
    } as Order;

    mockOrdersService.createOrder.and.returnValue(of(mockOrder));

    component.orderForm.setValue({
      clientId: '1',
      productId: '1',
      quantity: 1,
      status: 'Pending',
    });

    component.onSave();

    expect(mockOrdersService.createOrder).toHaveBeenCalled();
  });
});
