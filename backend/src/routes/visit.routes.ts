import { Router } from 'express';
import { VisitController } from '../controllers/visit.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createVisitSchema, updateVisitStatusSchema } from '../validators/visit.validator';

const router = Router();
const visitController = new VisitController();

router.get('/', authMiddleware, visitController.getVisits);
router.get('/queue', authMiddleware, visitController.getQueue);
router.get('/completed', authMiddleware, visitController.getCompletedVisits);
router.get('/number/:visitNumber', authMiddleware, visitController.getVisitByNumber);
router.get('/medical-record/:medicalRecordNumber', authMiddleware, visitController.getVisitByMedicalRecord);
router.get('/:id', authMiddleware, visitController.getVisitById);
router.post('/', authMiddleware, validate(createVisitSchema), visitController.createVisit);
router.patch('/:id/status', authMiddleware, validate(updateVisitStatusSchema), visitController.updateVisitStatus);
router.put('/:id', authMiddleware, visitController.updateVisit);
router.put('/:id/examination', authMiddleware, visitController.updateVisitExamination);

export default router;