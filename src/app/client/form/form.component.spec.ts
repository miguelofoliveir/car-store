import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ClientService } from '../client.service';
import { FormComponent } from './form.component';
import { Client } from '../client.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockClientService: jasmine.SpyObj<ClientService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  const mockClient: Client = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(99) 99999-9999',
    address: '123 Main St',
  };

  beforeEach(async () => {
    mockClientService = jasmine.createSpyObj('ClientService', [
      'getClientById',
      'createClient',
      'updateClient',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.callFake((key: string) => {
            if (key === 'id') {
              return '1';
            }
            return null;
          }),
        },
      } as any,
    };

    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      providers: [
        { provide: ClientService, useValue: mockClientService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    mockClientService.getClientById.and.returnValue(of(mockClient));
    mockClientService.createClient.and.returnValue(of(mockClient));
    mockClientService.updateClient.and.returnValue(of(mockClient));
  });

  it('should initialize form for creation', () => {
    (mockActivatedRoute.snapshot!.paramMap!.get as jasmine.Spy).and.returnValue(
      null
    );
    fixture.detectChanges();
    expect(component.clientForm.value).toEqual({
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
    });
  });

  it('should load client data for editing', () => {
    fixture.detectChanges();
    expect(mockClientService.getClientById).toHaveBeenCalledWith('1');
    expect(component.clientForm.value).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(99) 99999-9999',
      address: '123 Main St',
    });
  });

  it('should save a new client and navigate to list', () => {
    (mockActivatedRoute.snapshot!.paramMap!.get as jasmine.Spy).and.returnValue(
      null
    );
    fixture.detectChanges();

    component.clientForm.setValue({
      id: '',
      name: 'New Client',
      email: 'new@example.com',
      phone: '(11) 11111-1111',
      address: 'New Street, 123',
    });

    component.onSave();

    expect(mockClientService.createClient).toHaveBeenCalledWith({
      id: '',
      name: 'New Client',
      email: 'new@example.com',
      phone: '(11) 11111-1111',
      address: 'New Street, 123',
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client']);
  });

  it('should update an existing client and navigate to list', () => {
    fixture.detectChanges();

    component.clientForm.setValue({
      id: '1',
      name: 'Updated Client',
      email: 'updated@example.com',
      phone: '(22) 22222-2222',
      address: 'Updated Street, 456',
    });

    component.onSave();

    expect(mockClientService.updateClient).toHaveBeenCalledWith('1', {
      id: '1',
      name: 'Updated Client',
      email: 'updated@example.com',
      phone: '(22) 22222-2222',
      address: 'Updated Street, 456',
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client']);
  });

  it('should navigate back on cancel', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client']);
  });
});
