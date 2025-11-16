import { Router } from 'express';
import { ScheduleController } from '../controllers/schedule.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createScheduleSchema } from '../validators/Schedule.validator';

const router = Router();
const scheduleController = new ScheduleController();

router.get('/', authMiddleware, scheduleController.getSchedules);
router.post('/', authMiddleware, validate(createScheduleSchema), scheduleController.createSchedule);
router.get('/activities', authMiddleware, scheduleController.getActivities);
router.get('/meetings', authMiddleware, scheduleController.getMeetings);

export default router;