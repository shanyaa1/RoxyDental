import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { TreatmentService } from '../services/treatment.service';
import { successResponse } from '../utils/response.util';

const treatmentService = new TreatmentService();

export class TreatmentController {
  async getTreatments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { patientId, startDate, endDate, page, limit, search } = req.query;
      const result = await treatmentService.getTreatments(
        req.user!.id,
        patientId as string,
        startDate as string,
        endDate as string,
        Number(page) || 1,
        Number(limit) || 10,
        search as string
      );
      res.json(successResponse('Daftar treatment berhasil diambil', result));
    } catch (error) {
      next(error);
    }
  }

  async getTreatmentById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const treatment = await treatmentService.getTreatmentById(req.params.id);
      res.json(successResponse('Detail treatment berhasil diambil', treatment));
    } catch (error) {
      next(error);
    }
  }

  async getTreatmentsByVisit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const treatments = await treatmentService.getTreatmentsByVisit(req.params.visitId);
      res.json(successResponse('Daftar treatment berhasil diambil', treatments));
    } catch (error) {
      next(error);
    }
  }

  async createTreatment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const treatment = await treatmentService.createTreatment(req.body, req.user!.id);
      res.status(201).json(successResponse('Treatment berhasil ditambahkan', treatment));
    } catch (error) {
      next(error);
    }
  }

  async updateTreatment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const treatment = await treatmentService.updateTreatment(
        req.params.id,
        req.body,
        req.user!.id
      );
      res.json(successResponse('Treatment berhasil diupdate', treatment));
    } catch (error) {
      next(error);
    }
  }

  async deleteTreatment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await treatmentService.deleteTreatment(req.params.id, req.user!.id);
      res.json(successResponse('Treatment berhasil dihapus'));
    } catch (error) {
      next(error);
    }
  }

  async uploadImages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      const imageUrls = files.map(file => `/uploads/treatments/${file.filename}`);
      res.json(successResponse('Gambar berhasil diupload', { images: imageUrls }));
    } catch (error) {
      next(error);
    }
  }

  async getVisitWithTreatments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await treatmentService.getVisitWithTreatments(req.params.visitId);
      res.json(successResponse('Data kunjungan berhasil diambil', data));
    } catch (error) {
      next(error);
    }
  }
}