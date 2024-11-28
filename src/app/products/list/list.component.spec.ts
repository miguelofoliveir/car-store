import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { ProductsService } from '../products.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Product } from '../product.model';
import { DetailsComponent } from '../details/details.component';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let productsService: jasmine.SpyObj<ProductsService>;
  let router: jasmine.SpyObj<Router>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product A',
      brand: 'Brand X',
      price: 100,
      description: 'Desc A',
      category: 'Cat A',
      image: '',
      quantity: 4,
    },
    {
      id: '2',
      name: 'Product B',
      brand: 'Brand Y',
      price: 200,
      description: 'Desc B',
      category: 'Cat B',
      image: '',
      quantity: 4,
    },
  ];

  beforeEach(async () => {
    const productsServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getProducts',
      'deleteProduct',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    productsService = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    productsService.getProducts.and.returnValue(of(mockProducts));
    fixture.detectChanges();

    expect(productsService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
    expect(component.filteredProducts).toEqual(mockProducts);
  });

  it('should apply filters correctly', () => {
    component.products = mockProducts;
    component.filters.name = 'Product A';
    component.applyFilters();

    expect(component.filteredProducts).toEqual([mockProducts[0]]);
  });

  it('should navigate to edit product page', () => {
    const productId = 1;
    component.onEdit(productId);

    expect(router.navigate).toHaveBeenCalledWith(['/products/edit', productId]);
  });

  it('should delete a product and reload the list', () => {
    productsService.deleteProduct.and.returnValue(of(undefined));
    spyOn(component, 'loadProducts');

    component.onDelete(1);

    expect(productsService.deleteProduct).toHaveBeenCalledWith(1);
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('should navigate to add product page', () => {
    component.onAdd();

    expect(router.navigate).toHaveBeenCalledWith(['/products/add']);
  });

  it('should open details modal', () => {
    const product = mockProducts[0];

    component.onViewDetails(product);

    expect(dialog.open).toHaveBeenCalledWith(ModalComponent, {
      data: {
        component: DetailsComponent,
        inputs: { product },
      },
    });
  });
});
