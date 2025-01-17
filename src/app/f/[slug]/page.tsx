"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import CodeEditor from "~/app/_components/CodeEditor";
import FloatingActionBar from "~/app/_components/FloatingActionBar";
import Navbar from "~/app/_components/Navbar";

const EditorPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const params = useParams();
  const slug = params.slug as string;

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
      {!isFullscreen && <Navbar />}
      <CodeEditor slug={slug} />
      {!isFullscreen && <FloatingActionBar slug={slug} />}
    </>
  );
};

export default EditorPage;
