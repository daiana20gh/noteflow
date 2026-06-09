import type { Document, DocumentSummary, Tag } from "./documents";
import type { CalendarEvent } from "./calendar";

export async function listDocuments(tagId?: string): Promise<DocumentSummary[]> {
  const url = tagId ? `/api/documents?tagId=${encodeURIComponent(tagId)}` : "/api/documents";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function getDocument(id: string): Promise<Document> {
  const res = await fetch(`/api/documents/${id}`);
  if (!res.ok) throw new Error("Failed to fetch document");
  return res.json();
}

export async function createDocument(title = "Untitled"): Promise<DocumentSummary> {
  const res = await fetch("/api/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create document");
  return res.json();
}

export async function updateDocument(
  id: string,
  data: { title?: string; content?: unknown; tagIds?: string[]; fontFamily?: string; emoji?: string; color?: string }
): Promise<Document> {
  const res = await fetch(`/api/documents/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update document");
  return res.json();
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete document");
}

export async function listTags(): Promise<Tag[]> {
  const res = await fetch("/api/tags");
  if (!res.ok) throw new Error("Failed to fetch tags");
  return res.json();
}

export async function createTag(name: string, color: string): Promise<Tag> {
  const res = await fetch("/api/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, color }),
  });
  if (!res.ok) throw new Error("Failed to create tag");
  return res.json();
}

export async function deleteTag(id: string): Promise<void> {
  const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete tag");
}

export async function listEvents(month: string): Promise<CalendarEvent[]> {
  const res = await fetch(`/api/events?month=${encodeURIComponent(month)}`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function createEvent(
  data: { title: string; date: string; hour: number; notes?: string; color?: string }
): Promise<CalendarEvent> {
  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

export async function updateEvent(
  id: string,
  data: { title?: string; notes?: string; color?: string; hour?: number }
): Promise<CalendarEvent> {
  const res = await fetch(`/api/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete event");
}

export async function getUserPreferences(): Promise<{ fontFamily: string; fontSize: string }> {
  const res = await fetch("/api/user/font");
  if (!res.ok) return { fontFamily: "default", fontSize: "medium" };
  const data = await res.json();
  return { fontFamily: data.fontFamily ?? "default", fontSize: data.fontSize ?? "16" };
}

export async function updateUserPreferences(prefs: { fontFamily?: string; fontSize?: string }): Promise<void> {
  await fetch("/api/user/font", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prefs),
  });
}

export async function aiComplete(text: string, action: string): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, action }),
  });
  if (!res.ok) throw new Error("AI request failed");
  const data = await res.json();
  return data.result;
}
