"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
        <p className="text-red-500 mb-4">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-sm font-medium underline">
          Request a new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
      } else {
        setDone(true);
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
        <p className="text-2xl mb-3">✅</p>
        <p className="font-medium mb-2">Password updated</p>
        <p className="text-sm text-gray-500">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">New password</label>
        <input
          type="password"
          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:ring-1 focus:ring-gray-400"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
          minLength={8}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Confirm password</label>
        <input
          type="password"
          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:ring-1 focus:ring-gray-400"
          placeholder="••••••••"
          value={form.confirm}
          onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium disabled:opacity-50"
      >
        {loading ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-1">NoteFlow</h1>
        <p className="text-center text-gray-500 mb-8">Set a new password</p>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/login" className="text-black dark:text-white font-medium underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
