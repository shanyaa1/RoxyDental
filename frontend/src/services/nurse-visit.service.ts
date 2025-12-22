import apiClient from './api.client';

export interface Visit {
  id: string;
  visitNumber: string;
  visitDate: string;
  patientId: string;
  chiefComplaint?: string;
  bloodPressure?: string;
  notes?: string;
  status: string;
  totalCost: number;
  patient?: any;
  treatments?: any[];
  medications?: any[];
}

class NurseVisitService {
  async getVisitByMedicalRecord(medicalRecordNumber: string): Promise<Visit> {
    const response = await apiClient.get(
      `/nurse/visits/medical-record/${medicalRecordNumber}`
    );
    return response.data.data;
  }
}

export const nurseVisitService = new NurseVisitService();