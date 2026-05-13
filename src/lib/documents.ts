export type Document = {
  id: string;
  title: string;
  content: unknown[] | null;
  updatedAt: string;
};

export type DocumentSummary = Pick<Document, "id" | "title" | "updatedAt">;
