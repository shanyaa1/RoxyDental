import { Router } from 'express';
import nurseVisitController from '../controllers/nurse-visit.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get(
  '/medical-record/:medicalRecordNumber',
  authMiddleware,
  nurseVisitController.getVisitByMedicalRecord.bind(nurseVisitController)
);

export default router;