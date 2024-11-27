import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole } from './user-role.model';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  private apiUrl = 'http://localhost:3000/users'; 

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<UserRole> {
    return this.http.get<UserRole>(`${this.apiUrl}/${id}`);
  }

  createUser(user: UserRole): Observable<UserRole> {
    return this.http.post<UserRole>(this.apiUrl, user);
  }

  updateUser(id: string, user: UserRole): Observable<UserRole> {
    return this.http.put<UserRole>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
