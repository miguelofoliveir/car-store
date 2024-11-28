import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ClientService } from '../client.service';
import { ListComponent } from './list.component';
import { Client } from '../client.model';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockClientService: jasmine.SpyObj<ClientService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockClients: Client[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(99) 99999-9999',
      address: '123 Main St',
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '(88) 88888-8888',
      address: '456 Main St',
    },
  ];

  beforeEach(async () => {
    mockClientService = jasmine.createSpyObj('ClientService', [
      'getClients',
      'deleteClient',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        MatTableModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ClientService, useValue: mockClientService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    mockClientService.getClients.and.returnValue(of(mockClients));
    fixture.detectChanges();
  });

  it('should load clients on init', () => {
    expect(component.clients).toEqual(mockClients);
    expect(component.filteredClients).toEqual(mockClients);
  });

  it('should filter clients by name and email', () => {
    component.filters.name = 'Jane';
    component.applyFilters();
    expect(component.filteredClients).toEqual([mockClients[1]]);
  });

  it('should navigate to edit page on edit action', () => {
    component.editClient('1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/edit', '1']);
  });

  it('should delete a client and refresh the list if confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    mockClientService.deleteClient.and.returnValue(of(void 0));
    component.deleteClient('1');

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this client?'
    );
    expect(mockClientService.deleteClient).toHaveBeenCalledWith('1');
    expect(component.clients.length).toBe(1);
  });

  it('should not delete a client if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteClient('1');

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this client?'
    );
    expect(mockClientService.deleteClient).not.toHaveBeenCalled();
  });
});
