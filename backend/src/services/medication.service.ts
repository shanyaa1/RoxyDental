import { prisma } from "../config/database";
import { AppError } from "../middlewares/error.middleware";

interface CreateMedicationData {
  visitId: string;
  patientId: string;
  name: string;
  quantity: string;
  instructions?: string;
}

interface UpdateMedicationData {
  name?: string;
  quantity?: string;
  instructions?: string;
}

export class MedicationService {
  async getMedicationsByVisit(visitId: string) {
    const medications = await prisma.medication.findMany({
      where: { visitId },
      orderBy: {
        createdAt: "asc"
      }
    });

    return medications;
  }

  async createMedication(data: CreateMedicationData) {
    const visit = await prisma.visit.findUnique({
      where: { id: data.visitId }
    });

    if (!visit) {
      throw new AppError("Kunjungan tidak ditemukan", 404);
    }

    const medication = await prisma.medication.create({
      data: {
        visitId: data.visitId,
        patientId: data.patientId,
        name: data.name,
        quantity: data.quantity,
        instructions: data.instructions
      }
    });

    return medication;
  }

  async updateMedication(id: string, data: UpdateMedicationData) {
    const medication = await prisma.medication.findUnique({
      where: { id }
    });

    if (!medication) {
      throw new AppError("Obat tidak ditemukan", 404);
    }

    const updated = await prisma.medication.update({
      where: { id },
      data: {
        name: data.name,
        quantity: data.quantity,
        instructions: data.instructions
      }
    });

    return updated;
  }

  async deleteMedication(id: string) {
    const medication = await prisma.medication.findUnique({
      where: { id }
    });

    if (!medication) {
      throw new AppError("Obat tidak ditemukan", 404);
    }

    await prisma.medication.delete({
      where: { id }
    });
  }
}