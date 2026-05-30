"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/documents", icon: "📝", label: "Documents" },
  { href: "/calendar", icon: "📅", label: "Calendar" },
  { href: "/templates", icon: "🎨", label: "Templates" },
  { href: "/contact", icon: "✉️", label: "Contact" },
];

export default function AppSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // On the documents page the existing Sidebar handles navigation
  if (pathname.startsWith("/documents")) return null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-full bg-white dark:bg-[#111] border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="text-xl">✨</span>
          <span className="text-lg font-bold">NoteFlow</span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-1 flex flex-col gap-0.5">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
              pathname.startsWith(item.href)
                ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-xs font-bold text-violet-700 dark:text-violet-300 shrink-0">
            {userName[0].toUpperCase()}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{userName}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
