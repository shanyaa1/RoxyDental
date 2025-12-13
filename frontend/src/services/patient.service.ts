import apiClient from './api.client';

export const patientService = {
  async getPatients(page: number = 1, limit: number = 100, search?: string) {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      
      const response = await apiClient.get('/doctor/patients', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  async getPatientById(id: string) {
    const response = await apiClient.get(`/doctor/patients/${id}`);
    return response.data;
  },

  async createPatient(data: any) {
    const response = await apiClient.post('/doctor/patients', data);
    return response.data;
  }
};