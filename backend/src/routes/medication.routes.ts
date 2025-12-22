import { Router } from "express";
import { MedicationController } from "../controllers/medication.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const medicationController = new MedicationController();

router.get("/visit/:visitId", authMiddleware, medicationController.getMedicationsByVisit.bind(medicationController));
router.post("/", authMiddleware, medicationController.createMedication.bind(medicationController));
router.put("/:id", authMiddleware, medicationController.updateMedication.bind(medicationController));
router.delete("/:id", authMiddleware, medicationController.deleteMedication.bind(medicationController));

export default router;