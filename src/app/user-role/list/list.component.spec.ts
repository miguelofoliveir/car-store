import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { UserRoleService } from '../user-role.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockUserRoleService: jasmine.SpyObj<UserRoleService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockUserRoleService = jasmine.createSpyObj('UserRoleService', [
      'getUsers',
      'deleteUser',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        MatTableModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        FormsModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      providers: [
        { provide: UserRoleService, useValue: mockUserRoleService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    mockUserRoleService.getUsers.and.returnValue(
      of([
        {
          id: '1',
          name: 'Admin',
          email: 'admin@example.com',
          role: 'admin',
          password: 'admin123',
        },
        {
          id: '2',
          name: 'Client',
          email: 'client@example.com',
          role: 'client',
          password: 'client123',
        },
      ])
    );

    spyOn(window, 'confirm').and.returnValue(true);

    fixture.detectChanges();
  });

  it('should create the list component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on initialization', () => {
    expect(mockUserRoleService.getUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });

  it('should delete a user', () => {
    mockUserRoleService.deleteUser.and.returnValue(of());
    component.deleteUser('1');

    component.users = component.users.filter((user) => user.id !== '1');
    fixture.detectChanges();

    expect(mockUserRoleService.deleteUser).toHaveBeenCalledWith('1');
    expect(component.users.length).toBe(1);
  });

  it('should navigate to add user', () => {
    component.addUser();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user-role/create']);
  });
});
