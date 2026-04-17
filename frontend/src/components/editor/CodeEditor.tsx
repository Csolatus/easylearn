"use client";

import dynamic from "next/dynamic";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });

const LANG_EXTENSIONS: Record<string, ReturnType<typeof javascript>> = {
  javascript: javascript({ jsx: false }),
  typescript: javascript({ typescript: true }),
  python: python(),
  sql: sql(),
};

type Props = {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  minHeight?: string;
};

export default function CodeEditor({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
  minHeight = "300px",
}: Props) {
  const extensions = LANG_EXTENSIONS[language]
    ? [LANG_EXTENSIONS[language]]
    : [javascript()];

  return (
    <CodeMirror
      value={value}
      extensions={extensions}
      theme={oneDark}
      readOnly={readOnly}
      minHeight={minHeight}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: !readOnly,
        autocompletion: !readOnly,
        foldGutter: true,
      }}
      className="h-full text-sm"
    />
  );
}
