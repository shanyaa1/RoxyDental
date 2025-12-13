import { prisma } from '../config/database';
import { getStartOfDay, getEndOfDay, getStartOfMonth, getEndOfMonth } from '../utils/date.util';

export class DashboardService {
  async getDoctorSummary(userId: string) {
    const today = new Date();
    const startOfDay = getStartOfDay(today);
    const endOfDay = getEndOfDay(today);
    const startOfMonth = getStartOfMonth(today);
    const endOfMonth = getEndOfMonth(today);

    const [totalVisits, todayVisits, monthlyVisits, doctorProfile, schedules] = await Promise.all([
      prisma.visit.count(),
      prisma.visit.count({
        where: {
          visitDate: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      prisma.visit.count({
        where: {
          visitDate: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
          phone: true,
          specialization: true,
          education: true,
          experience: true,
          sipNumber: true,
          sipStartDate: true,
          sipEndDate: true,
          profilePhoto: true,
          isActive: true,
          createdAt: true
        }
      }),
      prisma.schedule.findMany({
        where: {
          userId,
          startDatetime: {
            gte: startOfDay,
            lte: new Date(startOfDay.getTime() + 7 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: {
          startDatetime: 'asc'
        }
      })
    ]);

    const practiceStatus = this.getPracticeStatus(doctorProfile);
    const sipRemaining = this.calculateSipRemaining(
      doctorProfile?.sipStartDate ?? null,
      doctorProfile?.sipEndDate ?? null
    );

    return {
      totalVisits,
      todayVisits,
      monthlyVisits,
      profile: doctorProfile,
      schedules: this.formatSchedules(schedules),
      practiceStatus,
      sipRemaining
    };
  }

  private getPracticeStatus(profile: any): 'ACTIVE' | 'INACTIVE' | 'EXPIRED' {
    if (!profile?.sipNumber || !profile?.sipEndDate) {
      return 'INACTIVE';
    }

    const today = new Date();
    const sipEndDate = new Date(profile.sipEndDate);

    if (sipEndDate < today) {
      return 'EXPIRED';
    }

    return 'ACTIVE';
  }

  private calculateSipRemaining(startDate: Date | null, endDate: Date | null) {
    if (!startDate || !endDate) {
      return null;
    }

    const today = new Date();
    const end = new Date(endDate);
    const start = new Date(startDate);

    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.floor((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (totalDays <= 0 || remainingDays < 0) {
      return {
        percentage: 0,
        years: 0,
        months: 0,
        days: 0
      };
    }

    const percentage = (remainingDays / totalDays) * 100;
    const years = Math.floor(remainingDays / 365);
    const months = Math.floor((remainingDays % 365) / 30);

    return {
      percentage: Math.max(0, Math.min(100, percentage)),
      years,
      months,
      days: remainingDays
    };
  }

  private formatSchedules(schedules: any[]) {
    const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const weekSchedule = Array(7).fill(null).map((_, index) => ({
      day: daysOfWeek[index],
      start: '-',
      end: '-',
      location: '-'
    }));

    schedules.forEach((schedule) => {
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
}
