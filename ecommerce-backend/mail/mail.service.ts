// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  async sendVerificationEmail(to: string, token: string) {
    const url = `http://localhost:3000/auth/verify-email?token=${token}`;
    await this.transporter.sendMail({
      from: process.env.DEFAULT_MAIL_FROM || process.env.MAIL_USER,
      to,
      subject: 'Email Verification',
      html: `
        <p>Hello,</p>
        <p>Click the following link to verify your email:</p>
        <a href="${url}">${url}</a>
      `,
    });
  }
}
