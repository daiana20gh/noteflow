import { getSession } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
    bg: "bg-violet-100 dark:bg-violet-950/50",
    text: "text-violet-700 dark:text-violet-300",
    title: "Write anything",
    desc: "Rich text editor with headings, lists, checkboxes and more",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    bg: "bg-amber-100 dark:bg-amber-950/50",
    text: "text-amber-700 dark:text-amber-300",
    title: "AI assistant",
    desc: "Improve, summarize, expand or fix your writing with one click",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
    bg: "bg-emerald-100 dark:bg-emerald-950/50",
    text: "text-emerald-700 dark:text-emerald-300",
    title: "Ready templates",
    desc: "Meeting notes, journals, to-do lists and more to get you started",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
      </svg>
    ),
    bg: "bg-sky-100 dark:bg-sky-950/50",
    text: "text-sky-700 dark:text-sky-300",
    title: "Save to the cloud",
    desc: "Sign in to sync your documents across all your devices",
  },
];

const TEMPLATE_PREVIEWS = [
  { name: "Todo List", image: "/templates/todo.png", imgClass: "object-cover object-center", grad: "from-emerald-50 to-green-100 dark:from-emerald-950/40 dark:to-green-950/40" },
  { name: "Journal", image: "/templates/weekly.png", imgClass: "object-cover object-center", grad: "from-violet-50 to-purple-100 dark:from-violet-950/10 dark:to-purple-950/10" },
  { name: "Meeting Notes", image: "/templates/meeting.png", imgClass: "object-cover object-center", grad: "from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40" },
  { name: "Project Plan", image: "/templates/project.png", imgClass: "object-cover object-center", grad: "from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40" },
  { name: "Study Notes", image: "/templates/study.png", imgClass: "object-cover object-center", grad: "from-rose-50 to-pink-100 dark:from-rose-950/40 dark:to-pink-950/40" },
  { name: "Blank Page", image: "/templates/blank.png", imgClass: "object-cover object-[center_30%]", grad: "from-gray-50 to-slate-100 dark:from-gray-900/60 dark:to-slate-900/60" },
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
              <div className={`w-12 h-12 ${f.bg} ${f.text} rounded-xl flex items-center justify-center mb-4`}>
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
                <div className="relative w-full h-44 overflow-hidden">
                  <Image src={t.image} alt={t.name} fill sizes="(max-width: 640px) 50vw, 33vw" className={t.imgClass} />
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
