"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong");
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-1">NoteFlow</h1>
        <p className="text-center text-gray-500 mb-8">Reset your password</p>

        {sent ? (
          <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
            <p className="text-2xl mb-3">📧</p>
            <p className="font-medium mb-2">Check your email</p>
            <p className="text-sm text-gray-500 mb-6">
              If an account exists for <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>, we sent a reset link. It expires in 1 hour.
            </p>
            <Link href="/login" className="text-sm text-black dark:text-white font-medium underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email address</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Remember your password?{" "}
              <Link href="/login" className="text-black dark:text-white font-medium underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
