"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  userName: string;
};

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/documents", label: "Documents" },
  { href: "/templates", label: "Templates" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ userName }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <nav className="h-14 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-4 shrink-0 z-50">
      <Link href="/dashboard" className="text-lg font-bold mr-4 shrink-0">
        NoteFlow
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-1 flex-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-md text-sm transition ${
              pathname.startsWith(link.href)
                ? "bg-gray-100 dark:bg-gray-800 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-3 ml-auto">
        <span className="text-sm text-gray-500">{userName}</span>
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Log out
        </button>
      </div>

      {/* Burger button */}
      <button
        className="md:hidden ml-auto p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200" />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-2 shadow-lg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-md text-sm ${
                pathname.startsWith(link.href)
                  ? "bg-gray-100 dark:bg-gray-800 font-medium"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-gray-200 dark:border-gray-700" />
          <span className="text-sm text-gray-500 px-3">{userName}</span>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-left"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}
