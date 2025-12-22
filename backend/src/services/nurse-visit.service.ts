import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export class NurseVisitService {
  async getVisitByMedicalRecord(medicalRecordNumber: string) {
    const visit = await prisma.visit.findFirst({
      where: {
        patient: {
          medicalRecordNumber: medicalRecordNumber
        }
      },
      include: {
        patient: {
          select: {
            id: true,
            patientNumber: true,
            medicalRecordNumber: true,
            fullName: true,
            dateOfBirth: true,
            gender: true,
            address: true,
            phone: true,
            email: true,
            allergies: true,
            medicalHistory: true,
          }
        },
        treatments: {
          include: {
            service: {
              select: {
                serviceName: true,
                category: true,
              }
            },
            performer: {
              select: {
                fullName: true,
                role: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        medications: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        visitDate: 'desc'
      }
    });

    if (!visit) {
      throw new AppError('Kunjungan tidak ditemukan', 404);
    }

    return visit;
  }
}

export default new NurseVisitService();