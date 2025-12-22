import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { UserService } from '../services/user.service';
import { successResponse } from '../utils/response.util';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { role } = req.query;
      const users = await userService.getAllUsers(role as any);
      res.json(successResponse('Daftar user berhasil diambil', users));
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(successResponse('Detail user berhasil diambil', user));
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(successResponse('User berhasil dibuat', user));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(successResponse('User berhasil diupdate', user));
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await userService.deleteUser(req.params.id);
      res.json(successResponse('User berhasil dihapus'));
    } catch (error) {
      next(error);
    }
  }

  async toggleUserStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.toggleUserStatus(req.params.id);
      res.json(successResponse('Status user berhasil diubah', user));
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await userService.getProfile(req.user!.id);
      res.json(successResponse('Profil berhasil diambil', profile));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await userService.updateProfile(req.user!.id, req.body);
      res.json(successResponse('Profil berhasil diupdate', profile));
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await userService.deleteUser(req.user!.id);
      res.json(successResponse('Akun berhasil dihapus'));
    } catch (error) {
      next(error);
    }
  }
}