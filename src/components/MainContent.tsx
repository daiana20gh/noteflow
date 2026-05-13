"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { getDocument, updateDocument } from "@/lib/api";
import type { Document } from "@/lib/documents";
import type { Block } from "@blocknote/core";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

type Props = {
  selectedId: string | null;
  onTitleChange: (id: string, title: string) => void;
  onSendToAI: (text: string) => void;
};

export default function MainContent({
  selectedId,
  onTitleChange,
  onSendToAI,
}: Props) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!selectedId) {
      setDoc(null);
      return;
    }
    setLoading(true);
    getDocument(selectedId)
      .then(setDoc)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedId]);

  const scheduleSave = useCallback(
    (id: string, data: { title?: string; content?: unknown }) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateDocument(id, data).catch(console.error);
      }, 800);
    },
    []
  );

  const handleTitleChange = (value: string) => {
    if (!doc) return;
    const updated = { ...doc, title: value };
    setDoc(updated);
    onTitleChange(doc.id, value);
    scheduleSave(doc.id, { title: value });
  };

  const handleContentChange = (blocks: Block[]) => {
    if (!doc) return;
    scheduleSave(doc.id, { content: blocks });
  };

  if (!selectedId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
        <p className="text-5xl mb-4">📄</p>
        <p className="text-lg font-medium">Select a page or create a new one</p>
        <p className="text-sm mt-1">Use the sidebar on the left</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!doc) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="px-16 pt-12 pb-4">
        <input
          className="w-full text-4xl font-bold bg-transparent outline-none placeholder-gray-300 dark:placeholder-gray-600"
          value={doc.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
        />
      </div>

      <div className="flex-1 px-12 overflow-y-auto min-h-0">
        <Editor
          key={doc.id}
          initialContent={(doc.content as Block[] | null) ?? undefined}
          onChange={handleContentChange}
        />
      </div>

      <div className="px-16 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
        <span className="text-xs text-gray-400">Ask AI:</span>
        <button
          onClick={() => onSendToAI(doc.title)}
          className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Improve title
        </button>
        <button
          onClick={() => {
            const text = doc.title;
            onSendToAI(text);
          }}
          className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Summarize page
        </button>
      </div>
    </div>
  );
}
