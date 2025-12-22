import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/response.util';

const authService = new AuthService();

export class AuthController {
  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json(successResponse('Login berhasil', result));
    } catch (error) {
      next(error);
    }
  }

  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(successResponse('Registrasi berhasil', result));
    } catch (error) {
      next(error);
    }
  }

  async registerDoctor(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.registerDoctor(req.body);
      res.status(201).json(successResponse('Registrasi dokter berhasil', result));
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await authService.forgotPassword(req.body.email);
      res.json(successResponse('Link reset password telah dikirim ke email Anda'));
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, token, newPassword } = req.body;
      await authService.resetPassword(email, token, newPassword);
      res.json(successResponse('Password berhasil direset'));
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await authService.changePassword(req.user!.id, req.body);
      res.json(successResponse('Password berhasil diubah'));
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getCurrentUser(req.user!.id);
      res.json(successResponse('Data user berhasil diambil', user));
    } catch (error) {
      next(error);
    }
  }
}