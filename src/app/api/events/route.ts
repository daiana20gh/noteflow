import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month"); // "YYYY-MM"

  const events = await prisma.calendarEvent.findMany({
    where: {
      userId: session?.userId ?? null,
      ...(month ? { date: { startsWith: month } } : {}),
    },
    orderBy: [{ date: "asc" }, { hour: "asc" }],
  });

  return Response.json(events);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  const body = await request.json();

  const event = await prisma.calendarEvent.create({
    data: {
      title: body.title,
      date: body.date,
      hour: body.hour,
      notes: body.notes ?? "",
      color: body.color ?? "#6366f1",
      userId: session?.userId ?? null,
    },
  });

  return Response.json(event, { status: 201 });
}
