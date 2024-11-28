import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { ListComponent } from './list.component';
import { OrdersService } from '../orders.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Order } from '../order.model';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockOrdersService: jasmine.SpyObj<OrdersService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockOrdersService = jasmine.createSpyObj('OrdersService', ['getOrders']);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getRole',
      'getUser',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        BrowserAnimationsModule,
        FormsModule,
      ],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch orders on init for admin', () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        clientId: 'John Doe',
        date: '2024-11-26',
        status: 'Pending',
        products: [],
      },
      {
        id: '2',
        clientId: 'Jane Smith',
        date: '2024-11-27',
        status: 'Completed',
        products: [],
      },
    ];

    mockAuthService.getRole.and.returnValue('admin');
    mockOrdersService.getOrders.and.returnValue(of(mockOrders));

    fixture.detectChanges();
    expect(mockOrdersService.getOrders).toHaveBeenCalled();
    expect(component.orders).toEqual(mockOrders);
    expect(component.filteredOrders).toEqual(mockOrders);
  });

  it('should filter orders by status', () => {
    component.orders = [
      {
        id: '1',
        clientId: 'John Doe',
        date: '2024-11-26',
        status: 'Pending',
        products: [],
      },
      {
        id: '2',
        clientId: 'Jane Smith',
        date: '2024-11-27',
        status: 'Completed',
        products: [],
      },
    ];

    component.filters.status = 'Pending';
    component.applyFilters();

    expect(component.filteredOrders).toEqual([
      {
        id: '1',
        clientId: 'John Doe',
        date: '2024-11-26',
        status: 'Pending',
        products: [],
      },
    ]);
  });

  it('should navigate to order details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.viewDetails('1');
    expect(routerSpy).toHaveBeenCalledWith(['/orders/details', '1']);
  });
});
