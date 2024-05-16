"use client";

import React from "react";
import { useMemo } from "react";

import Editor, {  type EditorProps } from "@monaco-editor/react";
import { useEditorSettingsStore } from "@/store/editor-settings";
const DEFAULT_OPTIONS = {
  fixedOverflowWidgets: true,
  lineNumbers: "on",

  tabSize: 2,
  insertSpaces: false,
  minimap: {
    enabled: false,
  },
  fontSize: 16,
} as const satisfies EditorProps["options"];
export type CodeEditorProps = Omit<EditorProps, "theme">;
function CodeEditor({
  onChange,
  onMount,
  options,
  value,
  ...props
}: CodeEditorProps) {
  const { settings } = useEditorSettingsStore();
  const editorOptions = useMemo(
    () => ({
      ...DEFAULT_OPTIONS,
      ...settings,
      fontSize: parseInt(settings.fontSize),
      tabSize: parseInt(settings.tabSize),
      ...options,
    }),
    [options, settings]
  );

  return (
    <Editor
      {...props}
      defaultLanguage="typescript"
      onChange={onChange}
      onMount={onMount}
      options={editorOptions}
      theme={"vs-dark"}
      value={value}
    />
  );
}

export default CodeEditor;
