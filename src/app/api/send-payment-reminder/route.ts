import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, companyName, amount, dueDate } = await req.json();

    const transporter = nodemailer.createTransport({
      // Configure your email service
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Payment Reminder for ${companyName}`,
      html: `
        <h1>Payment Reminder</h1>
        <p>Dear ${companyName},</p>
        <p>This is a reminder that your payment of $${amount} is due on ${new Date(dueDate).toLocaleDateString()}.</p>
        <p>Please ensure timely payment to avoid any service interruptions.</p>
        <p>Best regards,<br>Your Platform Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: 'Failed to send reminder email' },
      { status: 500 }
    );
  }
} 