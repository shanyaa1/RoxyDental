import { prisma } from '../config/database';
import { getStartOfDay, getEndOfDay, getStartOfMonth, getEndOfMonth } from '../utils/date.util';

export class DashboardNurseService {
  async getNurseSummary(userId: string) {
    try {
      const today = new Date();
      const startOfDay = getStartOfDay(today);
      const endOfDay = getEndOfDay(today);
      const startOfMonth = getStartOfMonth(today);
      const endOfMonth = getEndOfMonth(today);

      const [
        totalVisits,
        todayVisits,
        monthlyVisits,
        nurseProfile
      ] = await Promise.all([
        prisma.visit.count(), // All visits
        prisma.visit.count({
          where: {
            visitDate: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        }), // All visits today
        prisma.visit.count({
          where: {
            visitDate: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        }), // All visits this month
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
        })
      ]);

      console.log('Fetched counts and profile.');

      if (!nurseProfile) {
        throw new Error('Nurse profile not found');
      }

      console.log('Generating schedule...');
      const schedules = await this.generateScheduleFromVisits();

      return {
        totalVisits,
        todayVisits,
        monthlyVisits,
        profile: nurseProfile,
        schedules
      };
    } catch (error) {
      console.error('Error in getNurseSummary:', error);
      throw error;
    }
  }

  private async generateScheduleFromVisits() {
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      const visits = await prisma.visit.findMany({
        where: {
          visitDate: {
            gte: startOfWeek,
            lt: endOfWeek
          }
        },
        orderBy: {
          visitDate: 'asc'
        }
      });

      const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const weekSchedule = Array(7).fill(null).map((_, index) => ({
        day: daysOfWeek[index],
        start: '-',
        end: '-',
        location: '-'
      }));

      const groupedByDay: { [key: number]: Date[] } = {};

      visits.forEach(visit => {
        const visitDate = new Date(visit.visitDate);
        const dayIndex = visitDate.getDay();

        if (!groupedByDay[dayIndex]) {
          groupedByDay[dayIndex] = [];
        }
        groupedByDay[dayIndex].push(visitDate);
      });

      Object.keys(groupedByDay).forEach(dayIndexStr => {
        const dayIndex = parseInt(dayIndexStr);
        const times = groupedByDay[dayIndex];

        if (times.length > 0) {
          times.sort((a, b) => a.getTime() - b.getTime());

          const earliestTime = times[0];
          const latestTime = times[times.length - 1];

          const startTime = earliestTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });

          const endTime = latestTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });

          weekSchedule[dayIndex] = {
            day: daysOfWeek[dayIndex],
            start: startTime,
            end: endTime,
            location: 'POLADC'
          };
        }
      });

      return weekSchedule;
    } catch (error) {
      console.error('Error in generateScheduleFromVisits:', error);
      throw error;
    }
  }
}