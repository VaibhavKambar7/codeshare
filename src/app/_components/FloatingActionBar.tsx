import React from "react";
import { FiMaximize, FiCopy, FiSettings, FiHeart } from "react-icons/fi";

const FloatingActionBar = () => {
  return (
    <div className="fixed bottom-5 left-1/2 flex -translate-x-1/2 transform gap-4 rounded-lg bg-[#171717] p-3 shadow-lg">
      <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] text-white hover:bg-[#2d2d2d]">
        <FiMaximize size="14" />
      </button>
      <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] text-white hover:bg-[#2d2d2d]">
        <FiCopy size="14" />
      </button>
      <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] text-white hover:bg-[#2d2d2d]">
        <FiSettings size="14" />
      </button>
      <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] text-white hover:bg-[#2d2d2d]">
        <FiHeart size="14" />
      </button>
    </div>
  );
};

export default FloatingActionBar;
