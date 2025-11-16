import { z } from 'zod';

export const resetPasswordSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  token: z.string().min(1, 'Token harus diisi'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter')
});