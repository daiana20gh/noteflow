import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

const QUICK_START = [
  {
    name: "Todo List",
    image: "/templates/todo.png",
    href: "/templates",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  {
    name: "Journal",
    image: "/templates/weekly.png",
    imagePosition: "object-top",
    href: "/templates",
    bg: "bg-violet-50 dark:bg-violet-950/10 hover:bg-violet-100 dark:hover:bg-violet-950/20",
    text: "text-violet-700 dark:text-violet-300",
  },
  {
    name: "Meeting Notes",
    image: "/templates/meeting.png",
    imagePosition: "object-[center_25%]",
    href: "/templates",
    bg: "bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/60",
    text: "text-blue-700 dark:text-blue-300",
  },
  {
    name: "Project Plan",
    image: "/templates/project.png",
    href: "/templates",
    bg: "bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/60",
    text: "text-amber-700 dark:text-amber-300",
  },
];

const DOC_ACCENT = [
  "border-l-violet-400",
  "border-l-blue-400",
  "border-l-emerald-400",
  "border-l-amber-400",
  "border-l-rose-400",
  "border-l-sky-400",
];

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
  const greetingEmoji = hour < 12 ? "☀️" : hour < 18 ? "👋" : "🌙";

  return (
    <div className="h-full overflow-y-auto">
      {/* Gradient banner */}
      <div className="bg-gradient-to-r from-violet-600 to-violet-500 dark:from-violet-800 dark:to-violet-700 px-8 py-10">
        <h1 className="text-2xl font-bold text-white mb-1">
          {greeting}, {session!.name.split(" ")[0]} {greetingEmoji}
        </h1>
        <p className="text-violet-200 text-sm">What would you like to do today?</p>
      </div>

      <div className="p-6 max-w-5xl mx-auto w-full space-y-8">
        {/* Stats row — floats over the banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 -mt-6">
          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Your documents</p>
            <p className="text-3xl font-bold">{totalDocs}</p>
          </div>

          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">New note</p>
            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-xl transition font-medium"
            >
              + Create
            </Link>
          </div>

          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Templates</p>
            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm rounded-xl transition"
            >
              Browse →
            </Link>
          </div>
        </div>

        {/* Quick start */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Start
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_START.map((t) => (
              <Link
                key={t.name}
                href={t.href}
                className={`${t.bg} rounded-2xl overflow-hidden transition`}
              >
                <div className="relative w-full h-44 overflow-hidden">
                  <Image src={t.image} alt={t.name} fill className="object-contain object-top" />
                </div>
                <div className="p-3 text-center">
                  <span className={`text-xs font-semibold ${t.text}`}>{t.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent documents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Recent Documents
            </h2>
            {recentDocs.length > 0 && (
              <Link href="/documents" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">
                View all →
              </Link>
            )}
          </div>

          {recentDocs.length === 0 ? (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-gray-500 mb-2">No documents yet</p>
              <Link href="/documents" className="text-sm text-violet-600 dark:text-violet-400 hover:underline">
                Create your first document →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentDocs.map((doc, i) => (
                <Link
                  key={doc.id}
                  href={`/documents?id=${doc.id}`}
                  className={`bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 border-l-4 ${DOC_ACCENT[i % DOC_ACCENT.length]} p-5 hover:shadow-md transition group`}
                >
                  <p className="font-medium truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition">
                    {doc.title || "Untitled"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(doc.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
