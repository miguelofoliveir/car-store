import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ClientService } from './client.service';
import { Client } from './client.model';
import { environment } from '../../environments/environment';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  const mockClient: Client = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(99) 99999-9999',
    address: '123 Main St',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService],
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all clients', () => {
    service.getClients().subscribe((clients) => {
      expect(clients.length).toBe(1);
      expect(clients[0]).toEqual(mockClient);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clients`);
    expect(req.request.method).toBe('GET');
    req.flush([mockClient]);
  });

  it('should fetch a client by ID', () => {
    service.getClientById('1').subscribe((client) => {
      expect(client).toEqual(mockClient);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clients/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockClient);
  });

  it('should create a new client', () => {
    service.createClient(mockClient).subscribe((client) => {
      expect(client).toEqual(mockClient);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clients`);
    expect(req.request.method).toBe('POST');
    req.flush(mockClient);
  });

  it('should update an existing client', () => {
    service.updateClient('1', mockClient).subscribe((client) => {
      expect(client).toEqual(mockClient);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clients/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockClient);
  });

  it('should delete a client', () => {
    service.deleteClient('1').subscribe(() => {
      expect(true).toBeTrue();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clients/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
