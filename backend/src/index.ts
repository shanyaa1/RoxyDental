import { Router } from 'express';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import visitRoutes from './routes/visit.routes';
import patientRoutes from './routes/patient.routes';
import scheduleRoutes from './routes/schedule.routes';
import leaveRoutes from './routes/leave.routes';
import commissionRoutes from './routes/commission.routes';
import paymentRoutes from './routes/payment.routes';
import userRoutes from './routes/user.routes';
import treatmentRoutes from './routes/treatment.routes';

const router = Router();

// Auth routes (public & authenticated)
router.use('/auth', authRoutes);

// Doctor routes
router.use('/doctor/dashboard', dashboardRoutes);
router.use('/doctor/visits', visitRoutes);
router.use('/doctor/patients', patientRoutes);
router.use('/doctor/treatments', treatmentRoutes);
router.use('/doctor/schedules', scheduleRoutes);
router.use('/doctor/leaves', leaveRoutes);
router.use('/doctor/finance/commissions', commissionRoutes);

// Shared routes (doctor & nurse with proper role check in middleware)
router.use('/payments', paymentRoutes);
router.use('/users', userRoutes);

export default router;