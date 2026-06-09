"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { getDocument, updateDocument } from "@/lib/api";
import type { Document, Tag } from "@/lib/documents";
import type { Block } from "@blocknote/core";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

// ─── Inline constants ─────────────────────────────────────────────────────────

const EMOJI_OPTIONS = ["📄", "📝", "📌", "💡", "🚀", "🎯", "🔖", "📊", "🗒️", "✅", "🌟", "🔥"];

const DOC_COLORS = [
  { key: "none", value: "" },
  { key: "red", value: "#ef4444" },
  { key: "orange", value: "#f97316" },
  { key: "yellow", value: "#eab308" },
  { key: "green", value: "#22c55e" },
  { key: "blue", value: "#3b82f6" },
  { key: "violet", value: "#8b5cf6" },
  { key: "pink", value: "#ec4899" },
  { key: "teal", value: "#14b8a6" },
];

const FONTS = [
  { key: "default", label: "Sans", style: "system-ui, sans-serif" },
  { key: "serif", label: "Serif", style: "Georgia, serif" },
  { key: "mono", label: "Mono", style: "'Courier New', monospace" },
];

const FONT_SIZES = [
  { key: "12", label: "12", style: "12px" },
  { key: "14", label: "14", style: "14px" },
  { key: "16", label: "16", style: "16px" },
  { key: "18", label: "18", style: "18px" },
  { key: "20", label: "20", style: "20px" },
];

// ─── Small UI helpers ─────────────────────────────────────────────────────────

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative group/tt inline-flex shrink-0">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 text-[10px] bg-gray-900 dark:bg-gray-700 text-white rounded whitespace-nowrap opacity-0 group-hover/tt:opacity-100 transition-opacity z-50">
        {label}
      </span>
    </div>
  );
}

function RibbonBtn({
  onClick,
  active,
  children,
  className = "",
}: {
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()} // keep editor focus
      onClick={onClick}
      className={`h-7 min-w-[28px] px-1.5 rounded text-sm flex items-center justify-center transition select-none ${
        active
          ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function RibbonGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-end pr-3 mr-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 py-1">
      <div className="flex items-center gap-0.5 flex-wrap justify-center">{children}</div>
      <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1 leading-none">
        {label}
      </span>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  selectedId: string | null;
  allTags: Tag[];
  syncedTags: Tag[];
  onTitleChange: (id: string, title: string) => void;
  onTagsChange: (id: string, tags: Tag[]) => void;
  onSendToAI: (text: string) => void;
  showAI: boolean;
  onToggleAI: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MainContent({
  selectedId,
  allTags,
  syncedTags,
  onTitleChange,
  onTagsChange,
  onSendToAI,
  showAI,
  onToggleAI,
}: Props) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableHover, setTableHover] = useState({ rows: 0, cols: 0 });

  // Ribbon active state
  const [activeStyles, setActiveStyles] = useState<Record<string, any>>({});
  const [activeBlockType, setActiveBlockType] = useState("paragraph");
  const [activeBlockLevel, setActiveBlockLevel] = useState(0);
  const [activeFont, setActiveFont] = useState("default");
  const [activeFontSize, setActiveFontSize] = useState("16");
  const [activeAlign, setActiveAlign] = useState<"left" | "center" | "right">("left");

  const editorRef = useRef<any>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── load doc ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedId) { setDoc(null); return; }
    setLoading(true);
    getDocument(selectedId)
      .then(setDoc)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedId]);

  // ── subscribe to editor selection changes ─────────────────────────────────
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const tiptap = (editor as any)._tiptapEditor;
    if (!tiptap) return;

    const refresh = () => {
      try {
        setActiveStyles(editor.getActiveStyles());
        const pos = editor.getTextCursorPosition?.();
        if (pos?.block) {
          setActiveBlockType(pos.block.type);
          setActiveBlockLevel((pos.block.props as any)?.level ?? 0);
          setActiveAlign((pos.block.props as any)?.textAlignment ?? "left");
        }
      } catch {}
    };

    tiptap.on("selectionUpdate", refresh);
    tiptap.on("transaction", refresh);
    return () => {
      tiptap.off("selectionUpdate", refresh);
      tiptap.off("transaction", refresh);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.id]); // re-subscribe when document changes

  // ── close pickers on outside click ───────────────────────────────────────
  useEffect(() => {
    const handler = () => {
      setShowEmojiPicker(false);
      setShowColorPicker(false);
      setShowTagPicker(false);
      setShowTablePicker(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ── save ──────────────────────────────────────────────────────────────────
  const scheduleSave = useCallback(
    (id: string, data: Parameters<typeof updateDocument>[1]) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateDocument(id, data).catch(console.error);
      }, 800);
    },
    []
  );

  // ── handlers ─────────────────────────────────────────────────────────────
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

  const handleColorChange = (color: string) => {
    if (!doc) return;
    setDoc((d) => d ? { ...d, color } : d);
    setShowColorPicker(false);
    updateDocument(doc.id, { color }).catch(console.error);
  };

  // syncedTags always reflects the latest state from the parent (derived from documents list)
  const displayTags: Tag[] = syncedTags;

  const handleTagToggle = (tag: Tag) => {
    if (!doc) return;
    const has = displayTags.some((t) => t.id === tag.id);
    const newTags = has ? displayTags.filter((t) => t.id !== tag.id) : [...displayTags, tag];
    setDoc((d) => d ? { ...d, tags: newTags } : d);
    onTagsChange(doc.id, newTags);
    updateDocument(doc.id, { tagIds: newTags.map((t) => t.id) }).catch(console.error);
  };

  // ── ribbon actions ────────────────────────────────────────────────────────
  const applyInlineStyle = (styleKey: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    const current = editor.getActiveStyles?.() ?? {};
    editor.addStyles({ [styleKey]: !current[styleKey] } as any);
    editor.focus();
  };

  const handleFontChange = (fontKey: string) => {
    const font = FONTS.find((f) => f.key === fontKey) ?? FONTS[0];
    setActiveFont(fontKey);
    editorRef.current?.addStyles({ fontFamily: font.style });
    editorRef.current?.focus();
  };

  const handleFontSizeChange = (sizeKey: string) => {
    const size = FONT_SIZES.find((s) => s.key === sizeKey) ?? FONT_SIZES[2];
    setActiveFontSize(sizeKey);
    editorRef.current?.addStyles({ fontSize: size.style });
    editorRef.current?.focus();
  };

  const handleAlignChange = (align: "left" | "center" | "right") => {
    const editor = editorRef.current;
    if (!editor) return;
    setActiveAlign(align);
    const { block } = editor.getTextCursorPosition();
    editor.updateBlock(block, { props: { textAlignment: align } });
    editor.focus();
  };

  const handleBlockType = (type: string, level?: number) => {
    const editor = editorRef.current;
    if (!editor) return;
    const { block } = editor.getTextCursorPosition();
    if (type === "paragraph") {
      editor.updateBlock(block, { type: "paragraph" } as any);
    } else if (type === "heading") {
      editor.updateBlock(block, { type: "heading", props: { level } } as any);
    } else if (type === "bulletListItem") {
      editor.updateBlock(block, { type: "bulletListItem" } as any);
    } else if (type === "numberedListItem") {
      editor.updateBlock(block, { type: "numberedListItem" } as any);
    } else if (type === "checkListItem") {
      editor.updateBlock(block, { type: "checkListItem", props: { checked: false } } as any);
    }
    editor.focus();
  };

  const handleInsertTable = (rows: number, cols: number) => {
    const editor = editorRef.current;
    if (!editor) return;
    const emptyCell: any[] = [];
    const tableBlock = {
      type: "table",
      content: {
        type: "tableContent",
        rows: Array.from({ length: rows }, () => ({
          cells: Array.from({ length: cols }, () => emptyCell),
        })),
      },
    };
    try {
      const { block } = editor.getTextCursorPosition();
      editor.insertBlocks([tableBlock as any], block, "after");
      editor.focus();
    } catch (err) {
      console.error("Insert table failed:", err);
    }
    setShowTablePicker(false);
    setTableHover({ rows: 0, cols: 0 });
  };

  // ─────────────────────────────────────────────────────────────────────────
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
    return <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>;
  }
  if (!doc) return null;

  const isBold = !!activeStyles.bold;
  const isItalic = !!activeStyles.italic;
  const isUnderline = !!activeStyles.underline;
  const isStrike = !!(activeStyles.strike ?? activeStyles.strikethrough);
  const isHeading = activeBlockType === "heading";
  const isBullet = activeBlockType === "bulletListItem";
  const isNumbered = activeBlockType === "numberedListItem";
  const isCheck = activeBlockType === "checkListItem";

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

      {/* ── Document header ─────────────────────────────────────────────── */}
      <div className="px-16 pt-8 pb-3 space-y-2">
        {/* Emoji + Color */}
        <div className="flex items-center gap-2">
          <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
            {doc.emoji ? (
              <button
                onClick={() => { setShowEmojiPicker((v) => !v); setShowColorPicker(false); }}
                className="text-4xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-1 py-0.5 transition"
                title="Change icon"
              >
                {doc.emoji}
              </button>
            ) : (
              <button
                onClick={() => { setShowEmojiPicker((v) => !v); setShowColorPicker(false); }}
                className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-2 py-1.5 transition"
              >
                + Add icon
              </button>
            )}
            {showEmojiPicker && (
              <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2 w-56">
                {doc.emoji && (
                  <button
                    onClick={() => handleEmojiChange("")}
                    className="w-full text-left text-xs px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 mb-1.5 transition"
                  >
                    ✕ Remove icon
                  </button>
                )}
                <div className="grid grid-cols-6 gap-1">
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
              </div>
            )}
          </div>

          <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
            <Tooltip label="Page color">
              <button
                onClick={() => { setShowColorPicker((v) => !v); setShowEmojiPicker(false); }}
                className="w-7 h-7 rounded-full border-2 transition hover:scale-110"
                style={doc.color
                  ? { backgroundColor: doc.color, borderColor: doc.color }
                  : { borderColor: "#d1d5db", backgroundColor: "transparent" }}
              >
                {!doc.color && (
                  <span className="flex items-center justify-center w-full h-full text-gray-300 dark:text-gray-600 text-[10px]">●</span>
                )}
              </button>
            </Tooltip>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2">
                <div className="grid grid-cols-5 gap-1.5">
                  {DOC_COLORS.map((c) => (
                    <Tooltip key={c.key} label={c.key === "none" ? "No color" : c.key}>
                      <button
                        onClick={() => handleColorChange(c.value)}
                        className={`w-7 h-7 rounded-full border-2 transition hover:scale-110 ${
                          doc.color === c.value
                            ? "border-gray-700 dark:border-white scale-110"
                            : "border-transparent hover:border-gray-300"
                        } ${!c.value ? "bg-gray-100 dark:bg-gray-700 flex items-center justify-center" : ""}`}
                        style={c.value ? { backgroundColor: c.value } : {}}
                      >
                        {!c.value && <span className="text-gray-400 text-[9px]">✕</span>}
                      </button>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <input
          className="w-full text-4xl font-bold bg-transparent outline-none placeholder-gray-300 dark:placeholder-gray-600"
          value={doc.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
        />

        {/* Tags + AI */}
        <div className="flex items-center gap-2 flex-wrap">
          {displayTags.map((tag) => (
            <button
              key={tag.id}
              onClick={(e) => { e.stopPropagation(); handleTagToggle(tag); }}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition hover:opacity-80"
              style={{ borderColor: tag.color, color: tag.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
              {tag.name}
              <span className="ml-0.5 opacity-60 text-[10px]">✕</span>
            </button>
          ))}

          {allTags.length > 0 && (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowTagPicker((v) => !v); }}
                className="text-xs px-2 py-0.5 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                + tag
              </button>
              {showTagPicker && (
                <div
                  className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2 min-w-36 space-y-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {allTags.map((tag) => {
                    const active = displayTags.some((t) => t.id === tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={(e) => { e.stopPropagation(); handleTagToggle(tag); }}
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

          <button
            onClick={onToggleAI}
            className={`ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
              showAI
                ? "bg-violet-600 text-white border-violet-600"
                : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400"
            }`}
          >
            <span>✨</span> AI
          </button>
        </div>
      </div>

      {/* ── Ribbon toolbar ──────────────────────────────────────────────── */}
      <div className="border-y border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-black/20 px-4 overflow-x-auto">
        <div className="flex items-stretch h-[52px]">

          {/* Format: Bold / Italic / Underline / Strike */}
          <RibbonGroup label="Format">
            <Tooltip label="Bold">
              <RibbonBtn onClick={() => applyInlineStyle("bold")} active={isBold}>
                <span className="font-bold text-sm">B</span>
              </RibbonBtn>
            </Tooltip>
            <Tooltip label="Italic">
              <RibbonBtn onClick={() => applyInlineStyle("italic")} active={isItalic}>
                <span className="italic text-sm">I</span>
              </RibbonBtn>
            </Tooltip>
            <Tooltip label="Underline">
              <RibbonBtn onClick={() => applyInlineStyle("underline")} active={isUnderline}>
                <span className="underline text-sm">U</span>
              </RibbonBtn>
            </Tooltip>
            <Tooltip label="Strikethrough">
              <RibbonBtn onClick={() => applyInlineStyle("strike")} active={isStrike}>
                <span className="line-through text-sm">S</span>
              </RibbonBtn>
            </Tooltip>
          </RibbonGroup>

          {/* Block: Paragraph / H1 / H2 / H3 / Bullet / Numbered / Checklist */}
          <RibbonGroup label="Block">
            <Tooltip label="Paragraph">
              <RibbonBtn onClick={() => handleBlockType("paragraph")} active={activeBlockType === "paragraph"}>
                <span className="text-xs font-medium">¶</span>
              </RibbonBtn>
            </Tooltip>
            <Tooltip label="Heading 1">
              <RibbonBtn onClick={() => handleBlockType("heading", 1)} active={isHeading && activeBlockLevel === 1}>
                <span className="text-xs font-bold">H1</span>
              </RibbonBtn>
            </Tooltip>
            <Tooltip label="Heading 2">
              <RibbonBtn onClick={() => handleBlockType("heading", 2)} active={isHeading && activeBlockLevel === 2}>
                <span className="text-xs font-bold">H2</span>
              </RibbonBtn>
            </Tooltip>
            <Tooltip label="Heading 3">
              <RibbonBtn onClick={() => handleBlockType("heading", 3)} active={isHeading && activeBlockLevel === 3}>
                <span className="text-xs font-bold">H3</span>
              </RibbonBtn>
            </Tooltip>
            <Tooltip label="Bullet list">
              <RibbonBtn onClick={() => handleBlockType("bulletListItem")} active={isBullet}>
                <span className="text-sm">•≡</span>
              </RibbonBtn>
            </Tooltip>
            <Tooltip label="Numbered list">
              <RibbonBtn onClick={() => handleBlockType("numberedListItem")} active={isNumbered}>
                <span className="text-xs">1≡</span>
              </RibbonBtn>
            </Tooltip>
            <Tooltip label="Checklist">
              <RibbonBtn onClick={() => handleBlockType("checkListItem")} active={isCheck}>
                <span className="text-xs">☑</span>
              </RibbonBtn>
            </Tooltip>
          </RibbonGroup>

          {/* Font family */}
          <RibbonGroup label="Font">
            {FONTS.map((f) => (
              <Tooltip key={f.key} label={f.label + " font"}>
                <RibbonBtn onClick={() => handleFontChange(f.key)} active={activeFont === f.key} className="text-xs">
                  <span style={{ fontFamily: f.style }}>{f.label}</span>
                </RibbonBtn>
              </Tooltip>
            ))}
          </RibbonGroup>

          {/* Font size */}
          <RibbonGroup label="Size">
            {FONT_SIZES.map((s) => (
              <Tooltip key={s.key} label={s.label + "px"}>
                <RibbonBtn onClick={() => handleFontSizeChange(s.key)} active={activeFontSize === s.key} className="text-xs w-8">
                  {s.label}
                </RibbonBtn>
              </Tooltip>
            ))}
          </RibbonGroup>

          {/* Paragraph alignment */}
          <RibbonGroup label="Align">
            <Tooltip label="Align left">
              <RibbonBtn onClick={() => handleAlignChange("left")} active={activeAlign === "left"}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                  <rect x="0" y="0" width="13" height="2" rx="1"/><rect x="0" y="5" width="9" height="2" rx="1"/><rect x="0" y="10" width="11" height="2" rx="1"/>
                </svg>
              </RibbonBtn>
            </Tooltip>
            <Tooltip label="Align center">
              <RibbonBtn onClick={() => handleAlignChange("center")} active={activeAlign === "center"}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                  <rect x="0" y="0" width="13" height="2" rx="1"/><rect x="2" y="5" width="9" height="2" rx="1"/><rect x="1" y="10" width="11" height="2" rx="1"/>
                </svg>
              </RibbonBtn>
            </Tooltip>
            <Tooltip label="Align right">
              <RibbonBtn onClick={() => handleAlignChange("right")} active={activeAlign === "right"}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                  <rect x="0" y="0" width="13" height="2" rx="1"/><rect x="4" y="5" width="9" height="2" rx="1"/><rect x="2" y="10" width="11" height="2" rx="1"/>
                </svg>
              </RibbonBtn>
            </Tooltip>
          </RibbonGroup>

          {/* Insert: Table */}
          <RibbonGroup label="Insert">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <Tooltip label="Insert table">
                <RibbonBtn
                  onClick={(e) => { e.stopPropagation(); setShowTablePicker((v) => !v); }}
                  active={showTablePicker}
                >
                  <span className="text-xs">⊞ Table</span>
                </RibbonBtn>
              </Tooltip>
              {showTablePicker && (
                <div
                  className="absolute top-full left-0 mt-1 z-30 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3"
                  onClick={(e) => e.stopPropagation()}
                  onMouseLeave={() => setTableHover({ rows: 0, cols: 0 })}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {tableHover.rows > 0
                      ? `${tableHover.rows} × ${tableHover.cols} table`
                      : "Hover to select size"}
                  </p>
                  <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
                    {Array.from({ length: 6 }, (_, r) =>
                      Array.from({ length: 6 }, (_, c) => (
                        <button
                          key={`${r}-${c}`}
                          onMouseEnter={() => setTableHover({ rows: r + 1, cols: c + 1 })}
                          onClick={() => handleInsertTable(r + 1, c + 1)}
                          className={`w-5 h-5 border rounded-sm transition ${
                            r < tableHover.rows && c < tableHover.cols
                              ? "bg-violet-400 border-violet-500"
                              : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-violet-200"
                          }`}
                        />
                      ))
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 text-center">
                    Click to insert · Right-click table to edit
                  </p>
                </div>
              )}
            </div>
          </RibbonGroup>

        </div>
      </div>

      {/* ── Editor ──────────────────────────────────────────────────────── */}
      <div className="flex-1 px-12 overflow-y-auto min-h-0">
        <Editor
          key={doc.id}
          initialContent={(doc.content as Block[] | null) ?? undefined}
          onChange={handleContentChange}
          onEditorReady={(editor) => {
            editorRef.current = editor;
            // Force selection refresh after editor mounts
            setTimeout(() => {
              try {
                setActiveStyles(editor.getActiveStyles());
              } catch {}
            }, 100);
          }}
        />
      </div>

      {/* ── AI quick actions ─────────────────────────────────────────────── */}
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
