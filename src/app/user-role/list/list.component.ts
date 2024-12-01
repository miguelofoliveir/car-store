import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRoleService } from '../user-role.service';
import { UserRole } from '../user-role.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  users: UserRole[] = [];
  filteredUsers: UserRole[] = [];
  filters = { role: '' };
  isLoading: boolean = false;

  constructor(
    private userRoleService: UserRoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userRoleService.getUsers().subscribe((data: UserRole[]) => {
      this.users = data;
      this.filteredUsers = [...this.users];
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter((user) =>
      this.filters.role ? user.role === this.filters.role : true
    );
  }

  addUser(): void {
    this.isLoading = true;
    this.router.navigate(['/user-role/create']);
    this.isLoading = false;
  }

  editUser(userId: string): void {
    this.isLoading = true;
    this.router.navigate([`/user-role/edit/${userId}`]);
    this.isLoading = false;
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isLoading = true;
      this.userRoleService.deleteUser(userId).subscribe(() => {
        this.users = this.users.filter((user) => user.id !== userId);
        this.applyFilters();
        this.isLoading = false;
      });
    }
  }
}
