import { Role } from './role.model';

export interface User {
  _id?: string;
  email: string;
  name?: string;
  role?: Role;
}
