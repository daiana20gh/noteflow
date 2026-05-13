import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const link = `${baseUrl}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: `"NoteFlow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your NoteFlow account",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb">
        <h1 style="font-size:24px;font-weight:700;margin:0 0 4px">NoteFlow</h1>
        <p style="color:#6b7280;margin:0 0 24px">Confirm your email address</p>
        <p style="margin:0 0 8px">Hi ${name},</p>
        <p style="margin:0 0 24px;color:#374151">Click the button below to verify your email address and activate your account.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;border-radius:8px;text-decoration:none;font-weight:500">Verify my account</a>
        <p style="margin:24px 0 0;font-size:12px;color:#9ca3af">If you didn't create a NoteFlow account, you can safely ignore this email.</p>
      </div>
    `,
  });
}
