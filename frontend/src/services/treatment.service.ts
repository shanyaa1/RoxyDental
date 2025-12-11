import apiClient from './api.client';

export interface CreateTreatmentData {
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

export interface UpdateTreatmentData {
  toothNumber?: string;
  diagnosis?: string;
  treatmentNotes?: string;
  quantity?: number;
  discount?: number;
  images?: string[];
}

export const treatmentService = {
  async getTreatments(params?: {
    page?: number;
    limit?: number;
    patientId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) {
    const response = await apiClient.get('/doctor/treatments', { params });
    return response.data;
  },

  async getTreatmentById(id: string) {
    const response = await apiClient.get(`/doctor/treatments/${id}`);
    return response.data;
  },

  async getTreatmentsByVisit(visitId: string) {
    const response = await apiClient.get(`/doctor/treatments/visit/${visitId}`);
    return response.data;
  },

  async getVisitWithTreatments(visitId: string) {
    const response = await apiClient.get(`/doctor/treatments/visit/${visitId}/full`);
    return response.data;
  },

  async createTreatment(data: CreateTreatmentData) {
    const response = await apiClient.post('/doctor/treatments', data);
    return response.data;
  },

  async updateTreatment(id: string, data: UpdateTreatmentData) {
    const response = await apiClient.put(`/doctor/treatments/${id}`, data);
    return response.data;
  },

  async deleteTreatment(id: string) {
    const response = await apiClient.delete(`/doctor/treatments/${id}`);
    return response.data;
  },

  async uploadImages(files: FileList) {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    const response = await apiClient.post('/doctor/treatments/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};