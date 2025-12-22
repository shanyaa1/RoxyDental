import { Request } from 'express';
import { UserRole } from '../../generated/prisma';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AuthRequest extends Omit<Request, 'user'> {
  user: AuthUser;
}