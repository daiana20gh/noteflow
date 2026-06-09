"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createDocument } from "@/lib/api";

const TEMPLATES = [
  {
    id: "meeting-notes",
    icon: "📋",
    image: "/templates/meeting.jpg",
    name: "Meeting Notes",
    description: "Structure your meeting discussions and action items",
    grad: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    accent: "text-blue-700 dark:text-blue-300",
    content: [
      { id: "1", type: "heading", props: { level: 1, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Meeting Notes", styles: {} }], children: [] },
      { id: "2", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Date: ", styles: { bold: true } }, { type: "text", text: new Date().toLocaleDateString(), styles: {} }], children: [] },
      { id: "3", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Attendees", styles: {} }], children: [] },
      { id: "4", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Add attendees here", styles: {} }], children: [] },
      { id: "5", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Agenda", styles: {} }], children: [] },
      { id: "6", type: "numberedListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Topic 1", styles: {} }], children: [] },
      { id: "7", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Action Items", styles: {} }], children: [] },
      { id: "8", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Action item 1", styles: {} }], children: [] },
    ],
  },
  {
    id: "project-plan",
    icon: "📊",
    image: "/templates/project.jpg",
    name: "Project Plan",
    description: "Plan your project milestones and deliverables",
    content: [
      { id: "1", type: "heading", props: { level: 1, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Project Plan", styles: {} }], children: [] },
      { id: "2", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Overview", styles: {} }], children: [] },
      { id: "3", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Describe your project here...", styles: {} }], children: [] },
      { id: "4", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Goals", styles: {} }], children: [] },
      { id: "5", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Goal 1", styles: {} }], children: [] },
      { id: "6", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Milestones", styles: {} }], children: [] },
      { id: "7", type: "numberedListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Milestone 1 — ", styles: { bold: true } }, { type: "text", text: "Due date", styles: {} }], children: [] },
    ],
  },
  {
    id: "weekly-journal",
    icon: "📓",
    image: "/templates/journal.jpg",
    name: "Weekly Journal",
    description: "Reflect on your week and plan ahead",
    content: [
      { id: "1", type: "heading", props: { level: 1, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Weekly Journal", styles: {} }], children: [] },
      { id: "2", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "What went well ✅", styles: {} }], children: [] },
      { id: "3", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "...", styles: {} }], children: [] },
      { id: "4", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "What could be improved 🔧", styles: {} }], children: [] },
      { id: "5", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "...", styles: {} }], children: [] },
      { id: "6", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Next week goals 🎯", styles: {} }], children: [] },
      { id: "7", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Goal 1", styles: {} }], children: [] },
    ],
  },
  {
    id: "todo-list",
    icon: "✅",
    image: "/templates/todo.jpg",
    name: "Todo List",
    description: "Keep track of tasks and priorities",
    content: [
      { id: "1", type: "heading", props: { level: 1, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Todo List", styles: {} }], children: [] },
      { id: "2", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "High Priority", styles: {} }], children: [] },
      { id: "3", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Task 1", styles: {} }], children: [] },
      { id: "4", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Medium Priority", styles: {} }], children: [] },
      { id: "5", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Task 2", styles: {} }], children: [] },
      { id: "6", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Low Priority", styles: {} }], children: [] },
      { id: "7", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Task 3", styles: {} }], children: [] },
    ],
  },
  {
    id: "study-notes",
    icon: "📚",
    image: "/templates/study.jpg",
    name: "Study Notes",
    description: "Organize your learning and key concepts",
    content: [
      { id: "1", type: "heading", props: { level: 1, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Study Notes", styles: {} }], children: [] },
      { id: "2", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Key Concepts", styles: {} }], children: [] },
      { id: "3", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Concept 1", styles: {} }], children: [] },
      { id: "4", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Summary", styles: {} }], children: [] },
      { id: "5", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Write your summary here...", styles: {} }], children: [] },
      { id: "6", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Questions to Review", styles: {} }], children: [] },
      { id: "7", type: "numberedListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Question 1?", styles: {} }], children: [] },
    ],
  },
  {
    id: "blank",
    icon: "📄",
    image: "/templates/blank.jpg",
    name: "Blank Page",
    description: "Start from scratch with an empty page",
    content: [],
  },
];

const TEMPLATE_COLORS: Record<string, { grad: string; text: string }> = {
  "meeting-notes": {
    grad: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    text: "text-blue-700 dark:text-blue-300",
  },
  "project-plan": {
    grad: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    text: "text-amber-700 dark:text-amber-300",
  },
  "weekly-journal": {
    grad: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
    text: "text-violet-700 dark:text-violet-300",
  },
  "todo-list": {
    grad: "from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  "study-notes": {
    grad: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30",
    text: "text-rose-700 dark:text-rose-300",
  },
  blank: {
    grad: "from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50",
    text: "text-gray-600 dark:text-gray-400",
  },
};

export default function TemplatesPage() {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUseTemplate = async (template: typeof TEMPLATES[0]) => {
    if (loadingId) return;
    setLoadingId(template.id);
    try {
      const doc = await createDocument(template.name === "Blank Page" ? "Untitled" : template.name);
      if (template.content.length > 0) {
        await fetch(`/api/documents/${doc.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: template.content }),
        });
      }
      router.push(`/documents?id=${doc.id}`);
    } catch (e) {
      console.error("Failed to create template:", e);
      alert("Could not create the page. Please try again.");
      setLoadingId(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-1">Templates</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Pick a template to get started quickly.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((t) => {
          const colors = TEMPLATE_COLORS[t.id] ?? TEMPLATE_COLORS.blank;
          return (
            <button
              key={t.id}
              onClick={() => handleUseTemplate(t)}
              disabled={loadingId !== null}
              className={`bg-gradient-to-br ${colors.grad} rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden text-left hover:scale-[1.02] hover:shadow-md transition group disabled:opacity-60 disabled:cursor-wait`}
            >
              <div className="relative w-full h-36">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className={`font-semibold ${colors.text} group-hover:underline`}>
                  {loadingId === t.id ? "Creating…" : t.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
