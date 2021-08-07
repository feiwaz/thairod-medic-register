
export interface User {
  id?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
  createdById?: string;
}
