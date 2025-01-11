import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class MailService {
  private tranporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    await this.tranporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });
  }
}
