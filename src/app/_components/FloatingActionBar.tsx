import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMaximize, FiCopy, FiSettings, FiHeart } from "react-icons/fi";
import { VscSettings } from "react-icons/vsc";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const FloatingActionBar = () => {
  const [isCopied, setIsCopied] = useState(false);

  const toggleFullscreen = async () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err}`);
      });
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      localStorage.getItem("editorContent") ?? "//write some good code",
    );
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <div className="fixed bottom-5 left-1/2 flex -translate-x-1/2 transform gap-4 rounded-lg bg-[#171717] p-3 shadow-lg">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] text-white hover:bg-[#313131]"
              onClick={toggleFullscreen}
            >
              <FiMaximize size="14" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="mb-3 border-0 bg-black text-white">
            <p>Enter fullscreen</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] text-white hover:bg-[#2d2d2d]"
              onClick={handleCopy}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={isCopied ? "check" : "copy"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  {isCopied ? (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="mt-[2px] size-[15px] text-green-500"
                    />
                  ) : (
                    <FiCopy size="14" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </TooltipTrigger>
          <TooltipContent className="mb-3 border-0 bg-black text-white">
            <p>{isCopied ? "Copied!" : "Copy"}</p>
          </TooltipContent>
        </Tooltip>

        <Sheet>
          <SheetTrigger>
            <Tooltip>
              <TooltipTrigger>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] text-white hover:bg-[#2d2d2d]">
                  <VscSettings size="17" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="mb-3 border-0 bg-black text-white">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </SheetTrigger>
          <SheetContent>
            <Sidebar />
          </SheetContent>
        </Sheet>

        <Tooltip>
          <TooltipTrigger>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] text-white hover:bg-[#2d2d2d]">
              <FiHeart size="14" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="mb-3 border-0 bg-black text-white">
            <p>Favorites</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingActionBar;
