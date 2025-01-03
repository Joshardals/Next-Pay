"use server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import nodemailer from "nodemailer";
import path from "path";

export async function sendVerificationCode(userId: string, email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await updateDoc(doc(db, "users", userId), {
    verificationCode: {
      code,
      expiresAt,
    },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const logoPath = path.join(process.cwd(), "public", "logo.png");

  await transporter.sendMail({
    from: '"Nex Pay" <noreply@nexpay.com>',
    to: email,
    subject: "Your Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
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
            .verification-code {
              font-size: 36px;
              font-weight: bold;
              color: #F9F9F9;
              padding: 20px;
              background-color: #131313;
              border-radius: 8px;
              margin: 20px 0;
              letter-spacing: 4px;
              border: 1px solid #4C4C4C;
            }
            .expiry-notice {
              color: #9A9A9A;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #9A9A9A;
              font-size: 12px;
              border-top: 1px solid #4C4C4C;
            }
            @media (max-width: 480px) {
              .company-name {
                font-size: 20px;
              }
              .verification-code {
                font-size: 28px;
                letter-spacing: 3px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:logo" alt="Nex Pay Logo" class="logo">
              <span class="company-name">Nex Pay</span>
            </div>
            <div class="content">
              <h1>Verification Code</h1>
              <div class="verification-code">${code}</div>
              <p class="expiry-notice">This code will expire in 10 minutes</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply.</p>
              <p>© ${new Date().getFullYear()} Nex Pay. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    attachments: [
      {
        filename: "logo.png",
        path: logoPath,
        cid: "logo",
      },
    ],
  });

  return true;
}
