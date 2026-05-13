"use client";

import { useRouter } from "next/navigation";
import { createDocument } from "@/lib/api";

const TEMPLATES = [
  {
    id: "meeting-notes",
    icon: "📋",
    name: "Meeting Notes",
    description: "Structure your meeting discussions and action items",
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
    name: "Blank Page",
    description: "Start from scratch with an empty page",
    content: [],
  },
];

export default function TemplatesPage() {
  const router = useRouter();

  const handleUseTemplate = async (template: typeof TEMPLATES[0]) => {
    const doc = await createDocument(template.name === "Blank Page" ? "Untitled" : template.name);
    if (template.content.length > 0) {
      await fetch(`/api/documents/${doc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: template.content }),
      });
    }
    router.push(`/documents?id=${doc.id}`);
  };

  return (
    <div className="h-full overflow-y-auto p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-1">Templates</h1>
      <p className="text-gray-500 mb-8">Pick a template to get started quickly.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => handleUseTemplate(t)}
            className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-left hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-sm transition group"
          >
            <span className="text-3xl mb-3 block">{t.icon}</span>
            <p className="font-semibold group-hover:underline">{t.name}</p>
            <p className="text-sm text-gray-500 mt-1">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
