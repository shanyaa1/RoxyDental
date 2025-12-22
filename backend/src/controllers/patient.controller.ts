import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { PatientService } from '../services/patient.service';
import { successResponse } from '../utils/response.util';

const patientService = new PatientService();

export class PatientController {
  async getPatients(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit, search } = req.query;
      const result = await patientService.getPatients(
        Number(page) || 1,
        Number(limit) || 10,
        search as string
      );
      res.json(successResponse('Daftar pasien berhasil diambil', result));
    } catch (error) {
      next(error);
    }
  }

  async updateMedicalHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const patient = await patientService.updateMedicalHistory(
        req.params.id,
        req.body.medicalHistory
      );
      res.json(successResponse("Riwayat medis berhasil diupdate", patient));
    } catch (error) {
      next(error);
    }
  }

  async getPatientById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const patient = await patientService.getPatientById(req.params.id);
      res.json(successResponse('Detail pasien berhasil diambil', patient));
    } catch (error) {
      next(error);
    }
  }

  async getPatientRecords(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const records = await patientService.getPatientRecords(req.params.id);
      res.json(successResponse('Rekam medis berhasil diambil', records));
    } catch (error) {
      next(error);
    }
  }

  async createTreatment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const treatment = await patientService.createTreatment(
        req.params.id,
        req.body,
        req.user!.id
      );
      res.status(201).json(successResponse('Treatment berhasil ditambahkan', treatment));
    } catch (error) {
      next(error);
    }
  }

  async createPatient(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const patient = await patientService.createPatient(req.body);
      res.status(201).json(successResponse('Pasien berhasil ditambahkan', patient));
    } catch (error) {
      next(error);
    }
  }
}