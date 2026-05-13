import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Email already in use" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const verificationToken = randomBytes(32).toString("hex");

  const user = await prisma.user.create({
    data: { name, email, password: hashed, verificationToken },
  });

  await sendVerificationEmail(user.email, user.name, verificationToken);

  return Response.json({ message: "Check your email to verify your account" }, { status: 201 });
}
