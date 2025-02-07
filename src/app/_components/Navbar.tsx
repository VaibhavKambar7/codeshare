"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FiShare2, FiCopy, FiCheck } from "react-icons/fi";
import { PiSignInLight } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "../context/themeContext";
import { useWebSocket } from "../context/webSocketContext";
import { FaUser } from "react-icons/fa6";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { api } from "~/trpc/react";
import { toast } from "sonner";

const Navbar = ({ slug }: { slug: string }) => {
  const { title, setTitle } = useTheme();
  const { data, status } = useSession();
  const { activeUsers } = useWebSocket();
  const [isCopied, setIsCopied] = useState(false);
  const [urlToCopy, setUrlToCopy] = useState("");
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isViewOnlyLoading, setIsViewOnlyLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  const { data: fileData } = api.userFile.getFileData.useQuery(slug);

  useEffect(() => {
    setIsViewOnly(fileData?.isViewOnly ?? false);
  }, [fileData, slug]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const image = data?.user?.image;

  const handleSignin = () => signIn("google");
  const handleSignout = () => signOut();

  const toggleMutation = api.userFile.toggleViewOnly.useMutation({
    onMutate: async () => {
      setIsViewOnlyLoading(true);
      setIsViewOnly((prev) => !prev);
    },
    onSuccess: (data) => {
      setIsViewOnlyLoading(false);
      setIsViewOnly(data.isViewOnly);
      toast.success(
        data.isViewOnly ? "View-only mode enabled" : "View-only mode disabled",
      );
    },
    onError: (error) => {
      setIsViewOnlyLoading(false);
      setIsViewOnly((prev) => !prev);
      toast.error(error.message || "Failed to update view-only status");
    },
  });

  const handleViewOnlyToggle = async (checked: boolean) => {
    if (!data?.user?.email) {
      toast.warning("You need to sign in to enable view-only sharing");
      return;
    }
    if (fileData?.userEmail !== data.user.email) {
      toast.warning("Only the owner of this file can toggle view-only mode");
      return;
    }
    try {
      await toggleMutation.mutateAsync({
        link: slug,
        isViewOnly: checked,
        userEmail: data.user.email,
      });
    } catch (error) {
      // Error handling is done in onError
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  console.log(urlToCopy);

  return (
    <div className="flex h-16 items-center justify-between bg-[#1f1e1e] px-4 shadow-lg">
      <div className="flex items-center gap-6">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image
            src="/assets/coding.png"
            alt="logo"
            width="36"
            height="36"
            className="rounded-md transition-transform hover:scale-105"
          />
        </Link>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-64 border-none bg-[#212121] text-sm text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-0"
          placeholder="Enter title..."
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <FaUser size="14" className="text-gray-400" />
          <span>{activeUsers}</span>
        </div>
        <Popover>
          <PopoverTrigger asChild={true}>
            <Button
              variant="outline"
              size="sm"
              className="border-0 bg-[#2D2D2D] text-white transition-colors duration-200 hover:bg-[#3a3a3a] hover:text-white"
              onClick={() => setUrlToCopy(currentUrl)}
            >
              <FiShare2 size="14" className="mr-2" />
              Share
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="mb-6 w-80 border border-gray-700 bg-[#212121] p-3 shadow-xl"
            align="end"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={currentUrl + (isViewOnly ? "?mode=view" : "")}
                  readOnly
                  className="flex-1 border-none bg-[#2D2D2D] text-sm text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-0"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 transition-colors duration-200 hover:bg-[#3a3a3a]"
                  onClick={handleCopy}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={isCopied ? "check" : "copy"}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isCopied ? (
                        <FiCheck size="14" className="text-green-500" />
                      ) : (
                        <FiCopy size="14" className="text-white" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </div>

              {data ? (
                <div className="gap-0">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="view-only"
                      className="text-sm text-gray-300"
                    >
                      View-only mode
                    </Label>

                    <Switch
                      id="view-only"
                      checked={isViewOnly}
                      disabled={
                        fileData?.userEmail !== data?.user?.email ||
                        isViewOnlyLoading
                      }
                      onCheckedChange={handleViewOnlyToggle}
                      className="3x1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="view-only"
                      className="justify-center text-xs text-[#676565]"
                    >
                      When enabled, nobody can modify this file, except you.
                    </Label>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  {/* Sign in to enable view-only sharing */}
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
        {
          // status === "loading" ? (
          // <Avatar className="h-8 w-8">
          //   <AvatarFallback>😎</AvatarFallback>
          // </Avatar>
          // ) :
          status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild={true}>
                <Avatar className="h-8 w-8 cursor-pointer ring-offset-background transition-opacity hover:opacity-80">
                  <AvatarImage src={image ?? ""} />
                  {/* <AvatarFallback>😎</AvatarFallback> */}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 border border-gray-700 bg-[#1f1e1e] text-white shadow-xl"
              >
                <DropdownMenuItem
                  onClick={handleSignout}
                  className="cursor-pointer transition-colors duration-200 hover:bg-[#2a2a2a]"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={handleSignin}
              variant="outline"
              size="sm"
              className="border-0 bg-[#2D2D2D] text-white transition-colors duration-200 hover:bg-[#3a3a3a] hover:text-white"
            >
              <PiSignInLight size="16" className="mr-2" />
              Sign In
            </Button>
          )
        }
      </div>
    </div>
  );
};

export default Navbar;
