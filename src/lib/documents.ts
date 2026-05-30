export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type Document = {
  id: string;
  title: string;
  content: unknown[] | null;
  fontFamily: string;
  emoji: string;
  tags: Tag[];
  updatedAt: string;
};

export type DocumentSummary = {
  id: string;
  title: string;
  emoji: string;
  tags: Tag[];
  updatedAt: string;
};
