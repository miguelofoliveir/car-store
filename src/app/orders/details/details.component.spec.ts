import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../orders.service';
import { DetailsComponent } from './details.component';
import { of } from 'rxjs';
import { Order } from '../order.model';
import { Product } from '../../products/product.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let mockOrdersService: jasmine.SpyObj<OrdersService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => (key === 'id' ? '123' : null),
      },
    },
  } as ActivatedRoute;

  beforeEach(async () => {
    mockOrdersService = jasmine.createSpyObj('OrdersService', [
      'getOrderById',
      'getProductById',
      'updateProductStock',
      'updateOrderStatus',
    ]);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatIconModule,
      ],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  });

  it('should fetch order on init', () => {
    const mockOrder: Order = {
      id: '123',
      clientId: 'John Doe',
      products: [
        {
          id: '1',
          name: 'Product 1',
          brand: 'Brand A',
          price: 100,
          description: 'Description of Product 1',
          category: 'Category A',
          image: 'https://example.com/product1.jpg',
          quantity: 2,
        },
      ],
      date: '2024-11-26',
      status: 'Pending',
    };

    mockOrdersService.getOrderById.and.returnValue(of(mockOrder));

    fixture.detectChanges();

    expect(mockOrdersService.getOrderById).toHaveBeenCalledWith('123');
    expect(component.order).toEqual(mockOrder);
  });

  it('should update order status to Completed and reduce stock', () => {
    const mockOrder: Order = {
      id: '123',
      clientId: 'John Doe',
      products: [
        {
          id: '1',
          name: 'Product 1',
          brand: 'Brand A',
          price: 100,
          description: 'Description of Product 1',
          category: 'Category A',
          image: 'https://example.com/product1.jpg',
          quantity: 2,
        },
      ],
      date: '2024-11-26',
      status: 'Pending',
    };

    const mockProduct: Product = {
      id: '1',
      name: 'Product 1',
      brand: 'Brand A',
      price: 100,
      description: 'Description of Product 1',
      category: 'Category A',
      image: 'https://example.com/product1.jpg',
      quantity: 10,
    };

    mockOrdersService.getOrderById.and.returnValue(of(mockOrder));
    mockOrdersService.getProductById.and.returnValue(of(mockProduct));
    mockOrdersService.updateProductStock.and.returnValue(of(void 0));
    mockOrdersService.updateOrderStatus.and.returnValue(
      of({ ...mockOrder, status: 'Completed' })
    );

    fixture.detectChanges();

    component.changeStatus('Completed');

    expect(mockOrdersService.getProductById).toHaveBeenCalledWith('1');
    expect(mockOrdersService.updateProductStock).toHaveBeenCalledWith('1', 8);
    expect(mockOrdersService.updateOrderStatus).toHaveBeenCalledWith(
      '123',
      'Completed'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/orders']);
  });
});
