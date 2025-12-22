import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const patientController = new PatientController();

router.get('/', authMiddleware, patientController.getPatients.bind(patientController));
router.get('/:id', authMiddleware, patientController.getPatientById.bind(patientController));
router.get('/:id/records', authMiddleware, patientController.getPatientRecords.bind(patientController));
router.post('/', authMiddleware, patientController.createPatient.bind(patientController));
router.post('/:id/records', authMiddleware, patientController.createTreatment.bind(patientController));
router.put('/:id/medical-history', authMiddleware, patientController.updateMedicalHistory.bind(patientController));

export default router;