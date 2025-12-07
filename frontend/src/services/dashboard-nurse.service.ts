import apiClient from './api.client';

export interface NurseScheduleItem {
  day: string;
  start: string;
  end: string;
  location: string;
}

export interface NurseProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  specialization?: string;
  education?: string;
  experience?: string;
  profilePhoto?: string;
  isActive: boolean;
  createdAt: string;
}

export interface NurseDashboardData {
  totalVisits: number;
  todayVisits: number;
  monthlyVisits: number;
  profile: NurseProfile;
  schedules: NurseScheduleItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const dashboardNurseService = {
  async getNurseSummary(): Promise<ApiResponse<NurseDashboardData>> {
    const response = await apiClient.get('/nurse/dashboard/summary');
    return response.data;
  }
};