export interface UserRole {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'vendor' | 'client';
  password: string;
}
