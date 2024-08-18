import React, { useEffect, useRef, useState } from "react";
import Editor, {
  loader,
  type OnChange,
  type OnMount,
} from "@monaco-editor/react";
import { Spinner } from "./ui/spinner";
import type * as monaco from "monaco-editor";
import themes from "../lib/theme";
import { api } from "~/trpc/react";
import { useDebounce } from "use-debounce";

type Theme = monaco.editor.IStandaloneThemeData;

const CodeEditor: React.FC = () => {
  const [value, setValue] = useState<string>("//write some good code");
  const [debouncedValue] = useDebounce(value, 4000);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const updateContentMutation = api.editor.updateContent.useMutation();

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      setValue(savedContent);
    }

    loader
      .init()
      .then((monaco) => {
        monaco.editor.defineTheme("theme", themes.Monokai as Theme);
        monaco.editor.setTheme("theme");
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }, []);

  // eslint-disable-next-line
  const subscription = api.editor.onContentUpdate.useSubscription(undefined, {
    onData: (newContent: string) => {
      if (newContent !== value) {
        setValue(newContent);
        if (editorRef.current) {
          editorRef.current.setValue(newContent);
        }
      }
    },
  });

  const handleEditorChange: OnChange = (newValue) => {
    if (newValue !== undefined) {
      setValue(newValue);
      localStorage.setItem("editorContent", newValue);
      updateContentMutation.mutate(newValue);
    }
  };

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();

    const updateEditorValue = () => {
      if (
        editorRef.current &&
        debouncedValue !== editorRef.current.getValue()
      ) {
        editorRef.current.setValue(debouncedValue);
      }
    };

    updateEditorValue();
  };

  useEffect(() => {
    console.log("Editor value updated:", value);
  }, [value]);

  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      theme="theme"
      value={debouncedValue}
      onMount={onMount}
      onChange={handleEditorChange}
      options={{ selectOnLineNumbers: true }}
      loading={<Spinner size={40} color="black" />}
    />
  );
};

export default CodeEditor;
