import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const TAG_SELECT = { select: { tag: { select: { id: true, name: true, color: true } } } };

function flattenTags<T extends { tags: { tag: { id: string; name: string; color: string } }[] }>(doc: T) {
  const { tags, ...rest } = doc;
  return { ...rest, tags: tags.map((dt) => dt.tag) };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("tagId");

    const documents = await prisma.document.findMany({
      where: {
        ...(session ? { userId: session.userId } : { userId: null }),
        ...(tagId ? { tags: { some: { tagId } } } : {}),
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        emoji: true,
        updatedAt: true,
        tags: TAG_SELECT,
      },
    });

    return Response.json(documents.map(flattenTags));
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
    select: {
      id: true,
      title: true,
      emoji: true,
      content: true,
      fontFamily: true,
      updatedAt: true,
      tags: TAG_SELECT,
    },
  });
  return Response.json(flattenTags(doc), { status: 201 });
}
