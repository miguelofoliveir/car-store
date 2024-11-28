import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { StockService } from './stock.service';
import { Product } from '../products/product.model';
import { environment } from 'src/environments/environment';

describe('StockService', () => {
  let service: StockService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StockService],
    });

    service = TestBed.inject(StockService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getProducts', () => {
    it('should fetch a list of products', () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          quantity: 10,
          price: 100,
          brand: 'Brand A',
          category: 'Category A',
          description: '',
          image: '',
        },
        {
          id: '2',
          name: 'Product 2',
          quantity: 5,
          price: 200,
          brand: 'Brand B',
          category: 'Category B',
          description: '',
          image: '',
        },
      ];

      service.getProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('#updateProductQuantity', () => {
    it('should update the quantity of a product', () => {
      const productId = '1';
      const updatedQuantity = 20;
      const updatedProduct: Product = {
        id: productId,
        name: 'Product 1',
        quantity: updatedQuantity,
        price: 100,
        brand: 'Brand A',
        category: 'Category A',
        description: '',
        image: '',
      };

      service
        .updateProductQuantity(productId, updatedQuantity)
        .subscribe((product) => {
          expect(product).toEqual(updatedProduct);
          expect(product.quantity).toBe(updatedQuantity);
        });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ quantity: updatedQuantity });
      req.flush(updatedProduct);
    });
  });
});
