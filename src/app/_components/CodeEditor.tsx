"use client";

import React, { useRef, useState } from "react";
import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { editor as MonacoEditor } from "monaco-editor"; // Importing editor types


const CodeEditor: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);


  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      setValue(value);
    }
  };

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="//write some good code"
      theme="vs-dark"
      value={value}
      onMount={onMount}
      onChange={handleEditorChange}
    />
  );
};

export default CodeEditor;
