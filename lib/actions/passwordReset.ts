// app/_actions/password-reset.ts
"use server";
import { auth, db } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import nodemailer from "nodemailer";

export async function sendPasswordResetLink(email: string) {
  try {
    // Send password reset email using Firebase
    await sendPasswordResetEmail(auth, email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/login`, // URL to redirect after password reset
      handleCodeInApp: false,
    });

    // Send custom styled email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const LOGO_URL = "https://i.ibb.co/BLg3nsp/logo.png";

    // Send a follow-up email with your custom styling
    await transporter.sendMail({
      from: '"Nex Pay" <noreply@nexpay.com>',
      to: email,
      subject: "Password Reset Instructions",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Instructions</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #131313;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #262626;
              }
              .header {
                text-align: left;
                padding: 20px;
                display: flex;
                align-items: center;
                background-color: #131313;
                border-radius: 8px;
              }
              .logo {
                width: 40px;
                height: 40px;
              }
              .company-name {
                margin-left: 12px;
                color: #F9F9F9;
                font-size: 24px;
                font-weight: bold;
                text-transform: uppercase;
                white-space: nowrap;
              }
              .content {
                padding: 30px 20px;
                text-align: center;
                color: #F9F9F9;
              }
              h1 {
                color: #E5C07B;
                font-size: 28px;
                margin-bottom: 30px;
              }
              .message {
                background-color: #131313;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid #4C4C4C;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #9A9A9A;
                font-size: 12px;
                border-top: 1px solid #4C4C4C;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="${LOGO_URL}" alt="Nex Pay Logo" class="logo">
                <span class="company-name">Nex Pay</span>
              </div>
              <div class="content">
                <h1>Password Reset Instructions</h1>
                <div class="message">
                  <p>We've sent you a password reset email from Firebase.</p>
                  <p>Please check your email inbox and follow the instructions to reset your password.</p>
                  <p>If you don't see the email, please check your spam folder.</p>
                </div>
              </div>
              <div class="footer">
                <p>This is an automated message, please do not reply.</p>
                <p>© ${new Date().getFullYear()} Nex Pay. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
}
