"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { getDocument, updateDocument } from "@/lib/api";
import type { Document, Tag } from "@/lib/documents";
import type { Block } from "@blocknote/core";



const Editor = dynamic(() => import("./Editor"), { ssr: false });

const EMOJI_OPTIONS = ["📄", "📝", "📌", "💡", "🚀", "🎯", "🔖", "📊", "🗒️", "✅", "🌟", "🔥"];

const FONTS = [
  { key: "default", label: "Sans", style: "system-ui, sans-serif" },
  { key: "serif", label: "Serif", style: "Georgia, serif" },
  { key: "mono", label: "Mono", style: "'Courier New', monospace" },
];

const FONT_SIZES = [
  { key: "small", label: "S", style: "13px" },
  { key: "medium", label: "M", style: "15px" },
  { key: "large", label: "L", style: "18px" },
  { key: "xlarge", label: "XL", style: "21px" },
];

type Props = {
  selectedId: string | null;
  allTags: Tag[];
  onTitleChange: (id: string, title: string) => void;
  onTagsChange: (id: string, tags: Tag[]) => void;
  onSendToAI: (text: string) => void;
  globalFont: string;
  onFontChange: (font: string) => void;
  globalFontSize: string;
  onFontSizeChange: (size: string) => void;
};

export default function MainContent({
  selectedId,
  allTags,
  onTitleChange,
  onTagsChange,
  onSendToAI,
  globalFont,
  onFontChange,
  globalFontSize,
  onFontSizeChange,
}: Props) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!selectedId) { setDoc(null); return; }
    setLoading(true);
    getDocument(selectedId)
      .then(setDoc)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedId]);

  // Close pickers on outside click
  useEffect(() => {
    const handler = () => { setShowEmojiPicker(false); setShowTagPicker(false); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const scheduleSave = useCallback(
    (id: string, data: Parameters<typeof updateDocument>[1]) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateDocument(id, data).catch(console.error);
      }, 800);
    },
    []
  );

  const handleTitleChange = (value: string) => {
    if (!doc) return;
    setDoc((d) => d ? { ...d, title: value } : d);
    onTitleChange(doc.id, value);
    scheduleSave(doc.id, { title: value });
  };

  const handleContentChange = (blocks: Block[]) => {
    if (!doc) return;
    scheduleSave(doc.id, { content: blocks });
  };

  const handleEmojiChange = (emoji: string) => {
    if (!doc) return;
    setDoc((d) => d ? { ...d, emoji } : d);
    setShowEmojiPicker(false);
    updateDocument(doc.id, { emoji }).catch(console.error);
  };

  const handleFontChange = (fontKey: string) => {
    onFontChange(fontKey);
  };

  const handleTagToggle = (tag: Tag) => {
    if (!doc) return;
    const has = doc.tags.some((t) => t.id === tag.id);
    const newTags = has ? doc.tags.filter((t) => t.id !== tag.id) : [...doc.tags, tag];
    setDoc((d) => d ? { ...d, tags: newTags } : d);
    onTagsChange(doc.id, newTags);
    updateDocument(doc.id, { tagIds: newTags.map((t) => t.id) }).catch(console.error);
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
      <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
    );
  }

  if (!doc) return null;

  const currentFont = FONTS.find((f) => f.key === globalFont) ?? FONTS[0];
  const currentSize = FONT_SIZES.find((s) => s.key === globalFontSize) ?? FONT_SIZES[1];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Document header */}
      <div className="px-16 pt-10 pb-3 space-y-3">
        {/* Emoji picker */}
        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => { setShowEmojiPicker((v) => !v); setShowTagPicker(false); }}
            className="text-4xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-1 py-0.5 transition"
            title="Change icon"
          >
            {doc.emoji}
          </button>
          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2 grid grid-cols-6 gap-1">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => handleEmojiChange(e)}
                  className={`text-xl w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition ${doc.emoji === e ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <input
          className="w-full text-4xl font-bold bg-transparent outline-none placeholder-gray-300 dark:placeholder-gray-600"
          value={doc.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
          style={{ fontFamily: currentFont.style }}
        />

        {/* Font + Tags toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Font selector */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {FONTS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFontChange(f.key)}
                className={`text-xs px-2.5 py-1 rounded-md transition ${
                  globalFont === f.key
                    ? "bg-white dark:bg-gray-600 shadow-sm font-medium text-gray-900 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
                style={{ fontFamily: f.style }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Size selector */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {FONT_SIZES.map((s) => (
              <button
                key={s.key}
                onClick={() => onFontSizeChange(s.key)}
                className={`text-xs px-2.5 py-1 rounded-md transition ${
                  globalFontSize === s.key
                    ? "bg-white dark:bg-gray-600 shadow-sm font-medium text-gray-900 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {doc.tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag)}
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition hover:opacity-80"
                style={{ borderColor: tag.color, color: tag.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                {tag.name}
                <span className="ml-0.5 opacity-60 text-[10px]">✕</span>
              </button>
            ))}

            {/* Add tag */}
            {allTags.length > 0 && (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => { setShowTagPicker((v) => !v); setShowEmojiPicker(false); }}
                  className="text-xs px-2 py-0.5 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  + tag
                </button>
                {showTagPicker && (
                  <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2 min-w-36 space-y-0.5">
                    {allTags.map((tag) => {
                      const active = doc.tags.some((t) => t.id === tag.id);
                      return (
                        <button
                          key={tag.id}
                          onClick={() => handleTagToggle(tag)}
                          className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition ${active ? "font-medium" : ""}`}
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                          <span className="text-gray-700 dark:text-gray-300">{tag.name}</span>
                          {active && <span className="ml-auto text-[10px] text-gray-400">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-b border-gray-100 dark:border-gray-800" />
      </div>

      {/* Editor */}
      <div className="flex-1 px-12 overflow-y-auto min-h-0">
        <Editor
          key={doc.id}
          initialContent={(doc.content as Block[] | null) ?? undefined}
          onChange={handleContentChange}
          fontFamily={currentFont.style}
          fontSize={currentSize.style}
        />
      </div>

      {/* AI quick actions */}
      <div className="px-16 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
        <span className="text-xs text-gray-400">Ask AI:</span>
        <button
          onClick={() => onSendToAI(doc.title)}
          className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Improve title
        </button>
        <button
          onClick={() => onSendToAI(doc.title)}
          className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Summarize page
        </button>
      </div>
    </div>
  );
}
