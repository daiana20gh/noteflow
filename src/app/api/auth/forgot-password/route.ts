import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to avoid leaking which emails are registered
  if (!user) {
    return Response.json({ message: "If that email exists, a reset link has been sent." });
  }

  const resetToken = randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { email },
    data: { resetToken, resetTokenExpiry },
  });

  await sendPasswordResetEmail(user.email, user.name, resetToken);

  return Response.json({ message: "If that email exists, a reset link has been sent." });
}
