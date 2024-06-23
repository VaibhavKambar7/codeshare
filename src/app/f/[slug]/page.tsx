"use client";

import React from "react";
import CodeEditor from "~/app/_components/CodeEditor";
import FloatingActionBar from "~/app/_components/FloatingActionBar";
import Navbar from "~/app/_components/Navbar";

const page = () => {
  return (
    <>
      <Navbar/>
      <CodeEditor />
      <FloatingActionBar/>
    </>
  );
};

export default page;
