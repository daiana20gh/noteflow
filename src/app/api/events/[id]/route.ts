import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const body = await request.json();

  const event = await prisma.calendarEvent.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.color !== undefined && { color: body.color }),
      ...(body.hour !== undefined && { hour: body.hour }),
    },
  });

  return Response.json(event);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await prisma.calendarEvent.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
