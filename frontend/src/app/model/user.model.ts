
export interface User {
  _id?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
  createdBy?: string;
}
