import apiClient from './api.client';

export interface Patient {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'L' | 'P';
  phone: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
}

export interface CreateVisitData {
  patient: Patient;
  visit: {
    visitDate: string;
    chiefComplaint?: string;
    bloodPressure?: string;
    notes?: string;
  };
}

export interface Visit {
  id: string;
  visitNumber: string;
  visitDate: string;
  queueNumber: number;
  status: string;
  chiefComplaint?: string;
  bloodPressure?: string;
  notes?: string;
  totalCost: number;
  patient: {
    id: string;
    patientNumber: string;
    fullName: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
  };
  nurse: {
    id: string;
    fullName: string;
  };
  treatments?: any[];
}

export interface VisitListResponse {
  visits: Visit[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const visitService = {
  async getQueue(search?: string) {
    const params = search ? { search } : {};
    const response = await apiClient.get('/doctor/visits/queue', { params });
    return response.data;
  },

  async getCompletedVisits(page: number = 1, limit: number = 10, search?: string) {
    const params: any = { page, limit };
    if (search) params.search = search;
    
    const response = await apiClient.get('/doctor/visits/completed', { params });
    return response.data;
  },

  async getVisitById(id: string) {
    const response = await apiClient.get(`/doctor/visits/${id}`);
    return response.data;
  },

  async createVisit(data: CreateVisitData) {
    const response = await apiClient.post('/doctor/visits', data);
    return response.data;
  },

  async updateVisitStatus(id: string, status: string) {
    const response = await apiClient.patch(`/doctor/visits/${id}/status`, { status });
    return response.data;
  }
};