import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { NurseProfileService } from '../services/nurse-profile.service';
import { successResponse } from '../utils/response.util';

const nurseProfileService = new NurseProfileService();

export class NurseProfileController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await nurseProfileService.getProfile(req.user!.id);
      res.json(successResponse('Profil berhasil diambil', profile));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await nurseProfileService.updateProfile(req.user!.id, req.body);
      res.json(successResponse('Profil berhasil diupdate', profile));
    } catch (error) {
      next(error);
    }
  }

  async getProfileCompletion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const completion = await nurseProfileService.getProfileCompletion(req.user!.id);
      res.json(successResponse('Kelengkapan profil berhasil diambil', completion));
    } catch (error) {
      next(error);
    }
  }

  async getCurrentShiftStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const status = await nurseProfileService.getCurrentShiftStatus(req.user!.id);
      res.json(successResponse('Status shift berhasil diambil', status));
    } catch (error) {
      next(error);
    }
  }

  async getAccountStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const status = await nurseProfileService.getAccountStatus(req.user!.id);
      res.json(successResponse('Status akun berhasil diambil', status));
    } catch (error) {
      next(error);
    }
  }

  async getLicenseInfo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const license = await nurseProfileService.getLicenseInfo(req.user!.id);
      res.json(successResponse('Informasi lisensi berhasil diambil', license));
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await nurseProfileService.deleteAccount(req.user!.id);
      res.json(successResponse('Akun berhasil dihapus'));
    } catch (error) {
      next(error);
    }
  }
}