import React, { useRef, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import type { OnChange, OnMount } from "@monaco-editor/react";
import { Spinner } from "./ui/spinner";
import type * as monaco from "monaco-editor";
import themes from "../lib/theme";

loader
  .init()
  .then((monaco) => {
      monaco.editor.defineTheme("theme", themes.Monokai);
    monaco.editor.setTheme("theme");
  })
  .catch((error) => {
    console.log(error);
  });

const CodeEditor: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      setValue(value);
    }
  };

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="//write some good code"
        theme='theme'
        value={value}
        onMount={onMount}
        onChange={handleEditorChange}
        options={{ selectOnLineNumbers: true }}
        loading={<Spinner size={40} color="black" />}
      />
    </>
  );
};

export default CodeEditor;
