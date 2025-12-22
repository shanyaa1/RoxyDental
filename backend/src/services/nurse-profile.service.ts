import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { getStartOfDay, getEndOfDay } from '../utils/date.util';

interface UpdateProfileData {
  fullName?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  education?: string;
  experience?: string;
  sipNumber?: string;
  sipStartDate?: string;
  sipEndDate?: string;
  profilePhoto?: string;
}

export class NurseProfileService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        specialization: true,
        education: true,
        experience: true,
        sipNumber: true,
        sipStartDate: true,
        sipEndDate: true,
        profilePhoto: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileData) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new AppError('Email sudah digunakan', 400);
      }
    }

    const updateData: any = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      specialization: data.specialization,
      education: data.education,
      experience: data.experience,
      sipNumber: data.sipNumber,
      profilePhoto: data.profilePhoto
    };

    if (data.sipStartDate) {
      updateData.sipStartDate = new Date(data.sipStartDate);
    }

    if (data.sipEndDate) {
      updateData.sipEndDate = new Date(data.sipEndDate);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        specialization: true,
        education: true,
        experience: true,
        sipNumber: true,
        sipStartDate: true,
        sipEndDate: true,
        profilePhoto: true,
        isActive: true,
        updatedAt: true
      }
    });

    return updatedUser;
  }

  async getProfileCompletion(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    const fields = [
      user.fullName,
      user.email,
      user.phone,
      user.specialization,
      user.education,
      user.experience,
      user.sipNumber,
      user.sipStartDate,
      user.sipEndDate,
      user.profilePhoto
    ];

    const filledFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
    const totalFields = fields.length;
    const percentage = Math.round((filledFields / totalFields) * 100);

    return {
      percentage,
      filledFields,
      totalFields,
      missingFields: totalFields - filledFields
    };
  }

  async getCurrentShiftStatus(userId: string) {
    const now = new Date();
    const startOfDay = getStartOfDay(now);
    const endOfDay = getEndOfDay(now);

    const todayVisits = await prisma.visit.findMany({
      where: {
        nurseId: userId,
        visitDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          in: ['WAITING', 'IN_PROGRESS']
        }
      },
      include: {
        patient: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: {
        visitDate: 'asc'
      }
    });

    if (todayVisits.length === 0) {
      return {
        status: 'Off Duty',
        shift: null,
        remainingTime: null
      };
    }

    for (const visit of todayVisits) {
      const visitDate = new Date(visit.visitDate);
      const visitHours = visitDate.getHours();
      const visitMinutes = visitDate.getMinutes();
      
      const visitStartTime = new Date(visitDate);
      visitStartTime.setHours(visitHours, visitMinutes, 0, 0);
      
      const visitEndTime = new Date(visitStartTime);
      visitEndTime.setMinutes(visitEndTime.getMinutes() + 30);
      
      if (now >= visitStartTime && now <= visitEndTime) {
        const remainingMs = visitEndTime.getTime() - now.getTime();
        const remainingMinutes = Math.floor(remainingMs / (1000 * 60));
        
        const startTimeStr = visitStartTime.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        
        const endTimeStr = visitEndTime.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        return {
          status: 'On Duty',
          shift: {
            patientName: visit.patient.fullName,
            complaint: visit.chiefComplaint || 'Kunjungan Pasien',
            startTime: startTimeStr,
            endTime: endTimeStr,
            location: 'POLADC'
          },
          remainingTime: {
            hours: 0,
            minutes: remainingMinutes,
            formatted: `${remainingMinutes} menit`
          }
        };
      }
    }

    const nextVisit = todayVisits[0];
    const nextVisitDate = new Date(nextVisit.visitDate);
    const nextVisitHours = nextVisitDate.getHours();
    const nextVisitMinutes = nextVisitDate.getMinutes();
    
    const nextStartTime = new Date(nextVisitDate);
    nextStartTime.setHours(nextVisitHours, nextVisitMinutes, 0, 0);
    
    const nextEndTime = new Date(nextStartTime);
    nextEndTime.setMinutes(nextEndTime.getMinutes() + 30);
    
    const startTimeStr = nextStartTime.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const endTimeStr = nextEndTime.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const timeUntilStart = nextStartTime.getTime() - now.getTime();
    const minutesUntilStart = Math.floor(timeUntilStart / (1000 * 60));

    return {
      status: 'On Duty',
      shift: {
        patientName: nextVisit.patient.fullName,
        complaint: nextVisit.chiefComplaint || 'Kunjungan Pasien',
        startTime: startTimeStr,
        endTime: endTimeStr,
        location: 'POLADC'
      },
      remainingTime: {
        hours: 0,
        minutes: minutesUntilStart,
        formatted: `Dimulai ${minutesUntilStart} menit lagi`
      }
    };
  }

  async getAccountStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    const isVerified = !!(user.sipNumber && user.sipStartDate && user.sipEndDate);
    
    const completion = await this.getProfileCompletion(userId);
    
    const shiftStatus = await this.getCurrentShiftStatus(userId);

    return {
      isActive: user.isActive,
      isVerified,
      completionPercentage: completion.percentage,
      shiftStatus: shiftStatus.status
    };
  }

  async getLicenseInfo(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    if (!user.sipNumber || !user.sipStartDate || !user.sipEndDate) {
      return {
        hasLicense: false,
        sipNumber: null,
        startDate: null,
        endDate: null,
        status: 'INACTIVE',
        remaining: null
      };
    }

    const today = new Date();
    const startDate = new Date(user.sipStartDate);
    const endDate = new Date(user.sipEndDate);

    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'ACTIVE' | 'EXPIRED' | 'EXPIRING_SOON' = 'ACTIVE';
    
    if (remainingDays < 0) {
      status = 'EXPIRED';
    } else if (remainingDays <= 90) {
      status = 'EXPIRING_SOON';
    }

    const percentage = totalDays > 0 ? Math.max(0, Math.min(100, (remainingDays / totalDays) * 100)) : 0;
    const years = Math.floor(remainingDays / 365);
    const months = Math.floor((remainingDays % 365) / 30);

    return {
      hasLicense: true,
      sipNumber: user.sipNumber,
      startDate: user.sipStartDate,
      endDate: user.sipEndDate,
      status,
      remaining: {
        percentage: Math.round(percentage),
        years,
        months,
        days: remainingDays,
        formatted: `${years} tahun ${months} bulan`
      }
    };
  }

  async getWeeklySchedule(userId: string) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const schedules = await prisma.schedule.findMany({
      where: {
        userId,
        scheduleType: 'SHIFT',
        startDatetime: {
          gte: startOfWeek,
          lt: endOfWeek
        }
      },
      orderBy: {
        startDatetime: 'asc'
      }
    });

    const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const weekSchedule = Array(7).fill(null).map((_, index) => ({
      day: daysOfWeek[index],
      start: '-',
      end: '-',
      location: '-'
    }));

    schedules.forEach(schedule => {
      const dayIndex = new Date(schedule.startDatetime).getDay();
      const startTime = new Date(schedule.startDatetime).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const endTime = new Date(schedule.endDatetime).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      weekSchedule[dayIndex] = {
        day: daysOfWeek[dayIndex],
        start: startTime,
        end: endTime,
        location: schedule.location || '-'
      };
    });

    return weekSchedule;
  }

  async deleteAccount(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    await prisma.user.delete({
      where: { id: userId }
    });
  }
}