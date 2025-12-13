import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { DashboardService } from '../services/dashboard.service';
import { successResponse } from '../utils/response.util';

const dashboardService = new DashboardService();

export class DashboardController {
  async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const summary = await dashboardService.getDoctorSummary(req.user!.id);
      res.json(successResponse('Summary berhasil diambil', summary));
    } catch (error) {
      next(error);
    }
  }
}
