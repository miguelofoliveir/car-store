import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { OrdersService } from './orders.service';
import { Order } from './order.model';
import { environment } from 'src/environments/environment';

describe('OrdersService', () => {
  let service: OrdersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrdersService],
    });
    service = TestBed.inject(OrdersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an order', () => {
    const mockOrder: Order = {
      clientId: 'John Doe',
      products: [
        {
          id: '1',
          name: 'Product 1',
          brand: 'Brand A',
          price: 100,
          description: '',
          category: '',
          image: '',
          quantity: 2,
        },
      ],
      date: '2024-11-26',
      status: 'Pending',
    };

    service.createOrder(mockOrder).subscribe((order) => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/orders`);
    expect(req.request.method).toBe('POST');
    req.flush(mockOrder);
  });

  it('should update product stock', () => {
    const productId = '1';
    const newQuantity = 10;

    service.updateProductStock(productId, newQuantity).subscribe(() => {
      expect(true).toBeTrue();
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/products/${productId}`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ quantity: newQuantity });
    req.flush({});
  });

  it('should update order status', () => {
    const orderId = '1';
    const newStatus = 'Completed';

    service.updateOrderStatus(orderId, newStatus).subscribe(() => {
      expect(true).toBeTrue();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/orders/${orderId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: newStatus });
    req.flush({});
  });
});
