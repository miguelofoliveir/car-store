import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../../environments/environment';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        MatCardModule,
        MatButtonModule,
        NgxChartsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display total statistics correctly', () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', quantity: 3 },
      { id: '2', name: 'Product 2', quantity: 10 },
    ];
    const mockOrders = [
      { id: '1', status: 'Completed' },
      { id: '2', status: 'Pending' },
    ];
    const mockClients = [{ id: '1', name: 'John Doe' }];

    fixture.detectChanges();

    const reqProducts = httpTestingController.expectOne(
      `${environment.apiUrl}/products`
    );
    reqProducts.flush(mockProducts);

    const reqOrders = httpTestingController.expectOne(
      `${environment.apiUrl}/orders`
    );
    reqOrders.flush(mockOrders);

    const reqClients = httpTestingController.expectOne(
      `${environment.apiUrl}/clients`
    );
    reqClients.flush(mockClients);

    fixture.detectChanges();

    const totalProductsEl = fixture.debugElement.query(
      By.css('#total-products')
    ).nativeElement;
    const totalOrdersEl = fixture.debugElement.query(
      By.css('#total-orders')
    ).nativeElement;
    const totalClientsEl = fixture.debugElement.query(
      By.css('#total-clients')
    ).nativeElement;

    expect(totalProductsEl.textContent).toContain('Produtos: 2');
    expect(totalOrdersEl.textContent).toContain('Pedidos: 2');
    expect(totalClientsEl.textContent).toContain('Clientes: 1');
  });
});
