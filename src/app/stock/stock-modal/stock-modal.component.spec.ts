import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { StockModalComponent } from './stock-modal.component';
import { StockService } from '../stock.service';
import { Product } from 'src/app/products/product.model';

describe('StockModalComponent', () => {
  let component: StockModalComponent;
  let fixture: ComponentFixture<StockModalComponent>;
  let stockServiceSpy: jasmine.SpyObj<StockService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<StockModalComponent, boolean>>;

  beforeEach(() => {
    const stockServiceMock = jasmine.createSpyObj('StockService', [
      'updateProductQuantity',
    ]);
    const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [StockModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: StockService, useValue: stockServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: 1, name: 'Test Product', quantity: 10 } as Product,
        },
      ],
    });

    fixture = TestBed.createComponent(StockModalComponent);
    component = fixture.componentInstance;
    stockServiceSpy = TestBed.inject(
      StockService
    ) as jasmine.SpyObj<StockService>;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<StockModalComponent, boolean>
    >;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with data from MAT_DIALOG_DATA', () => {
    expect(component.stockForm.value).toEqual({
      quantity: 10,
    });
  });

  it('should mark form as invalid when quantity is missing', () => {
    component.stockForm.setValue({ quantity: null });
    expect(component.stockForm.valid).toBeFalse();
  });

  it('should mark form as invalid when quantity is negative', () => {
    component.stockForm.setValue({ quantity: -5 });
    expect(component.stockForm.valid).toBeFalse();
  });

  it('should call StockService.updateProductQuantity on valid form submission', () => {
    const mockProduct: Product = {
      id: 1,
      name: 'Updated Product',
      quantity: 15,
      brand: 'Test Brand',
      price: 100,
      description: 'Test Description',
      category: 'teste',
      image: 'teste.png',
    };

    stockServiceSpy.updateProductQuantity.and.returnValue(of(mockProduct));

    component.stockForm.setValue({ quantity: 15 });
    component.onSave();

    expect(stockServiceSpy.updateProductQuantity).toHaveBeenCalledWith(1, 15);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should not call StockService.updateProductQuantity if form is invalid', () => {
    component.stockForm.setValue({ quantity: null });
    component.onSave();

    expect(stockServiceSpy.updateProductQuantity).not.toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close the dialog with false on cancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
