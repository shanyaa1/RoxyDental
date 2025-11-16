import crypto from 'crypto';

// Simple email utility - dapat diganti dengan Nodemailer/SendGrid di production
export class EmailService {
  private resetTokens: Map<string, { token: string; expiry: Date }> = new Map();

  generateResetToken(email: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now
    
    this.resetTokens.set(email, { token, expiry });
    
    return token;
  }

  verifyResetToken(email: string, token: string): boolean {
    const stored = this.resetTokens.get(email);
    
    if (!stored) {
      return false;
    }

    if (stored.token !== token) {
      return false;
    }

    if (new Date() > stored.expiry) {
      this.resetTokens.delete(email);
      return false;
    }

    return true;
  }

  clearResetToken(email: string): void {
    this.resetTokens.delete(email);
  }

  async sendResetEmail(email: string, token: string): Promise<void> {
    // TODO: Implement actual email sending
    // For development, just log the token
    console.log(`
      ========================================
      PASSWORD RESET TOKEN
      ========================================
      Email: ${email}
      Token: ${token}
      Reset Link: ${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}
      Expires: 1 hour
      ========================================
    `);

    // In production, use this pattern:
    /*
    import nodemailer from 'nodemailer';
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Password - RoxyDental',
      html: `
        <h2>Reset Password</h2>
        <p>Klik link berikut untuk reset password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}">
          Reset Password
        </a>
        <p>Link ini akan kadaluarsa dalam 1 jam.</p>
      `
    });
    */
  }
}

export const emailService = new EmailService();