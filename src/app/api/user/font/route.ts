import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ fontFamily: "default" });
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { fontFamily: true },
  });
  return Response.json({ fontFamily: user?.fontFamily ?? "default" });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { fontFamily } = await request.json();
  await prisma.user.update({
    where: { id: session.userId },
    data: { fontFamily },
  });
  return Response.json({ fontFamily });
}
