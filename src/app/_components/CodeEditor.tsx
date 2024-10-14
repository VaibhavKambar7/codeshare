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
import { useTheme } from "../context/themeContext";

type ThemeKey = keyof typeof themes;

const CodeEditor: React.FC = () => {
  const [value, setValue] = useState<string>("//write some good code");
  const [debouncedValue] = useDebounce(value, 4000);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const updateContentMutation = api.editor.updateContent.useMutation();
  const { theme } = useTheme();

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      setValue(savedContent);
    }
  }, []);

  useEffect(() => {
    loader
      .init()
      .then((monaco) => {
        if (themes.hasOwnProperty(theme)) {
          const themeData = themes[
            theme as ThemeKey
          ] as monaco.editor.IStandaloneThemeData;
          monaco.editor.defineTheme("custom-theme", themeData);
          monaco.editor.setTheme("custom-theme");
          if (editorRef.current) {
            editorRef.current.updateOptions({ theme: "custom-theme" });
          }
        } else {
          console.warn(`Theme "${theme}" not found in themes object.`);
        }
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }, [theme]);

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
      height="100vh"
      defaultLanguage="javascript"
      theme="custom-theme"
      value={debouncedValue}
      onMount={onMount}
      onChange={handleEditorChange}
      options={{ selectOnLineNumbers: true }}
      loading={
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#2b2a2a",
          }}
        >
          <Spinner size={40} color="white" />
        </div>
      }
    />
  );
};

export default CodeEditor;
