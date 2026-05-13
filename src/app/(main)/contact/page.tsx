"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8 max-w-xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-1">Contact Us</h1>
      <p className="text-gray-500 mb-8">Have a question or feedback? We&apos;d love to hear from you.</p>

      {status === "success" ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
          <p className="text-4xl mb-3">✉️</p>
          <p className="font-semibold text-green-800 dark:text-green-300">Message sent!</p>
          <p className="text-sm text-green-700 dark:text-green-400 mt-1">We&apos;ll get back to you soon.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 text-sm underline text-green-700 dark:text-green-400"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              rows={5}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:ring-1 focus:ring-gray-400 resize-none"
              placeholder="Write your message here..."
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              required
            />
          </div>
          {status === "error" && (
            <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium disabled:opacity-50"
          >
            {status === "loading" ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
