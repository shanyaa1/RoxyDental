import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter').optional(),
  email: z.string().email('Format email tidak valid').optional(),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').optional(),
  specialization: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  sipNumber: z.string().optional(),
  sipStartDate: z.string().optional(),
  sipEndDate: z.string().optional(),
  profilePhoto: z.string().optional()
});