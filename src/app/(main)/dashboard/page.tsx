import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();

  const [totalDocs, recentDocs] = await Promise.all([
    prisma.document.count({ where: { userId: session!.userId } }),
    prisma.document.findMany({
      where: { userId: session!.userId },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: { id: true, title: true, updatedAt: true },
    }),
  ]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="h-full overflow-y-auto p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-1">
        {greeting}, {session!.name.split(" ")[0]} 👋
      </h1>
      <p className="text-gray-500 mb-8">Here&apos;s what&apos;s happening with your notes.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Documents</p>
          <p className="text-4xl font-bold">{totalDocs}</p>
        </div>
        <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <p className="text-sm text-gray-500 mb-1">Quick Actions</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Link
              href="/documents"
              className="text-sm px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg"
            >
              + New Document
            </Link>
            <Link
              href="/templates"
              className="text-sm px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </div>

      {/* Recent documents */}
      <h2 className="text-lg font-semibold mb-4">Recent Documents</h2>
      {recentDocs.length === 0 ? (
        <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-400">
          <p className="text-4xl mb-3">📄</p>
          <p>No documents yet.</p>
          <Link href="/documents" className="text-sm text-black dark:text-white underline mt-2 inline-block">
            Create your first one →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentDocs.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents?id=${doc.id}`}
              className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-gray-400 dark:hover:border-gray-600 transition group"
            >
              <p className="font-medium truncate group-hover:underline">{doc.title || "Untitled"}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(doc.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
