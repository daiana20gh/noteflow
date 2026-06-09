import { getSession } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  {
    icon: "✍️",
    bg: "bg-violet-100 dark:bg-violet-950/50",
    text: "text-violet-700 dark:text-violet-300",
    title: "Write anything",
    desc: "Rich text editor with headings, lists, checkboxes and more",
  },
  {
    icon: "🤖",
    bg: "bg-amber-100 dark:bg-amber-950/50",
    text: "text-amber-700 dark:text-amber-300",
    title: "AI assistant",
    desc: "Improve, summarize, expand or fix your writing with one click",
  },
  {
    icon: "📋",
    bg: "bg-emerald-100 dark:bg-emerald-950/50",
    text: "text-emerald-700 dark:text-emerald-300",
    title: "Ready templates",
    desc: "Meeting notes, journals, to-do lists and more to get you started",
  },
  {
    icon: "☁️",
    bg: "bg-sky-100 dark:bg-sky-950/50",
    text: "text-sky-700 dark:text-sky-300",
    title: "Save to the cloud",
    desc: "Sign in to sync your documents across all your devices",
  },
];

const TEMPLATE_PREVIEWS = [
  { name: "Todo List", image: "/templates/todo.jpg", grad: "from-emerald-50 to-green-100 dark:from-emerald-950/40 dark:to-green-950/40" },
  { name: "Journal", image: "/templates/weekly.jpg", imagePosition: "object-top", grad: "from-violet-50 to-purple-100 dark:from-gray-900 dark:to-gray-900" },
  { name: "Meeting Notes", image: "/templates/meeting.jpg", imagePosition: "object-[center_25%]", grad: "from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40" },
  { name: "Project Plan", image: "/templates/project.jpg", grad: "from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40" },
  { name: "Study Notes", image: "/templates/study.jpg", grad: "from-rose-50 to-pink-100 dark:from-rose-950/40 dark:to-pink-950/40" },
  { name: "Blank Page", image: "/templates/blank.jpg", imagePosition: "object-[center_25%]", grad: "from-gray-50 to-slate-100 dark:from-gray-900/60 dark:to-slate-900/60" },
];

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-100 dark:border-gray-900">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">✨</span>
          NoteFlow
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition"
            >
              Go to dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-gray-500 hover:text-black dark:hover:text-white transition"
              >
                Sign in
              </Link>
              <Link
                href="/try"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition"
              >
                Try it free →
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-24 pb-20 text-center">
        <span className="inline-block px-3 py-1 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-sm rounded-full font-medium mb-6">
          No sign-up required to get started ✨
        </span>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Your thoughts,{" "}
          <span className="text-violet-600 dark:text-violet-400">beautifully organized</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Write notes, plan your day, reflect on your week — NoteFlow makes it feel effortless.
          Start writing right now, no account needed.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/try"
            className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-lg font-semibold transition shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
          >
            Start writing for free
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl text-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
          >
            Create an account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:border-gray-200 dark:hover:border-gray-700 transition"
            >
              <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h3 className={`font-semibold mb-1 ${f.text}`}>{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates teaser */}
      <section className="bg-gray-50 dark:bg-gray-950 border-y border-gray-100 dark:border-gray-900 py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Jump-start with a template</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
            Ready-made templates for every occasion
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TEMPLATE_PREVIEWS.map((t) => (
              <Link
                key={t.name}
                href={session ? "/templates" : "/try"}
                className={`bg-gradient-to-br ${t.grad} rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:scale-[1.02] transition-transform`}
              >
                <div className="relative w-full h-28 overflow-hidden">
                  <Image src={t.image} alt={t.name} fill className={`object-cover ${t.imagePosition ?? "object-center"}`} />
                </div>
                <div className="p-4 text-center">
                  <span className="text-sm font-medium">{t.name}</span>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-center mt-8">
            <Link
              href={session ? "/templates" : "/register"}
              className="text-violet-600 dark:text-violet-400 font-medium hover:underline"
            >
              {session ? "Use templates →" : "Sign up to use all templates →"}
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-8 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get organized?</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Join NoteFlow and keep all your thoughts in one beautiful place.
        </p>
        <Link
          href="/register"
          className="inline-block px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-lg font-semibold transition"
        >
          Get started for free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-900 py-8 px-8 text-center text-sm text-gray-400">
        <p>Made with ♥ — NoteFlow {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
