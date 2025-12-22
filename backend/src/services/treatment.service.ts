import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

interface CreateTreatmentData {
  visitId: string;
  patientId: string;
  serviceId: string;
  toothNumber?: string;
  diagnosis?: string;
  treatmentNotes?: string;
  quantity?: number;
  discount?: number;
  images?: string[];
}

interface UpdateTreatmentData {
  toothNumber?: string;
  diagnosis?: string;
  treatmentNotes?: string;
  quantity?: number;
  discount?: number;
  images?: string[];
}

export class TreatmentService {
  async getTreatments(
    doctorId: string,
    patientId?: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10,
    search?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      performedBy: doctorId
    };

    if (patientId) {
      where.patientId = patientId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    if (search) {
      where.OR = [
        { patient: { fullName: { contains: search, mode: 'insensitive' } } },
        { patient: { patientNumber: { contains: search, mode: 'insensitive' } } },
        { diagnosis: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [treatments, total] = await Promise.all([
      prisma.treatment.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              patientNumber: true,
              fullName: true,
              gender: true
            }
          },
          service: {
            select: {
              id: true,
              serviceName: true,
              category: true
            }
          },
          visit: {
            select: {
              id: true,
              visitNumber: true,
              visitDate: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.treatment.count({ where })
    ]);

    return {
      treatments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getTreatmentById(id: string) {
    const treatment = await prisma.treatment.findUnique({
      where: { id },
      include: {
        patient: true,
        service: true,
        visit: {
          include: {
            patient: {
              select: {
                fullName: true
              }
            }
          }
        },
        performer: {
          select: {
            id: true,
            fullName: true,
            specialization: true
          }
        },
        commissions: {
          select: {
            id: true,
            commissionAmount: true,
            status: true
          }
        }
      }
    });

    if (!treatment) {
      throw new AppError('Treatment tidak ditemukan', 404);
    }

    return treatment;
  }

  async getTreatmentsByVisit(visitId: string) {
    const treatments = await prisma.treatment.findMany({
      where: { visitId },
      include: {
        service: true,
        performer: {
          select: {
            id: true,
            fullName: true,
            specialization: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return treatments;
  }

  async createTreatment(data: CreateTreatmentData, performedBy: string) {
    const visit = await prisma.visit.findUnique({
      where: { id: data.visitId }
    });

    if (!visit) {
      throw new AppError('Kunjungan tidak ditemukan', 404);
    }

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId }
    });

    if (!service) {
      throw new AppError('Layanan tidak ditemukan', 404);
    }

    const quantity = data.quantity || 1;
    const discount = data.discount || 0;
    const subtotal = service.basePrice.toNumber() * quantity - discount;

    const treatment = await prisma.treatment.create({
      data: {
        visitId: data.visitId,
        patientId: data.patientId,
        serviceId: data.serviceId,
        performedBy,
        toothNumber: data.toothNumber,
        diagnosis: data.diagnosis,
        treatmentNotes: data.treatmentNotes,
        quantity,
        unitPrice: service.basePrice,
        discount,
        subtotal,
        images: data.images || []
      },
      include: {
        service: true,
        performer: {
          select: {
            fullName: true
          }
        }
      }
    });

    await prisma.visit.update({
      where: { id: data.visitId },
      data: {
        totalCost: {
          increment: subtotal
        }
      }
    });

    const commissionAmount = (subtotal * service.commissionRate.toNumber()) / 100;

    await prisma.commission.create({
      data: {
        userId: performedBy,
        treatmentId: treatment.id,
        baseAmount: subtotal,
        commissionRate: service.commissionRate,
        commissionAmount,
        periodMonth: new Date().getMonth() + 1,
        periodYear: new Date().getFullYear()
      }
    });

    return treatment;
  }

  async updateTreatment(id: string, data: UpdateTreatmentData, doctorId: string) {
    const treatment = await prisma.treatment.findUnique({
      where: { id },
      include: { service: true, visit: true }
    });

    if (!treatment) {
      throw new AppError('Treatment tidak ditemukan', 404);
    }

    if (treatment.performedBy !== doctorId) {
      throw new AppError('Anda tidak memiliki akses untuk mengupdate treatment ini', 403);
    }

    const quantity = data.quantity || treatment.quantity;
    const discount = data.discount !== undefined ? data.discount : treatment.discount.toNumber();
    const subtotal = treatment.service.basePrice.toNumber() * quantity - discount;

    const oldSubtotal = treatment.subtotal.toNumber();
    const subtotalDiff = subtotal - oldSubtotal;

    const updatedTreatment = await prisma.$transaction(async (tx) => {
      const updated = await tx.treatment.update({
        where: { id },
        data: {
          toothNumber: data.toothNumber,
          diagnosis: data.diagnosis,
          treatmentNotes: data.treatmentNotes,
          quantity,
          discount,
          subtotal,
          images: data.images
        },
        include: {
          service: true,
          patient: {
            select: {
              fullName: true
            }
          }
        }
      });

      if (subtotalDiff !== 0) {
        await tx.visit.update({
          where: { id: treatment.visitId },
          data: {
            totalCost: {
              increment: subtotalDiff
            }
          }
        });

        const commissionRate = treatment.service.commissionRate.toNumber();
        const newCommissionAmount = (subtotal * commissionRate) / 100;

        await tx.commission.updateMany({
          where: {
            treatmentId: id
          },
          data: {
            baseAmount: subtotal,
            commissionAmount: newCommissionAmount
          }
        });
      }

      return updated;
    });

    return updatedTreatment;
  }

  async deleteTreatment(id: string, doctorId: string) {
    const treatment = await prisma.treatment.findUnique({
      where: { id }
    });

    if (!treatment) {
      throw new AppError('Treatment tidak ditemukan', 404);
    }

    if (treatment.performedBy !== doctorId) {
      throw new AppError('Anda tidak memiliki akses untuk menghapus treatment ini', 403);
    }

    await prisma.$transaction(async (tx) => {
      await tx.visit.update({
        where: { id: treatment.visitId },
        data: {
          totalCost: {
            decrement: treatment.subtotal.toNumber()
          }
        }
      });

      await tx.treatment.delete({
        where: { id }
      });
    });
  }

  async getVisitWithTreatments(visitId: string) {
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: {
        patient: true,
        nurse: {
          select: {
            id: true,
            fullName: true
          }
        },
        treatments: {
          include: {
            service: true,
            performer: {
              select: {
                id: true,
                fullName: true,
                specialization: true
              }
            }
          }
        }
      }
    });

    if (!visit) {
      throw new AppError('Kunjungan tidak ditemukan', 404);
    }

    return visit;
  }
}