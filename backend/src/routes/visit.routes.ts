import { Router } from 'express';
import { VisitController } from '../controllers/visit.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createVisitSchema, updateVisitStatusSchema } from '../validators/Visit.validator';

const router = Router();
const visitController = new VisitController();

router.get('/', authMiddleware, visitController.getVisits);
router.get('/queue', authMiddleware, visitController.getQueue);
router.get('/:id', authMiddleware, visitController.getVisitById);
router.post('/', authMiddleware, validate(createVisitSchema), visitController.createVisit);
router.patch('/:id/status', authMiddleware, validate(updateVisitStatusSchema), visitController.updateVisitStatus);

export default router;