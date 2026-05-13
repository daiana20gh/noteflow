"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import RightPanel from "@/components/RightPanel";
import { listDocuments, createDocument, deleteDocument } from "@/lib/api";
import type { DocumentSummary } from "@/lib/documents";
import { useSearchParams } from "next/navigation";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiText, setAiText] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    listDocuments().then((docs) => {
      setDocuments(docs);
      const idFromUrl = searchParams.get("id");
      if (idFromUrl) setSelectedId(idFromUrl);
    }).catch(console.error);
  }, [searchParams]);

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

  return (
    <div className="flex h-full">
      <Sidebar
        documents={documents}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNew={handleNew}
        onDelete={handleDelete}
      />
      <MainContent
        selectedId={selectedId}
        onTitleChange={handleTitleChange}
        onSendToAI={setAiText}
      />
      <RightPanel initialText={aiText} onTextConsumed={() => setAiText("")} />
    </div>
  );
}
