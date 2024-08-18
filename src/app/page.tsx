"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./_components/ui/button";
import { nanoid } from "nanoid";

const Home = () => {
  const router = useRouter();
  const id = nanoid(10);

  const handleButtonClick = () => {
    router.push(`/f/${id}`);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <Button
        onClick={handleButtonClick}
        className="flex items-center bg-black text-white"
        variant="outline"
      >
        Create New File <span className="ml-2">+</span>
      </Button>
    </div>
  );
};

export default Home;
