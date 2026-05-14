"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Block } from "@blocknote/core";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const STORAGE_KEY = "noteflow-guest-doc";

export default function GuestEditor() {
  const [title, setTitle] = useState("My first note");
  const [saved, setSaved] = useState(false);
  const [initialContent, setInitialContent] = useState<Block[] | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.content?.length) setInitialContent(parsed.content);
      }
    } catch {}
    setLoaded(true);
  }, []);

  const persist = useCallback((updates: { title?: string; content?: Block[] }) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const prev = stored ? JSON.parse(stored) : {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prev, ...updates }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    persist({ title: value });
  };

  const handleContentChange = useCallback(
    (blocks: Block[]) => persist({ content: blocks }),
    [persist]
  );

  if (!loaded) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span>✨</span> NoteFlow
        </Link>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-emerald-500 font-medium">Saved locally ✓</span>}
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-black dark:hover:text-white transition"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition font-medium"
          >
            Save to cloud →
          </Link>
        </div>
      </header>

      {/* Guest banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-6 py-2.5 text-sm text-amber-700 dark:text-amber-300 text-center">
        You&apos;re in guest mode — notes are saved in this browser only.{" "}
        <Link href="/register" className="font-semibold underline hover:no-underline">
          Create a free account
        </Link>{" "}
        to sync across devices.
      </div>

      {/* Editor */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-8 py-10">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
          className="w-full text-4xl font-bold bg-transparent border-none outline-none mb-6 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700"
        />
        <Editor initialContent={initialContent} onChange={handleContentChange} />
      </div>
    </div>
  );
}
