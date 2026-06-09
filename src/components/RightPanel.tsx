"use client";

import { useState, useEffect } from "react";
import { aiComplete } from "@/lib/api";

type Props = {
  initialText: string;
  onTextConsumed: () => void;
  onClose: () => void;
};

const ACTIONS = [
  { key: "improve", label: "Improve" },
  { key: "summarize", label: "Summarize" },
  { key: "expand", label: "Expand" },
  { key: "fix", label: "Fix grammar" },
  { key: "continue", label: "Continue" },
];

export default function RightPanel({ initialText, onTextConsumed, onClose }: Props) {
  const [input, setInput] = useState("");
  const [action, setAction] = useState("improve");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialText) {
      setInput(initialText);
      onTextConsumed();
    }
  }, [initialText, onTextConsumed]);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await aiComplete(input, action);
      setResult(res);
    } catch {
      setResult("Error: could not reach AI. Check your GROQ_API_KEY.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 top-4 bottom-4 w-80 bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-base">✨</span>
          <h3 className="font-semibold text-sm">AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Action pills */}
      <div className="px-4 pt-3 pb-2 flex flex-wrap gap-1.5">
        {ACTIONS.map((a) => (
          <button
            key={a.key}
            onClick={() => setAction(a.key)}
            className={`text-xs px-3 py-1 rounded-full border transition ${
              action === a.key
                ? "bg-violet-600 text-white border-violet-600"
                : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex-1 flex flex-col px-4 pb-4 gap-3 min-h-0">
        <textarea
          className="flex-1 w-full resize-none text-sm bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-500 transition min-h-0"
          placeholder="Paste or type text here…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleRun}
          disabled={loading || !input.trim()}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium disabled:opacity-40 transition"
        >
          {loading ? "Thinking…" : "Run"}
        </button>

        {result && (
          <div className="overflow-y-auto rounded-xl bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 p-3 text-sm whitespace-pre-wrap max-h-48">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
