import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await prisma.tag.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
