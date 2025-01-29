"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor, {
  loader,
  type OnChange,
  type OnMount,
} from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import { themes } from "../../lib/theme";
import { api } from "~/trpc/react";
import { useTheme } from "../context/themeContext";
import { useSession } from "next-auth/react";
import { SAVE_PERIODIC_NEW_FILE_DATA_TIME } from "~/lib/constants";
import type { z } from "zod";
import type { fileDataSchema, userDataSchema } from "~/lib/types";
import { usePathname } from "next/navigation";
import { PiSpinnerBold } from "react-icons/pi";

type ThemeKey = keyof typeof themes;

interface CodeEditorProps {
  slug: string;
}

export type UserData = z.infer<typeof userDataSchema>;
export type FileData = z.infer<typeof fileDataSchema>;

const CodeEditor: React.FC<CodeEditorProps> = ({ slug }) => {
  const [value, setValue] = useState<string>("");
  // const [debouncedValue] = useDebounce(value, DEBOUNCE_TIME);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const lastUpdateRef = useRef<string>("");
  const updateContentMutation = api.editor.updateContent.useMutation();
  const { theme, title, setTitle } = useTheme();
  const { status, data } = useSession();
  const { data: fileData } = api.userFile.getFileData.useQuery(slug);

  const isEditable =
    fileData?.userEmail === data?.user?.email && fileData?.isViewOnly;

  const isViewOnlyForNonOwner = !isEditable && fileData?.isViewOnly;

  const pathname = usePathname();

  useEffect(() => {
    if (fileData?.title) {
      setTitle(fileData?.title);
    }
  }, [fileData, setTitle]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedContent = localStorage.getItem(`editorContent_${slug}`);
      if (savedContent) {
        setValue(savedContent);
        lastUpdateRef.current = savedContent;
      } else if (fileData?.content) {
        // Only use fileData.content if there's no localStorage content
        setValue(fileData.content);
        lastUpdateRef.current = fileData.content;
      }
    }
  }, [slug, fileData?.content]);

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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  console.log(subscription);
  
  const handleEditorChange: OnChange = (newValue) => {
    if (newValue && newValue !== lastUpdateRef.current) {
      lastUpdateRef.current = newValue;
      setValue(newValue);
      if (typeof window !== "undefined") {
        localStorage.setItem(`editorContent_${slug}`, newValue);
      }
      updateContentMutation.mutate({ room: slug, content: newValue });
    }
  };

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const { mutate: saveUserFile } =
    api.userFile.createUserFileMutation.useMutation({
      onError: (error) => console.log("error saving file:", error),
      onSettled: () => console.log("file save attempt completed"),
    });

  const initialSaveRef = useRef(false);
  const prevAuthStateRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("title changed");

    console.log("Auth state changed:", {
      status,
      email: data?.user?.email,
      prevAuthState: prevAuthStateRef.current,
    });

    const authStateChanged =
      prevAuthStateRef.current !== status && status === "authenticated";

    prevAuthStateRef.current = status;

    if (!initialSaveRef.current || authStateChanged) {
      console.log("Triggering save due to:", {
        isInitialSave: !initialSaveRef.current,
        authStateChanged,
      });

      const userData: UserData = {
        name: data?.user?.name ?? null,
        email: data?.user?.email ?? null,
      };

      const fileData: FileData = {
        title,
        content: value,
        link: slug,
      };

      saveUserFile({ userData, fileData });
      initialSaveRef.current = true;
    }

    const intervalId = setInterval(() => {
      const userData: UserData = {
        name: data?.user?.name ?? null,
        email: data?.user?.email ?? null,
      };

      const fileData: FileData = {
        title,
        content: value,
        link: slug,
      };

      saveUserFile({ userData, fileData });
    }, SAVE_PERIODIC_NEW_FILE_DATA_TIME);

    return () => clearInterval(intervalId);
  }, [
    status,
    data?.user?.email,
    data?.user?.name,
    pathname,
    title,
    value,
    slug,
    saveUserFile,
  ]);

  return (
    <Editor
      height="100vh"
      defaultLanguage="javascript"
      theme="custom-theme"
      value={value}
      onMount={onMount}
      onChange={handleEditorChange}
      options={{
        selectOnLineNumbers: true,
        readOnly: isViewOnlyForNonOwner,
      }}
      loading={
        <div className="absolute inset-0 flex items-center justify-center bg-[#2b2a2a]">
          <PiSpinnerBold className="animate-spin text-4xl text-[#d1d1db]" />
        </div>
      }
    />
  );
};

export default CodeEditor;
