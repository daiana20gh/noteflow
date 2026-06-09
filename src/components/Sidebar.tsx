"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { DocumentSummary, Tag } from "@/lib/documents";

const NAV = [
  { href: "/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/calendar", icon: "📅", label: "Calendar" },
  { href: "/templates", icon: "🎨", label: "Templates" },
  { href: "/contact", icon: "✉️", label: "Contact" },
];

const TAG_COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981",
  "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4",
];

type Props = {
  documents: DocumentSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  tags: Tag[];
  selectedTagId: string | null;
  onSelectTag: (id: string | null) => void;
  onCreateTag: (name: string, color: string) => void;
  onDeleteTag: (id: string) => void;
};

export default function Sidebar({
  documents,
  selectedId,
  onSelect,
  onNew,
  onDelete,
  tags,
  selectedTagId,
  onSelectTag,
  onCreateTag,
  onDeleteTag,
}: Props) {
  const pathname = usePathname();
  const [showTagForm, setShowTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmDeleteId) return;
    const handler = () => setConfirmDeleteId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [confirmDeleteId]);

  const handleCreateTag = () => {
    const name = newTagName.trim();
    if (!name) return;
    onCreateTag(name, newTagColor);
    setNewTagName("");
    setNewTagColor(TAG_COLORS[0]);
    setShowTagForm(false);
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <span className="text-lg font-bold">NoteFlow</span>
        </Link>
      </div>

      {/* Nav links */}
      <div className="px-2 py-2 border-b border-gray-100 dark:border-gray-800">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition ${
              pathname.startsWith(item.href)
                ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-medium"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <span className="text-sm">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Tags section */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-2">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tags</span>
          <button
            onClick={() => setShowTagForm((v) => !v)}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none"
            title="New tag"
          >
            +
          </button>
        </div>

        {showTagForm && (
          <div className="px-3 pb-2 flex flex-col gap-2">
            <input
              autoFocus
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreateTag(); if (e.key === "Escape") setShowTagForm(false); }}
              placeholder="Tag name"
              className="w-full text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] outline-none focus:ring-1 focus:ring-violet-400"
            />
            <div className="flex gap-1 flex-wrap">
              {TAG_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewTagColor(c)}
                  className={`w-5 h-5 rounded-full border-2 transition ${newTagColor === c ? "border-gray-800 dark:border-white scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={handleCreateTag}
                className="flex-1 text-xs py-1 rounded bg-violet-600 text-white hover:bg-violet-700"
              >
                Create
              </button>
              <button
                onClick={() => setShowTagForm(false)}
                className="flex-1 text-xs py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="px-2 space-y-0.5">
          {selectedTagId && (
            <button
              onClick={() => onSelectTag(null)}
              className="w-full text-left flex items-center gap-2 px-2 py-1 rounded text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕ Clear filter
            </button>
          )}
          {tags.map((tag) => (
            <div
              key={tag.id}
              className={`group flex items-center justify-between rounded-md px-2 py-1 cursor-pointer text-sm transition ${
                selectedTagId === tag.id
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
              onClick={() => onSelectTag(selectedTagId === tag.id ? null : tag.id)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                <span className="truncate text-xs text-gray-700 dark:text-gray-300">{tag.name}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteTag(tag.id); }}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 text-xs px-1 shrink-0"
                title="Delete tag"
              >
                ✕
              </button>
            </div>
          ))}
          {tags.length === 0 && !showTagForm && (
            <p className="text-xs text-gray-400 px-2 py-1">No tags yet</p>
          )}
        </div>
      </div>

      {/* Pages */}
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pages</span>
        <button
          onClick={onNew}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none"
          title="New page"
        >
          +
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {documents.length === 0 && (
          <p className="text-xs text-gray-400 px-2 py-3">
            {selectedTagId ? "No pages with this tag" : "No pages yet"}
          </p>
        )}
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`group flex items-center justify-between rounded-md px-2 py-1.5 cursor-pointer text-sm ${
              selectedId === doc.id
                ? "bg-gray-100 dark:bg-gray-800 font-medium"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
            style={doc.color ? { borderLeft: `3px solid ${doc.color}`, paddingLeft: "7px" } : {}}
            onClick={() => { setConfirmDeleteId(null); onSelect(doc.id); }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {doc.emoji ? (
                <span className="text-sm shrink-0">{doc.emoji}</span>
              ) : (
                <span className="text-sm shrink-0 opacity-30">📄</span>
              )}
              <span className="truncate">{doc.title || "Untitled"}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {doc.tags.slice(0, 2).map((t) => (
                <span key={t.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
              ))}
              {confirmDeleteId === doc.id ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => { onDelete(doc.id); setConfirmDeleteId(null); }}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-[10px] px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(doc.id); }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs px-1"
                  title="Delete"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-400">NoteFlow</p>
      </div>
    </div>
  );
}
