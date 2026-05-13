"use client";

import type { DocumentSummary } from "@/lib/documents";

type Props = {
  documents: DocumentSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
};

export default function Sidebar({
  documents,
  selectedId,
  onSelect,
  onNew,
  onDelete,
}: Props) {
  return (
    <div className="w-64 h-full bg-white dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold">NoteFlow</h2>
      </div>

      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Pages
        </span>
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
          <p className="text-xs text-gray-400 px-2 py-3">No pages yet</p>
        )}
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`group flex items-center justify-between rounded-md px-2 py-1.5 cursor-pointer text-sm ${
              selectedId === doc.id
                ? "bg-gray-100 dark:bg-gray-800 font-medium"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => onSelect(doc.id)}
          >
            <span className="truncate">
              {doc.title || "Untitled"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(doc.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs px-1"
              title="Delete"
            >
              ✕
            </button>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-400">NoteFlow</p>
      </div>
    </div>
  );
}
