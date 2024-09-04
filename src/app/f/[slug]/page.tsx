"use client";

import React, { useState, useEffect } from "react";
import CodeEditor from "~/app/_components/CodeEditor";
import FloatingActionBar from "~/app/_components/FloatingActionBar";
import Navbar from "~/app/_components/Navbar";

const EditorPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <>
      {!isFullscreen && (
        <>
          <Navbar />
        </>
      )}
      <CodeEditor />
      {!isFullscreen && (
        <>
          <FloatingActionBar />
        </>
      )}
    </>
  );
};

export default EditorPage;
