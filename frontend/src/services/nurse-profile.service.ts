import apiClient from './api.client';

export interface NurseProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phone: string;
  specialization?: string;
  education?: string;
  experience?: string;
  sipNumber?: string;
  sipStartDate?: string;
  sipEndDate?: string;
  profilePhoto?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileCompletion {
  percentage: number;
  filledFields: number;
  totalFields: number;
  missingFields: number;
}

export interface ShiftStatus {
  status: string;
  shift: {
    patientName?: string;
    complaint?: string;
    startTime: string;
    endTime: string;
    location: string;
  } | null;
  remainingTime: {
    hours: number;
    minutes: number;
    formatted: string;
  } | null;
}

export interface AccountStatus {
  isActive: boolean;
  isVerified: boolean;
  completionPercentage: number;
  shiftStatus: string;
}

export interface LicenseInfo {
  hasLicense: boolean;
  sipNumber: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  remaining: {
    percentage: number;
    years: number;
    months: number;
    days: number;
    formatted: string;
  } | null;
}

export interface UpdateProfileData {
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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const nurseProfileService = {
  async getProfile(): Promise<ApiResponse<NurseProfile>> {
    const response = await apiClient.get('/nurse/profile');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<NurseProfile>> {
    const response = await apiClient.put('/nurse/profile', data);
    return response.data;
  },

  async getProfileCompletion(): Promise<ApiResponse<ProfileCompletion>> {
    const response = await apiClient.get('/nurse/profile/completion');
    return response.data;
  },

  async getCurrentShiftStatus(): Promise<ApiResponse<ShiftStatus>> {
    const response = await apiClient.get('/nurse/profile/shift-status');
    return response.data;
  },

  async getAccountStatus(): Promise<ApiResponse<AccountStatus>> {
    const response = await apiClient.get('/nurse/profile/account-status');
    return response.data;
  },

  async getLicenseInfo(): Promise<ApiResponse<LicenseInfo>> {
    const response = await apiClient.get('/nurse/profile/license');
    return response.data;
  },

  async deleteAccount(): Promise<ApiResponse<void>> {
    const response = await apiClient.delete('/nurse/account');
    return response.data;
  }
};