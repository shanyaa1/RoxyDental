import apiClient from "./api.client";

export interface Medication {
  id: string;
  visitId: string;
  patientId: string;
  name: string;
  quantity: string;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationData {
  visitId: string;
  patientId: string;
  name: string;
  quantity: string;
  instructions?: string;
}

export interface UpdateMedicationData {
  name?: string;
  quantity?: string;
  instructions?: string;
}

export const medicationService = {
  async getMedicationsByVisit(visitId: string) {
    const response = await apiClient.get(`/medications/visit/${visitId}`);
    return response.data;
  },

  async createMedication(data: CreateMedicationData) {
    const response = await apiClient.post("/medications", data);
    return response.data;
  },

  async updateMedication(id: string, data: UpdateMedicationData) {
    const response = await apiClient.put(`/medications/${id}`, data);
    return response.data;
  },

  async deleteMedication(id: string) {
    const response = await apiClient.delete(`/medications/${id}`);
    return response.data;
  }
};