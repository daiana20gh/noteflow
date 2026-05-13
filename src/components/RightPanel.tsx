"use client";

import { useState, useEffect } from "react";
import { aiComplete } from "@/lib/api";

type Props = {
  initialText: string;
  onTextConsumed: () => void;
};

const ACTIONS = [
  { key: "improve", label: "Improve" },
  { key: "summarize", label: "Summarize" },
  { key: "expand", label: "Expand" },
  { key: "fix", label: "Fix grammar" },
  { key: "continue", label: "Continue" },
];

export default function RightPanel({ initialText, onTextConsumed }: Props) {
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
      setResult("Error: could not reach AI. Check your GROQ_API_KEY in .env.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-72 h-full bg-white dark:bg-[#111] border-l border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-sm">AI Assistant</h3>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
        <div className="flex flex-wrap gap-1">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              onClick={() => setAction(a.key)}
              className={`text-xs px-2 py-1 rounded-full border ${
                action === a.key
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-500"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <textarea
          className="flex-1 w-full resize-none text-sm bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none focus:ring-1 focus:ring-gray-400"
          placeholder="Paste or type text here…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleRun}
          disabled={loading || !input.trim()}
          className="w-full py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium disabled:opacity-40"
        >
          {loading ? "Thinking…" : "Run"}
        </button>

        {result && (
          <div className="overflow-y-auto max-h-52 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 p-3 text-sm whitespace-pre-wrap">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
