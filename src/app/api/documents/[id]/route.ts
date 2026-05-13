import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(doc);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const body = await request.json();
  const doc = await prisma.document.update({
    where: { id },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return Response.json(doc);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await prisma.document.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
