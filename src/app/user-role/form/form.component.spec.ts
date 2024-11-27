import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormComponent } from './form.component';
import { UserRoleService } from '../user-role.service';
import { UserRole } from '../user-role.model';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockUserRoleService: jasmine.SpyObj<UserRoleService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockUserRoleService = jasmine.createSpyObj('UserRoleService', [
      'getUserById',
      'createUser',
      'updateUser',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null),
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
      ],
      providers: [
        { provide: UserRoleService, useValue: mockUserRoleService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.userForm.value).toEqual({
      name: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
    });
  });

  it('should call createUser on save when in create mode', () => {
    const mockUser: UserRole = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'client',
      password: 'password123',
    };

    component.userForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'client',
      password: 'password123',
      confirmPassword: 'password123',
    });

    mockUserRoleService.createUser.and.returnValue(of(mockUser));
    component.onSave();

    expect(mockUserRoleService.createUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'client',
      password: 'password123',
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user-role']);
  });

  it('should call updateUser on save when in edit mode', () => {
    const mockUser: UserRole = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'client',
      password: 'password123',
    };
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
    component.isEditMode = true;

    component.userForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'client',
      password: 'password123',
      confirmPassword: 'password123',
    });

    mockUserRoleService.updateUser.and.returnValue(of(mockUser));
    component.onSave();

    expect(mockUserRoleService.updateUser).toHaveBeenCalledWith('1', {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'client',
      password: 'password123',
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user-role']);
  });
});
