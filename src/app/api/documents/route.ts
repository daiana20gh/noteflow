import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    const documents = await prisma.document.findMany({
      where: session ? { userId: session.userId } : { userId: null },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, updatedAt: true },
    });
    return Response.json(documents);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("GET /api/documents error:", msg);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  const body = await request.json().catch(() => ({}));
  const doc = await prisma.document.create({
    data: {
      title: body.title ?? "Untitled",
      content: body.content ?? undefined,
      userId: session?.userId ?? null,
    },
  });
  return Response.json(doc, { status: 201 });
}
