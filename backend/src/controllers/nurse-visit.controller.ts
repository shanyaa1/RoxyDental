import { Request, Response, NextFunction } from 'express';
import nurseVisitService from '../services/nurse-visit.service';

export class NurseVisitController {
  async getVisitByMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { medicalRecordNumber } = req.params;

      const visit = await nurseVisitService.getVisitByMedicalRecord(medicalRecordNumber);

      res.status(200).json({
        success: true,
        message: 'Berhasil mengambil data kunjungan',
        data: visit
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new NurseVisitController();