import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { DashboardNurseService } from '../services/dashboard-nurse.service';
import { successResponse } from '../utils/response.util';

const dashboardNurseService = new DashboardNurseService();

export class DashboardNurseController {
  async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const summary = await dashboardNurseService.getNurseSummary(req.user!.id);
      res.json(successResponse('Summary berhasil diambil', summary));
    } catch (error) {
      next(error);
    }
  }
}