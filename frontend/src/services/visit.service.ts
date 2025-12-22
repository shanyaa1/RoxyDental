import apiClient from "./api.client";

export type GenderType = "L" | "P";
export type VisitStatusType = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface PatientPayload {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  gender: GenderType;
  phone: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
}

export interface VisitPayload {
  visitDate: string;
  chiefComplaint?: string;
  bloodPressure?: string;
  notes?: string;
}

export interface CreateVisitData {
  patient: PatientPayload;
  visit: VisitPayload;
}

export interface VisitPatient {
  id: string;
  patientNumber: string;
  medicalRecordNumber?: string;
  fullName: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
}

export interface VisitNurse {
  id: string;
  fullName: string;
}

export interface VisitDoctor {
  id: string;
  fullName: string;
}

export interface Treatment {
  id: string;
  diagnosis?: string;
  treatmentNotes?: string;
  quantity: number;
  subtotal: number;
  toothNumber?: string | null;
  createdAt: string;
  notes?: string;
  service?: {
    serviceName: string;
  };
  performer?: {
    id: string;
    fullName: string;
  };
}

export interface Visit {
  id: string;
  visitNumber: string;
  visitDate: string;
  queueNumber: number;
  status: VisitStatusType;
  chiefComplaint?: string;
  bloodPressure?: string;
  notes?: string;
  totalCost?: number;
  patient: VisitPatient;
  doctor?: VisitDoctor | null;
  nurse?: VisitNurse | null;
  treatments?: Treatment[];
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
  async getDoctorQueue(search?: string): Promise<Visit[]> {
    const params = search ? { search } : {};
    const res = await apiClient.get("/doctor/visits/queue", { params });
    return res.data.data || res.data;
  },

  async getNurseQueue(search?: string): Promise<Visit[]> {
    const params = search ? { search } : {};
    const res = await apiClient.get("/doctor/visits/queue", { params });
    return res.data.data || res.data;
  },

  async getCompletedVisits(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<VisitListResponse> {
    const params: any = { page, limit };
    if (search) params.search = search;
    const res = await apiClient.get("/doctor/visits/completed", { params });
    return res.data.data || res.data;
  },

  async getVisitById(id: string): Promise<Visit> {
    const res = await apiClient.get(`/doctor/visits/${id}`);
    return res.data.data || res.data;
  },

  async getVisitByNumber(visitNumber: string): Promise<Visit> {
    const res = await apiClient.get(`/doctor/visits/number/${visitNumber}`);
    return res.data.data || res.data;
  },

  async getVisitByMedicalRecord(medicalRecordNumber: string): Promise<Visit> {
    const res = await apiClient.get(`/doctor/visits/medical-record/${medicalRecordNumber}`);
    return res.data.data || res.data;
  },

  async createVisitAsDoctor(data: CreateVisitData): Promise<Visit> {
    const res = await apiClient.post("/doctor/visits", data);
    return res.data.data || res.data;
  },

  async createVisitAsNurse(data: CreateVisitData): Promise<Visit> {
    const res = await apiClient.post("/doctor/visits", data);
    return res.data.data || res.data;
  },

  async updateVisitStatus(id: string, status: VisitStatusType): Promise<Visit> {
    const res = await apiClient.patch(`/doctor/visits/${id}/status`, { status });
    return res.data.data || res.data;
  },

  async updateVisit(id: string, data: Partial<VisitPayload>): Promise<Visit> {
    const res = await apiClient.put(`/doctor/visits/${id}`, data);
    return res.data.data || res.data;
  },

  async updateVisitExamination(
    id: string,
    data: {
      chiefComplaint?: string;
      bloodPressure?: string;
      notes?: string;
    }
  ): Promise<Visit> {
    const res = await apiClient.put(`/doctor/visits/${id}/examination`, data);
    return res.data.data || res.data;
  },
};