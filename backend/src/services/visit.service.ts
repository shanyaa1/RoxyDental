import { prisma } from '../config/database';
import { VisitStatus, Gender } from '../../generated/prisma';
import { AppError } from '../middlewares/error.middleware';

interface CreatePatientData {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
}

interface CreateVisitData {
  visitDate: string;
  chiefComplaint?: string;
  bloodPressure?: string;
  notes?: string;
}

interface CreateVisitInput {
  patient: CreatePatientData;
  visit: CreateVisitData;
}

export class VisitService {
  private async generatePatientNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    const lastPatient = await prisma.patient.findFirst({
      where: {
        patientNumber: {
          startsWith: `P-${year}${month}`
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let sequence = 1;
    if (lastPatient) {
      const lastSequence = parseInt(lastPatient.patientNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `P-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }

  // ✅ FIX FINAL: visit number dibuat unik tanpa count() (anti race condition)
  private async generateVisitNumber(): Promise<string> {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');

    // 4 digit random + 3 digit millisecond => sangat kecil kemungkinan tabrakan
    const rand = Math.floor(1000 + Math.random() * 9000); // 1000..9999
    const ms = String(now.getMilliseconds()).padStart(3, '0'); // 000..999

    return `V-${dateStr}-${rand}${ms}`; // contoh: V-20251212-4837123
  }

  private async getNextQueueNumber(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastQueue = await prisma.visit.findFirst({
      where: {
        visitDate: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: { queueNumber: 'desc' }
    });

    return lastQueue ? lastQueue.queueNumber + 1 : 1;
  }

  async getVisits(page: number = 1, limit: number = 10, status?: VisitStatus, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { visitNumber: { contains: search, mode: 'insensitive' } },
        { patient: { fullName: { contains: search, mode: 'insensitive' } } },
        { patient: { patientNumber: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [visits, total] = await Promise.all([
      prisma.visit.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              patientNumber: true,
              fullName: true,
              phone: true,
              gender: true,
              dateOfBirth: true
            }
          },
          nurse: {
            select: {
              id: true,
              fullName: true
            }
          }
        },
        orderBy: {
          visitDate: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.visit.count({ where })
    ]);

    return {
      visits,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getVisitById(id: string) {
    const visit = await prisma.visit.findUnique({
      where: { id },
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
                fullName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        payments: true
      }
    });

    if (!visit) {
      throw new AppError('Kunjungan tidak ditemukan', 404);
    }

    return visit;
  }

  async createVisit(data: CreateVisitInput, nurseId: string) {
    const { patient, visit } = data;

    let patientRecord;

    if (patient.id) {
      patientRecord = await prisma.patient.findUnique({
        where: { id: patient.id }
      });

      if (!patientRecord) {
        throw new AppError('Pasien tidak ditemukan', 404);
      }
    } else {
      const existingPatient = await prisma.patient.findFirst({
        where: {
          phone: patient.phone
        }
      });

      if (existingPatient) {
        patientRecord = existingPatient;
      } else {
        const patientNumber = await this.generatePatientNumber();

        patientRecord = await prisma.patient.create({
          data: {
            patientNumber,
            fullName: patient.fullName,
            dateOfBirth: new Date(patient.dateOfBirth),
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email,
            address: patient.address,
            bloodType: patient.bloodType,
            allergies: patient.allergies,
            medicalHistory: patient.medicalHistory
          }
        });
      }
    }

    const queueNumber = await this.getNextQueueNumber();

    // ✅ retry kecil untuk jaga-jaga kalau tabrakan visit_number (harusnya hampir tidak mungkin)
    for (let attempt = 1; attempt <= 5; attempt++) {
      const visitNumber = await this.generateVisitNumber();

      try {
        const newVisit = await prisma.visit.create({
          data: {
            patientId: patientRecord.id,
            nurseId,
            visitNumber,
            visitDate: new Date(visit.visitDate),
            queueNumber,
            status: VisitStatus.WAITING,
            chiefComplaint: visit.chiefComplaint,
            bloodPressure: visit.bloodPressure,
            notes: visit.notes
          },
          include: {
            patient: true,
            nurse: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        });

        return newVisit;
      } catch (err: any) {
        const isDuplicateVisitNumber =
          err?.code === 'P2002' &&
          Array.isArray(err?.meta?.target) &&
          err.meta.target.includes('visit_number');

        if (isDuplicateVisitNumber && attempt < 5) {
          continue; // coba lagi generate nomor baru
        }

        throw err;
      }
    }

    throw new AppError('Gagal membuat nomor kunjungan unik', 500);
  }

  async getQueue(search?: string) {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const where: any = {
      visitDate: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: {
        in: [VisitStatus.WAITING, VisitStatus.IN_PROGRESS]
      }
    };

    if (search) {
      where.OR = [
        { visitNumber: { contains: search, mode: 'insensitive' } },
        { patient: { fullName: { contains: search, mode: 'insensitive' } } },
        { patient: { patientNumber: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const queue = await prisma.visit.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            patientNumber: true,
            fullName: true,
            phone: true
          }
        },
        nurse: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: {
        queueNumber: 'asc'
      }
    });

    return queue;
  }

  async updateVisitStatus(id: string, status: VisitStatus) {
    const visit = await prisma.visit.findUnique({
      where: { id }
    });

    if (!visit) {
      throw new AppError('Kunjungan tidak ditemukan', 404);
    }

    const updatedVisit = await prisma.visit.update({
      where: { id },
      data: { status },
      include: {
        patient: {
          select: {
            fullName: true
          }
        }
      }
    });

    return updatedVisit;
  }

  async getCompletedVisits(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {
      status: VisitStatus.COMPLETED
    };

    if (search) {
      where.OR = [
        { visitNumber: { contains: search, mode: 'insensitive' } },
        { patient: { fullName: { contains: search, mode: 'insensitive' } } },
        { patient: { patientNumber: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [visits, total] = await Promise.all([
      prisma.visit.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              patientNumber: true,
              fullName: true,
              dateOfBirth: true,
              gender: true,
              phone: true
            }
          },
          treatments: {
            select: {
              id: true,
              diagnosis: true,
              service: {
                select: {
                  serviceName: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          visitDate: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.visit.count({ where })
    ]);

    return {
      visits,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
