import React, { useEffect, useRef, useState } from "react";
import Editor, {
  loader,
  type OnChange,
  type OnMount,
} from "@monaco-editor/react";
import { Spinner } from "./ui/spinner";
import type * as monaco from "monaco-editor";
import themes from "../../lib/theme";
import { api } from "~/trpc/react";
import { useDebounce } from "use-debounce";
import { useTheme } from "../context/themeContext";
import { useSession } from "next-auth/react";
import {
  DEBOUNCE_TIME,
  SAVE_PERIODIC_NEW_FILE_DATA_TIME,
} from "~/lib/constants";
import type { z } from "zod";
import type { fileDataSchema, userDataSchema } from "~/lib/types";

type ThemeKey = keyof typeof themes;

interface CodeEditorProps {
  slug: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ slug }) => {
  const [value, setValue] = useState<string>("//write some good code");
  const [debouncedValue] = useDebounce(value, DEBOUNCE_TIME);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const lastUpdateRef = useRef<string>("");
  const updateContentMutation = api.editor.updateContent.useMutation();
  const { theme, title } = useTheme();
  const { data } = useSession();

  useEffect(() => {
    const savedContent = localStorage.getItem(`editorContent_${slug}`);
    if (savedContent) {
      setValue(savedContent);
      lastUpdateRef.current = savedContent;
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
        }
      })
      .catch(console.error);
  }, [theme]);

  const subscription = api.editor.onContentUpdate.useSubscription(slug, {
    onData: (newContent: string) => {
      if (newContent !== lastUpdateRef.current) {
        lastUpdateRef.current = newContent;
        setValue(newContent);
        if (editorRef.current) {
          const position = editorRef.current.getPosition();
          editorRef.current.setValue(newContent);
          if (position) editorRef.current.setPosition(position);
        }
      }
    },
  });

  const handleEditorChange: OnChange = (newValue) => {
    if (newValue && newValue !== lastUpdateRef.current) {
      lastUpdateRef.current = newValue;
      setValue(newValue);
      localStorage.setItem(`editorContent_${slug}`, newValue);
      updateContentMutation.mutate({ room: slug, content: newValue });
    }
  };

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  type UserData = z.infer<typeof userDataSchema>;
  type FileData = z.infer<typeof fileDataSchema>;

  const { mutate: saveUserFile } =
    api.userFile.createUserFileMutation.useMutation({
      onError: () => console.log("error saving file"),
      onSettled: () => console.log("file saved"),
    });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (typeof slug === "string" && data) {
        const userData: UserData = {
          name: data.user?.name ?? null,
          email: data.user?.email ?? null,
        };

        const fileData: FileData = {
          title,
          content: debouncedValue,
          link: slug,
        };

        if (fileData.content && fileData.link) {
          saveUserFile({ userData, fileData });
        }
      }
    }, SAVE_PERIODIC_NEW_FILE_DATA_TIME);

    return () => clearInterval(intervalId);
  }, [data, debouncedValue, saveUserFile, slug, title]);

  return (
    <Editor
      height="100vh"
      defaultLanguage="javascript"
      theme="custom-theme"
      value={value}
      onMount={onMount}
      onChange={handleEditorChange}
      options={{ selectOnLineNumbers: true }}
      loading={
        <div className="absolute inset-0 flex items-center justify-center bg-[#2b2a2a]">
          <Spinner size={40} color="white" />
        </div>
      }
    />
  );
};

export default CodeEditor;
