import { Router } from 'express';
import { LeaveController } from '../controllers/leave.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createLeaveSchema } from '../validators/Leave.validator';

const router = Router();
const leaveController = new LeaveController();

router.get('/', authMiddleware, leaveController.getLeaveRequests);
router.post('/', authMiddleware, validate(createLeaveSchema), leaveController.createLeaveRequest);

export default router;