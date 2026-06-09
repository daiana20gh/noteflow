"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteSchema, defaultStyleSpecs, createStyleSpec } from "@blocknote/core";
import type { Block } from "@blocknote/core";
import { useEffect, useRef } from "react";

const fontFamilySpec = createStyleSpec(
  { type: "fontFamily", propSchema: "string" },
  { render: (value) => { const s = document.createElement("span"); s.style.fontFamily = value; return { dom: s }; } }
);

const fontSizeSpec = createStyleSpec(
  { type: "fontSize", propSchema: "string" },
  { render: (value) => { const s = document.createElement("span"); s.style.fontSize = value; return { dom: s }; } }
);

export const editorSchema = BlockNoteSchema.create({
  styleSpecs: { ...defaultStyleSpecs, fontFamily: fontFamilySpec, fontSize: fontSizeSpec },
});

type Props = {
  initialContent?: Block[];
  onChange: (blocks: Block[]) => void;
  onEditorReady?: (editor: any) => void;
};

export default function Editor({ initialContent, onChange, onEditorReady }: Props) {
  const editor = useCreateBlockNote({
    schema: editorSchema,
    initialContent: initialContent?.length ? (initialContent as any) : undefined,
  });

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => editor.onChange(() => onChangeRef.current(editor.document as Block[])), [editor]);

  useEffect(() => { onEditorReady?.(editor); }, [editor]);

  return <BlockNoteView editor={editor} className="flex-1 min-h-0" />;
}
