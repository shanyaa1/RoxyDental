import { Request, Response, NextFunction } from "express";
import { VisitService } from "../services/visit.service";
import { successResponse } from "../utils/response.util";

export class VisitController {
  private visitService: VisitService;

  constructor() {
    this.visitService = new VisitService();
  }

  getVisits = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as any;
      const search = req.query.search as string;

      const result = await this.visitService.getVisits(page, limit, status, search);
      res.json(successResponse("Daftar kunjungan berhasil diambil", result));
    } catch (error) {
      next(error);
    }
  };

  getVisitById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const visit = await this.visitService.getVisitById(req.params.id);
      res.json(successResponse("Detail kunjungan berhasil diambil", visit));
    } catch (error) {
      next(error);
    }
  };

  getVisitByNumber = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const visit = await this.visitService.getVisitByNumber(req.params.visitNumber);
      res.json(successResponse("Detail kunjungan berhasil diambil", visit));
    } catch (error) {
      next(error);
    }
  };

  getVisitByMedicalRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const visit = await this.visitService.getVisitByMedicalRecord(req.params.medicalRecordNumber);
      res.json(successResponse("Detail kunjungan berhasil diambil", visit));
    } catch (error) {
      next(error);
    }
  };

  createVisit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nurseId = req.user!.id;
      const visit = await this.visitService.createVisit(req.body, nurseId);
      res.status(201).json(successResponse("Kunjungan berhasil dibuat", visit));
    } catch (error) {
      next(error);
    }
  };

  getQueue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string;
      const queue = await this.visitService.getQueue(search);
      res.json(successResponse("Daftar antrian berhasil diambil", queue));
    } catch (error) {
      next(error);
    }
  };

  updateVisitStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const visit = await this.visitService.updateVisitStatus(id, status);
      res.json(successResponse("Status kunjungan berhasil diupdate", visit));
    } catch (error) {
      next(error);
    }
  };

  getCompletedVisits = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await this.visitService.getCompletedVisits(page, limit, search);
      res.json(successResponse("Daftar kunjungan selesai berhasil diambil", result));
    } catch (error) {
      next(error);
    }
  };

  updateVisit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const visit = await this.visitService.updateVisit(id, updateData);
      res.json(successResponse("Kunjungan berhasil diupdate", visit));
    } catch (error) {
      next(error);
    }
  };

  updateVisitExamination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { chiefComplaint, bloodPressure, notes } = req.body;
      
      const visit = await this.visitService.updateVisitExamination(id, {
        chiefComplaint,
        bloodPressure,
        notes
      });
      
      res.json(successResponse("Detail pemeriksaan berhasil diupdate", visit));
    } catch (error) {
      next(error);
    }
  };
}