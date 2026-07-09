"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createDocument } from "@/lib/api";

const TEMPLATES = [
  {
    id: "meeting-notes",
    icon: "📋",
    image: "/templates/meeting.png",
    name: "Meeting Notes",
    description: "Structure your meeting discussions and action items",
    content: [
      { id: "mn1", type: "heading", props: { level: 1, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Meeting Notes", styles: {} }], children: [] },
      { id: "mn2", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "📅  Date: ", styles: { bold: true } }, { type: "text", text: new Date().toLocaleDateString(), styles: {} }, { type: "text", text: "   ·   📍  Location: ", styles: { bold: true } }, { type: "text", text: "[location / video link]", styles: { italic: true } }], children: [] },
      { id: "mn3", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Attendees", styles: {} }], children: [] },
      { id: "mn4", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Name]", styles: { bold: true } }, { type: "text", text: " — [Role]", styles: {} }], children: [] },
      { id: "mn5", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Name]", styles: { bold: true } }, { type: "text", text: " — [Role]", styles: {} }], children: [] },
      { id: "mn6", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Agenda", styles: {} }], children: [] },
      { id: "mn7", type: "numberedListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Review previous action items", styles: {} }], children: [] },
      { id: "mn8", type: "numberedListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Topic 2]", styles: {} }], children: [] },
      { id: "mn9", type: "numberedListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Topic 3]", styles: {} }], children: [] },
      { id: "mn10", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Discussion Notes", styles: {} }], children: [] },
      { id: "mn11", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Key points discussed...", styles: { italic: true } }], children: [] },
      { id: "mn12", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Decision: ", styles: { bold: true } }, { type: "text", text: "[what was decided]", styles: { italic: true } }], children: [] },
      { id: "mn13", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Action Items", styles: {} }], children: [] },
      { id: "mn14", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Owner]: ", styles: { bold: true } }, { type: "text", text: "[Task] — due [date]", styles: {} }], children: [] },
      { id: "mn15", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Owner]: ", styles: { bold: true } }, { type: "text", text: "[Task] — due [date]", styles: {} }], children: [] },
      { id: "mn16", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Next Meeting", styles: {} }], children: [] },
      { id: "mn17", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Date & time: ", styles: { bold: true } }, { type: "text", text: "[date/time]   ·   ", styles: {} }, { type: "text", text: "Agenda: ", styles: { bold: true } }, { type: "text", text: "[planned topics]", styles: {} }], children: [] },
    ],
  },
  {
    id: "project-plan",
    icon: "📊",
    image: "/templates/project.png",
    name: "Project Plan",
    description: "Plan your project milestones and deliverables",
    content: [
      { id: "pp1", type: "heading", props: { level: 1, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Project Plan: ", styles: {} }, { type: "text", text: "[Project Name]", styles: { italic: true } }], children: [] },
      { id: "pp2", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Status: ", styles: { bold: true } }, { type: "text", text: "🟡 In Progress", styles: {} }, { type: "text", text: "   ·   Owner: ", styles: { bold: true } }, { type: "text", text: "[Name]", styles: {} }, { type: "text", text: "   ·   Deadline: ", styles: { bold: true } }, { type: "text", text: "[date]", styles: {} }], children: [] },
      { id: "pp3", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Overview", styles: {} }], children: [] },
      { id: "pp4", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Briefly describe the project, its purpose, and why it matters.", styles: { italic: true } }], children: [] },
      { id: "pp5", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Goals & Success Criteria", styles: {} }], children: [] },
      { id: "pp6", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Goal 1: ", styles: { bold: true } }, { type: "text", text: "measured by [metric]", styles: {} }], children: [] },
      { id: "pp7", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Goal 2: ", styles: { bold: true } }, { type: "text", text: "measured by [metric]", styles: {} }], children: [] },
      { id: "pp8", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Milestones", styles: {} }], children: [] },
      { id: "pp9", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Phase 1 — Discovery & Planning  ", styles: { bold: true } }, { type: "text", text: "[start → end]", styles: {} }], children: [] },
      { id: "pp10", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Phase 2 — Design & Prototype  ", styles: { bold: true } }, { type: "text", text: "[start → end]", styles: {} }], children: [] },
      { id: "pp11", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Phase 3 — Development  ", styles: { bold: true } }, { type: "text", text: "[start → end]", styles: {} }], children: [] },
      { id: "pp12", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Phase 4 — Testing & Review  ", styles: { bold: true } }, { type: "text", text: "[start → end]", styles: {} }], children: [] },
      { id: "pp13", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Phase 5 — Launch  ", styles: { bold: true } }, { type: "text", text: "[date]", styles: {} }], children: [] },
      { id: "pp14", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Stakeholders & Team", styles: {} }], children: [] },
      { id: "pp15", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Name]", styles: { bold: true } }, { type: "text", text: " — [Role / Responsibility]", styles: {} }], children: [] },
      { id: "pp16", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Risks & Mitigations", styles: {} }], children: [] },
      { id: "pp17", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Risk: ", styles: { bold: true } }, { type: "text", text: "[description]  →  ", styles: {} }, { type: "text", text: "Mitigation: ", styles: { bold: true } }, { type: "text", text: "[plan]", styles: {} }], children: [] },
      { id: "pp18", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Notes & Open Questions", styles: {} }], children: [] },
      { id: "pp19", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[question or note]", styles: { italic: true } }], children: [] },
    ],
  },
  {
    id: "weekly-journal",
    icon: "📓",
    image: "/templates/weekly.png",
    name: "Weekly Journal",
    description: "Reflect on your week, track habits, and plan ahead",
    content: [
      { id: "wj1", type: "heading", props: { level: 1, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Weekly Journal", styles: {} }], children: [] },
      { id: "wj2", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Week of: ", styles: { bold: true } }, { type: "text", text: new Date().toLocaleDateString(), styles: {} }, { type: "text", text: "   ·   Energy: ", styles: { bold: true } }, { type: "text", text: "⬜⬜⬜⬜⬜", styles: {} }, { type: "text", text: "   Mood: ", styles: { bold: true } }, { type: "text", text: "⬜⬜⬜⬜⬜", styles: {} }], children: [] },
      { id: "wj3", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Highlight of the Week 🌟", styles: {} }], children: [] },
      { id: "wj4", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "The best thing that happened this week was...", styles: { italic: true } }], children: [] },
      { id: "wj5", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "What Went Well ✅", styles: {} }], children: [] },
      { id: "wj6", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "...", styles: {} }], children: [] },
      { id: "wj7", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "...", styles: {} }], children: [] },
      { id: "wj8", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Challenges & Lessons Learned 🔧", styles: {} }], children: [] },
      { id: "wj9", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "...", styles: {} }], children: [] },
      { id: "wj10", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "...", styles: {} }], children: [] },
      { id: "wj11", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Gratitude 🙏", styles: {} }], children: [] },
      { id: "wj12", type: "numberedListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "...", styles: {} }], children: [] },
      { id: "wj13", type: "numberedListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "...", styles: {} }], children: [] },
      { id: "wj14", type: "numberedListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "...", styles: {} }], children: [] },
      { id: "wj15", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Goals for Next Week 🎯", styles: {} }], children: [] },
      { id: "wj16", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Goal 1]", styles: {} }], children: [] },
      { id: "wj17", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Goal 2]", styles: {} }], children: [] },
      { id: "wj18", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Goal 3]", styles: {} }], children: [] },
      { id: "wj19", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Habits Tracker", styles: {} }], children: [] },
      { id: "wj20", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Exercise / Move", styles: {} }], children: [] },
      { id: "wj21", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "8h sleep", styles: {} }], children: [] },
      { id: "wj22", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Read", styles: {} }], children: [] },
      { id: "wj23", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Drink 2L water", styles: {} }], children: [] },
      { id: "wj24", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Weekly Reflection", styles: {} }], children: [] },
      { id: "wj25", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "One word that describes this week: ", styles: { bold: true } }, { type: "text", text: "...", styles: {} }], children: [] },
    ],
  },
  {
    id: "todo-list",
    icon: "✅",
    image: "/templates/todo.png",
    name: "Todo List",
    description: "Prioritize tasks by urgency across today, this week, and backlog",
    content: [
      { id: "tl1", type: "heading", props: { level: 1, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Todo List", styles: {} }], children: [] },
      { id: "tl2", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Date: ", styles: { bold: true } }, { type: "text", text: new Date().toLocaleDateString(), styles: {} }], children: [] },
      { id: "tl3", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "🔥 Today — Urgent & Important", styles: {} }], children: [] },
      { id: "tl4", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Task 1]", styles: {} }], children: [] },
      { id: "tl5", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Task 2]", styles: {} }], children: [] },
      { id: "tl6", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "📅 This Week", styles: {} }], children: [] },
      { id: "tl7", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Task 1]", styles: {} }], children: [] },
      { id: "tl8", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Task 2]", styles: {} }], children: [] },
      { id: "tl9", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Task 3]", styles: {} }], children: [] },
      { id: "tl10", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "📌 Backlog", styles: {} }], children: [] },
      { id: "tl11", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Task 1]", styles: {} }], children: [] },
      { id: "tl12", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Task 2]", styles: {} }], children: [] },
      { id: "tl13", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "✅ Done", styles: {} }], children: [] },
      { id: "tl14", type: "checkListItem", props: { checked: true, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Completed task]", styles: {} }], children: [] },
    ],
  },
  {
    id: "study-notes",
    icon: "📚",
    image: "/templates/study.png",
    name: "Study Notes",
    description: "Capture key concepts, examples, and review questions",
    content: [
      { id: "sn1", type: "heading", props: { level: 1, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Study Notes: ", styles: {} }, { type: "text", text: "[Subject / Topic]", styles: { italic: true } }], children: [] },
      { id: "sn2", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Date: ", styles: { bold: true } }, { type: "text", text: new Date().toLocaleDateString(), styles: {} }, { type: "text", text: "   ·   Source: ", styles: { bold: true } }, { type: "text", text: "[book / lecture / website]", styles: { italic: true } }], children: [] },
      { id: "sn3", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Key Concepts", styles: {} }], children: [] },
      { id: "sn4", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Concept 1]", styles: { bold: true } }, { type: "text", text: " — [brief definition or explanation]", styles: {} }], children: [] },
      { id: "sn5", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Concept 2]", styles: { bold: true } }, { type: "text", text: " — [brief definition or explanation]", styles: {} }], children: [] },
      { id: "sn6", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Detailed Notes", styles: {} }], children: [] },
      { id: "sn7", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Your detailed notes here...", styles: { italic: true } }], children: [] },
      { id: "sn8", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Examples & Applications", styles: {} }], children: [] },
      { id: "sn9", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Example 1: ", styles: { bold: true } }, { type: "text", text: "...", styles: {} }], children: [] },
      { id: "sn10", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Example 2: ", styles: { bold: true } }, { type: "text", text: "...", styles: {} }], children: [] },
      { id: "sn11", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Questions to Review", styles: {} }], children: [] },
      { id: "sn12", type: "numberedListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Question 1]?", styles: {} }], children: [] },
      { id: "sn13", type: "numberedListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "[Question 2]?", styles: {} }], children: [] },
      { id: "sn14", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Summary", styles: {} }], children: [] },
      { id: "sn15", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "In 2–3 sentences, summarize the main takeaway...", styles: { italic: true } }], children: [] },
      { id: "sn16", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Action Items", styles: {} }], children: [] },
      { id: "sn17", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Re-read section on [topic]", styles: {} }], children: [] },
      { id: "sn18", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Practice problems: [source]", styles: {} }], children: [] },
      { id: "sn19", type: "checkListItem", props: { checked: false, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "Review before [exam / date]", styles: {} }], children: [] },
    ],
  },
  {
    id: "blank",
    icon: "📄",
    image: "/templates/blank.png",
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
    grad: "from-violet-50 to-purple-50 dark:from-violet-950/10 dark:to-purple-950/10",
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
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-5xl mx-auto w-full">
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
              className={`bg-gradient-to-br ${colors.grad} rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden text-left hover:scale-[1.02] hover:shadow-md transition group disabled:opacity-60 disabled:cursor-wait flex flex-col h-[336px]`}
            >
              <div className="relative w-full h-56 shrink-0 overflow-hidden">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={`object-cover ${t.id === "blank" ? "object-[center_30%]" : "object-center"}`}
                />
              </div>
              <div className="p-4 flex-1 min-h-0">
                <p className={`font-semibold ${colors.text} group-hover:underline`}>
                  {loadingId === t.id ? "Creating…" : t.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{t.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      </div>
    </div>
  );
}
