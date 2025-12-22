import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express.types";
import { MedicationService } from "../services/medication.service";
import { successResponse } from "../utils/response.util";

const medicationService = new MedicationService();

export class MedicationController {
  async getMedicationsByVisit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const medications = await medicationService.getMedicationsByVisit(req.params.visitId);
      res.json(successResponse("Daftar obat berhasil diambil", medications));
    } catch (error) {
      next(error);
    }
  }

  async createMedication(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const medication = await medicationService.createMedication(req.body);
      res.status(201).json(successResponse("Obat berhasil ditambahkan", medication));
    } catch (error) {
      next(error);
    }
  }

  async updateMedication(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const medication = await medicationService.updateMedication(req.params.id, req.body);
      res.json(successResponse("Obat berhasil diupdate", medication));
    } catch (error) {
      next(error);
    }
  }

  async deleteMedication(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await medicationService.deleteMedication(req.params.id);
      res.json(successResponse("Obat berhasil dihapus"));
    } catch (error) {
      next(error);
    }
  }
}