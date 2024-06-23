"use client";

import React from "react";
import CodeEditor from "~/app/_components/CodeEditor";
import Navbar from "~/app/_components/Navbar";
// import CodeEditor from "~/app/_components/codeEditor";

const page = () => {
  return (
    <>
      <Navbar/>
      <CodeEditor />
    </>
  );
};

export default page;
