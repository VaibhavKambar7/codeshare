import React, { useState, useEffect, forwardRef } from "react";
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
import { MdManageSearch } from "react-icons/md";
import { Dialog, DialogContent } from "./ui/dialog";
import { PiSpinnerBold } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const ForwardRefButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>((props, ref) => <Button ref={ref} {...props} />);

ForwardRefButton.displayName = "ForwardRefButton";

const FloatingActionBar = ({ slug }: { slug: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("recents");

  const { data: session } = useSession();
  const { data: fileData } = api.userFile.getFileData.useQuery(slug);

  const router = useRouter();
  const userEmail = session?.user?.email ?? "";

  const handleLink = (link: string) => {
    router.push(`/f/${link}`);
  };

  const {
    data: files,
    isLoading,
    error,
  } = api.userFile.getAllFiles.useQuery(userEmail);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setIsDialogOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setIsFavourite(fileData?.isFavourite ?? false);
  }, [fileData, slug]);

  const handleSearch = () => {
    if (!session) {
      toast.info("Please login to search files");
      return;
    }
    setIsDialogOpen(true);
  };

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
    <div className="fixed bottom-5 left-1/2 flex -translate-x-1/2 transform gap-3 rounded-lg bg-[#171717] p-3 shadow-lg">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex max-h-[80vh] min-h-[80vh] w-full max-w-lg flex-col overflow-hidden border-2 border-[#36383a] bg-[#2e3033]">
          <div className="flex flex-row items-center justify-between border-b border-[#36383a]">
            <ForwardRefButton
              onClick={() => setSelectedTab("recents")}
              className={`${
                selectedTab === "recents"
                  ? "border-b-2 border-[#474747]"
                  : "border-b-2 border-transparent"
              } box-border flex flex-1 items-center justify-center rounded-none bg-[#2e3033] px-4 py-6 text-center text-sm font-semibold leading-none text-[#d1d1db] hover:bg-[#3f4042]`}
            >
              Recents
            </ForwardRefButton>
            <ForwardRefButton
              onClick={() => setSelectedTab("favourites")}
              className={`${
                selectedTab === "favourites"
                  ? "border-b-2 border-[#474747]"
                  : "border-b-2 border-transparent"
              } box-border flex flex-1 items-center justify-center rounded-none bg-[#2e3033] px-4 py-6 text-center text-sm font-semibold leading-none text-[#d1d1db] hover:bg-[#3f4042]`}
            >
              Favourites
            </ForwardRefButton>
          </div>

          <div className="flex-1">
            {isLoading && (
              <div className="mt-40 flex animate-spin items-center justify-center text-3xl text-[#d1d1db]">
                <PiSpinnerBold />
              </div>
            )}
            {error && <div className="text-[#d1d1db]">Error loading files</div>}
            {files && (
              <>
                {selectedTab === "recents" ? (
                  <ul className="max-h-[60vh] space-y-2 overflow-y-auto">
                    {files.length > 0 ? (
                      files.map((file) => (
                        <li
                          key={file.link}
                          className={`mb-2 cursor-pointer rounded-md p-2 text-[#d1d1db] ${
                            slug === file.link
                              ? "bg-[#3a3a3a]"
                              : "hover:bg-[#262525]"
                          }`}
                          onClick={() => handleLink(file.link)}
                        >
                          {file.title}
                        </li>
                      ))
                    ) : (
                      <div className="text-center text-[#d1d1db]">
                        No files found
                      </div>
                    )}
                  </ul>
                ) : (
                  <ul className="max-h-[60vh] space-y-2 overflow-y-auto">
                    {files.filter((file) => file.isFavourite).length > 0 ? (
                      files
                        .filter((file) => file.isFavourite)
                        .map((file) => (
                          <li
                            key={file.link}
                            className={`mb-2 cursor-pointer rounded-md p-2 text-[#d1d1db] ${
                              slug === file.link
                                ? "bg-[#3a3a3a]"
                                : "hover:bg-[#262525]"
                            }`}
                            onClick={() => handleLink(file.link)}
                          >
                            {file.title}
                          </li>
                        ))
                    ) : (
                      <div className="text-center text-[#d1d1db]">
                        No files found
                      </div>
                    )}
                  </ul>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <ForwardRefButton
              variant="ghost"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] p-0 text-white hover:bg-[#313131] hover:text-white"
              onClick={toggleFullscreen}
            >
              <>
                <FiMaximize className="h-4 w-4" />
              </>
            </ForwardRefButton>
          </TooltipTrigger>
          <TooltipContent className="mb-3 border-0 bg-black text-white">
            <p>Enter fullscreen</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <ForwardRefButton
              variant="ghost"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] p-0 text-white hover:bg-[#2d2d2d] hover:text-white"
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
                      className="mt-[2px] h-4 w-4 text-green-500"
                    />
                  ) : (
                    <FiCopy className="h-4 w-4" />
                  )}
                </motion.div>
              </AnimatePresence>
            </ForwardRefButton>
          </TooltipTrigger>
          <TooltipContent className="mb-3 border-0 bg-black text-white">
            <p>{isCopied ? "Copied!" : "Copy"}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <ForwardRefButton
              variant="ghost"
              onClick={handleFavourite}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] p-0 text-white hover:bg-[#2d2d2d] hover:text-white"
              aria-label={
                isFavourite ? "Added to favorites" : "Removed from favorites"
              }
            >
              <FiHeart
                className="h-4 w-4"
                fill={isFavourite ? "red" : "none"}
                style={isFavourite ? { color: "rgb(127, 29, 29)" } : {}}
              />
            </ForwardRefButton>
          </TooltipTrigger>
          <TooltipContent className="mb-3 border-0 bg-black text-white">
            <p>{!isFavourite ? "Add to favorites" : "Remove from favorites"}</p>
          </TooltipContent>
        </Tooltip>
        <Sheet>
          <SheetTrigger asChild>
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ForwardRefButton
                    variant="ghost"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] p-0 text-white hover:bg-[#2d2d2d] hover:text-white"
                  >
                    <VscSettings className="h-4 w-4" />
                  </ForwardRefButton>
                </TooltipTrigger>
                <TooltipContent className="mb-3 border-0 bg-black text-white">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </SheetTrigger>
          <SheetContent className="bg-[#1e1e1e] text-white">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <Tooltip>
          <TooltipTrigger asChild>
            <ForwardRefButton
              variant="ghost"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#212121] p-0 text-white hover:bg-[#313131] hover:text-white"
              onClick={handleSearch}
            >
              <MdManageSearch className="h-4 w-4" />
            </ForwardRefButton>
          </TooltipTrigger>
          <TooltipContent className="mb-3 border-0 bg-black text-white">
            <p>Search files (CTRL + K)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingActionBar;
