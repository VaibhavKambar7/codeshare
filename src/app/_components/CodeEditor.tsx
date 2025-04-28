"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor, {
  loader,
  type OnChange,
  type OnMount,
} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { languages, themes } from "../../lib/theme";
import { api } from "~/trpc/react";
import { useTheme } from "../context/themeContext";
import { useSession } from "next-auth/react";
import { SAVE_PERIODIC_NEW_FILE_DATA_TIME } from "~/lib/constants";
import type { z } from "zod";
import type { fileDataSchema, userDataSchema } from "~/lib/types";
import { usePathname } from "next/navigation";
import { PiSpinnerBold } from "react-icons/pi";
import { nanoid } from "nanoid";

type ThemeKey = keyof typeof themes;

interface CodeEditorProps {
  slug: string;
}

export type UserData = z.infer<typeof userDataSchema>;
export type FileData = z.infer<typeof fileDataSchema>;

export interface CursorData {
  id: string;
  name: string;
  email: string;
  position: {
    lineNumber: number;
    column: number;
  };
}

export interface WebSocketMessage {
  type: "INIT" | "CURSOR_UPDATE" | "ACTIVE_USERS" | "CURSORS";
  id: string;
  room: string;
  cursor?: CursorData;
  payload?: number | CursorData[];
}

const CodeEditor: React.FC<CodeEditorProps> = ({ slug }) => {
  const [value, setValue] = useState<string>("");
  // const [debouncedValue] = useDebounce(value, DEBOUNCE_TIME);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const lastUpdateRef = useRef<string>("");
  const cursorsRef = useRef<Map<string, monaco.editor.IContentWidget>>(
    new Map(),
  );
  const cursorUpdateTimeout = useRef<NodeJS.Timeout>();
  const updateContentMutation = api.editor.updateContent.useMutation();
  const { language, setLanguage, theme, title, setTitle } = useTheme();
  const { status, data } = useSession();
  const [cursorId] = useState(() => `${data?.user?.email}-${nanoid()}`);
  const { data: fileData } = api.userFile.getFileData.useQuery(slug);

  const isEditable =
    fileData?.userEmail === data?.user?.email && fileData?.isViewOnly;

  const isViewOnlyForNonOwner = !isEditable && fileData?.isViewOnly;

  const pathname = usePathname();

  useEffect(() => {
    if (fileData?.language && languages.includes(fileData.language)) {
      setLanguage(fileData.language);
    } else if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem(`editorLanguage_${slug}`);
      if (savedLanguage && languages.includes(savedLanguage)) {
        setLanguage(savedLanguage);
      }
    }
  }, [slug, setLanguage, fileData?.language]);

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
        setValue(fileData.content);
        lastUpdateRef.current = fileData.content;
      }
    }
  }, [slug, fileData?.content]);

  useEffect(() => {
    if (editorRef.current && language) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

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

  const updateCursorPosition = (position: monaco.Position) => {
    // if (!editorRef.current || !data?.user?.name) return;

    if (cursorUpdateTimeout.current) {
      clearTimeout(cursorUpdateTimeout.current);
    }

    cursorUpdateTimeout.current = setTimeout(() => {
      const cursorData: CursorData = {
        id: cursorId,
        name: data?.user?.name ?? "Anon",
        email: data?.user?.email ?? "",
        position,
      };

      updateCursorMutation.mutate({ room: slug, cursor: cursorData });
    }, 50);
  };

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

  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const cursorSubscription = api.editor.onCursorUpdate.useSubscription(slug, {
    onData: (data: unknown) => {
      const cursorData = data as CursorData;
      if (cursorData.id === cursorId) return;

      if (editorRef.current) {
        const existingWidget = cursorsRef.current.get(cursorData.email);
        if (existingWidget) {
          editorRef.current.removeContentWidget(existingWidget);
        }

        const widget = {
          getId: () => `cursor-${cursorData.id}`,
          getDomNode: () => {
            const element = document.createElement("div");
            element.className = "cursor-widget";
            element.style.position = "absolute";
            element.style.background = `hsl(${hashString(cursorData.email) % 360}, 70%, 70%)`;
            element.style.width = "2px";
            element.style.height = "18px";

            const label = document.createElement("div");
            label.className = "cursor-label";
            label.textContent = cursorData.name;
            label.style.position = "absolute";
            label.style.top = "-20px";
            label.style.left = "0";
            label.style.background = "rgba(250, 120, 120, 0.8)";
            label.style.padding = "2px 4px";
            label.style.borderRadius = "3px";
            label.style.fontSize = "12px";
            label.style.whiteSpace = "nowrap";

            element.appendChild(label);
            return element;
          },
          getPosition: () => ({
            position: new monaco.Position(
              cursorData.position.lineNumber,
              cursorData.position.column,
            ),
            preference: [monaco.editor.ContentWidgetPositionPreference.EXACT],
          }),
        };

        editorRef.current.addContentWidget(widget);
        cursorsRef.current.set(cursorData.email, widget);
      }
    },
  });

  const updateCursorMutation = api.editor.updateCursor.useMutation();

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

    editor.onDidChangeCursorPosition((e) => {
      updateCursorPosition(e.position);
    });
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
        language,
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
        language,
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
    language,
    saveUserFile,
  ]);

  return (
    <Editor
      height="100vh"
      language={language}
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
