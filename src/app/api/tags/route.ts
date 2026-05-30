import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  const tags = await prisma.tag.findMany({
    where: { userId: session?.userId ?? null },
    orderBy: { createdAt: "asc" },
  });
  return Response.json(tags);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  const { name, color } = await request.json();
  const tag = await prisma.tag.create({
    data: {
      name,
      color: color ?? "#6366f1",
      userId: session?.userId ?? null,
    },
  });
  return Response.json(tag, { status: 201 });
}
