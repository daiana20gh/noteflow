import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ fontFamily: "default", fontSize: "medium" });
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { fontFamily: true, fontSize: true },
  });
  return Response.json({
    fontFamily: user?.fontFamily ?? "default",
    fontSize: user?.fontSize ?? "16",
  });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const data: { fontFamily?: string; fontSize?: string } = {};
  if (body.fontFamily !== undefined) data.fontFamily = body.fontFamily;
  if (body.fontSize !== undefined) data.fontSize = body.fontSize;
  await prisma.user.update({ where: { id: session.userId }, data });
  return Response.json(data);
}
