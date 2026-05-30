"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import RightPanel from "@/components/RightPanel";
import {
  listDocuments,
  createDocument,
  deleteDocument,
  listTags,
  createTag,
  deleteTag,
} from "@/lib/api";
import type { DocumentSummary, Tag } from "@/lib/documents";
import { useSearchParams } from "next/navigation";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiText, setAiText] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Load tags once
  useEffect(() => {
    listTags().then(setTags).catch(console.error);
  }, []);

  // Reload documents when tag filter changes
  useEffect(() => {
    listDocuments(selectedTagId ?? undefined)
      .then((docs) => {
        setDocuments(docs);
        const idFromUrl = searchParams.get("id");
        if (idFromUrl && !selectedTagId) setSelectedId(idFromUrl);
      })
      .catch(console.error);
  }, [selectedTagId, searchParams]);

  const handleNew = useCallback(async () => {
    const doc = await createDocument();
    setDocuments((prev) => [doc, ...prev]);
    setSelectedId(doc.id);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleTitleChange = useCallback((id: string, title: string) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, title } : d)));
  }, []);

  const handleTagsChange = useCallback((id: string, newTags: Tag[]) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, tags: newTags } : d)));
  }, []);

  const handleCreateTag = useCallback(async (name: string, color: string) => {
    const tag = await createTag(name, color);
    setTags((prev) => [...prev, tag]);
  }, []);

  const handleDeleteTag = useCallback(async (id: string) => {
    await deleteTag(id);
    setTags((prev) => prev.filter((t) => t.id !== id));
    if (selectedTagId === id) setSelectedTagId(null);
    // Remove tag from all documents in local state
    setDocuments((prev) =>
      prev.map((d) => ({ ...d, tags: d.tags.filter((t) => t.id !== id) }))
    );
  }, [selectedTagId]);

  return (
    <div className="flex h-full">
      <Sidebar
        documents={documents}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNew={handleNew}
        onDelete={handleDelete}
        tags={tags}
        selectedTagId={selectedTagId}
        onSelectTag={setSelectedTagId}
        onCreateTag={handleCreateTag}
        onDeleteTag={handleDeleteTag}
      />
      <MainContent
        selectedId={selectedId}
        allTags={tags}
        onTitleChange={handleTitleChange}
        onTagsChange={handleTagsChange}
        onSendToAI={setAiText}
      />
      <RightPanel initialText={aiText} onTextConsumed={() => setAiText("")} />
    </div>
  );
}
