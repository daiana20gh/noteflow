import { Document } from "@/lib/documents";

type Props = {
  documents: Document[];
  onSelect: (doc: Document) => void;
};

export default function DocumentList({ documents, onSelect }: Props) {
  return (
    <div className="mt-6 space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onSelect(doc)}
          className="p-3 bg-white dark:bg-[#111] rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {doc.title}
        </div>
      ))}
    </div>
  );
}