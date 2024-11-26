import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ListComponent } from './list.component';
import { StockService } from '../stock.service';
import { Product } from 'src/app/products/product.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StockModalComponent } from '../stock-modal/stock-modal.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let stockService: jasmine.SpyObj<StockService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Product 1',
      quantity: 10,
      price: 100,
      brand: 'Brand A',
      category: 'Category A',
      description: '',
      image: '',
    },
    {
      id: 2,
      name: 'Product 2',
      quantity: 5,
      price: 200,
      brand: 'Brand B',
      category: 'Category B',
      description: '',
      image: '',
    },
  ];

  beforeEach(async () => {
    const stockServiceSpy = jasmine.createSpyObj('StockService', [
      'getProducts',
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: StockService, useValue: stockServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    stockService = TestBed.inject(StockService) as jasmine.SpyObj<StockService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    stockService.getProducts.and.returnValue(of(mockProducts));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    component.ngOnInit();
    expect(stockService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
    expect(component.filteredProducts).toEqual(mockProducts);
  });

  it('should filter products by name and quantity', () => {
    component.products = mockProducts;

    component.filters.name = 'Product 1';
    component.applyFilters();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Product 1');

    component.filters.name = '';
    component.filters.lowStockThreshold = 6;
    component.applyFilters();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Product 2');
  });

  it('should open the stock modal and reload products after closing', () => {
    const mockProduct = mockProducts[0];
    const dialogRefSpy = { afterClosed: () => of(true) } as any;
    dialog.open.and.returnValue(dialogRefSpy);

    component.openStockModal(mockProduct);

    expect(dialog.open).toHaveBeenCalledWith(StockModalComponent, {
      data: mockProduct,
    });

    dialogRefSpy.afterClosed().subscribe(() => {
      expect(stockService.getProducts).toHaveBeenCalledTimes(2);
    });
  });

  it('should not reload products if the modal is closed without saving', () => {
    const mockProduct = mockProducts[0];
    const dialogRefSpy = { afterClosed: () => of(false) } as any;
    dialog.open.and.returnValue(dialogRefSpy);

    component.openStockModal(mockProduct);

    expect(dialog.open).toHaveBeenCalledWith(StockModalComponent, {
      data: mockProduct,
    });

    dialogRefSpy.afterClosed().subscribe(() => {
      expect(stockService.getProducts).toHaveBeenCalledTimes(1);
    });
  });
});
