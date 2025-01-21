import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMaximize, FiCopy, FiHeart } from "react-icons/fi";
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
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

const FloatingActionBar = ({ slug }: { slug: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  const { data: session } = useSession();
  const { data: fileData } = api.userFile.getFileData.useQuery(slug);

  useEffect(() => {
    setIsFavourite(fileData?.isFavourite ?? false);
  }, [fileData, slug]);

  const toggleFavourite = api.userFile.toggleFavourite.useMutation({
    onMutate: async () => {
      setIsFavourite((prev) => !prev);
    },
    onSuccess: (data) => {
      setIsFavourite(data.isFavourite);
      toast.success(
        data.isFavourite ? "Added to favorites" : "Removed from favorites",
      );
    },
    onError: (error) => {
      setIsFavourite((prev) => !prev);
      toast.error(error.message || "Failed to update favorite status");
    },
  });

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle fullscreen");
    }
  };

  const handleCopy = async () => {
    try {
      const content =
        localStorage.getItem("editorContent") ?? "//write some good code";
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      toast.error("Failed to copy content");
    }
  };

  const handleFavourite = () => {
    if (!session) {
      toast.info("Please login to add to favorites");
      return;
    }
    toggleFavourite.mutate(slug);
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
            <button
              onClick={handleFavourite}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] text-white hover:bg-[#2d2d2d]"
              aria-label={
                isFavourite ? "Added to favorites" : "Removed from favorites"
              }
            >
              <FiHeart
                size={14}
                fill={isFavourite ? "red" : "none"}
                className={isFavourite ? "text-red-900" : "text-white"}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent className="mb-3 border-0 bg-black text-white">
            <p>{!isFavourite ? "Add to favorites" : "Remove from favorites"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingActionBar;
