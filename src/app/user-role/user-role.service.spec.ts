import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserRoleService } from './user-role.service';
import { UserRole } from './user-role.model';

describe('UserRoleService', () => {
  let service: UserRoleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserRoleService],
    });
    service = TestBed.inject(UserRoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users', () => {
    const mockUsers: UserRole[] = [
      {
        id: '1',
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin',
        password: 'admin123',
      },
    ];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should fetch a user by ID', () => {
    const mockUser: UserRole = {
      id: '1',
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      password: 'admin123',
    };

    service.getUserById('1').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:3000/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should create a user', () => {
    const newUser: UserRole = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'client',
      password: 'password123',
    };

    service.createUser(newUser).subscribe((user) => {
      expect(user).toEqual(newUser);
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(newUser);
  });

  it('should update a user', () => {
    const updatedUser: UserRole = {
      id: '1',
      name: 'Updated User',
      email: 'updated@example.com',
      role: 'vendor',
      password: 'updatedpassword123',
    };

    service.updateUser('1', updatedUser).subscribe((user) => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne('http://localhost:3000/users/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });

  it('should delete a user', () => {
    service.deleteUser('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
