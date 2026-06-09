import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

const TAG_SELECT = { select: { tag: { select: { id: true, name: true, color: true } } } };

function flattenTags<T extends { tags: { tag: { id: string; name: string; color: string } }[] }>(doc: T) {
  const { tags, ...rest } = doc;
  return { ...rest, tags: tags.map((dt) => dt.tag) };
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const doc = await prisma.document.findUnique({
    where: { id },
    include: { tags: TAG_SELECT },
  });
  if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(flattenTags(doc));
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const body = await request.json();

  if (body.tagIds !== undefined) {
    await prisma.documentTag.deleteMany({ where: { documentId: id } });
    if (body.tagIds.length > 0) {
      await prisma.documentTag.createMany({
        data: (body.tagIds as string[]).map((tagId) => ({ documentId: id, tagId })),
      });
    }
  }

  const doc = await prisma.document.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.fontFamily !== undefined && { fontFamily: body.fontFamily }),
      ...(body.emoji !== undefined && { emoji: body.emoji }),
      ...(body.color !== undefined && { color: body.color }),
    },
    include: { tags: TAG_SELECT },
  });

  return Response.json(flattenTags(doc));
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await prisma.document.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
