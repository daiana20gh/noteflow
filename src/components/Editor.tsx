"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import type { Block } from "@blocknote/core";
import { useEffect, useRef } from "react";

type Props = {
  initialContent?: Block[];
  onChange: (blocks: Block[]) => void;
};

export default function Editor({ initialContent, onChange }: Props) {
  const editor = useCreateBlockNote({
    initialContent: initialContent?.length ? initialContent : undefined,
  });

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    return editor.onChange(() => {
      onChangeRef.current(editor.document as Block[]);
    });
  }, [editor]);

  return (
    <BlockNoteView
      editor={editor}
      className="flex-1 min-h-0"
    />
  );
}
