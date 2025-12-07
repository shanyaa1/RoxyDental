import { prisma } from '../config/database';
import { getStartOfDay, getEndOfDay, getStartOfMonth, getEndOfMonth } from '../utils/date.util';

export class DashboardNurseService {
  async getNurseSummary(userId: string) {
    const today = new Date();
    const startOfDay = getStartOfDay(today);
    const endOfDay = getEndOfDay(today);
    const startOfMonth = getStartOfMonth(today);
    const endOfMonth = getEndOfMonth(today);

    const [
      totalVisits,
      todayVisits,
      monthlyVisits,
      nurseProfile,
      schedules
    ] = await Promise.all([
      prisma.visit.count({
        where: {
          nurseId: userId
        }
      }),
      prisma.visit.count({
        where: {
          nurseId: userId,
          visitDate: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      prisma.visit.count({
        where: {
          nurseId: userId,
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

    return {
      totalVisits,
      todayVisits,
      monthlyVisits,
      profile: nurseProfile,
      schedules: this.formatSchedules(schedules)
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
}