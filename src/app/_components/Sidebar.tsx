import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { languages, themes } from "../../lib/theme";
import { useTheme } from "../context/themeContext";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { PiSpinnerBold } from "react-icons/pi";

const Sidebar = () => {
  const { theme, setTheme, language, setLanguage } = useTheme();
  const handleThemeChange = (value: string) => {
    setTheme(value);
  };
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? "";
  const handleLink = (link: string) => {
    router.push(`/f/${link}`);
  };
  const {
    data: files,
    isLoading,
    error,
  } = api.userFile.getAllFiles.useQuery(userEmail);

  return (
    <div className="flex h-full flex-col space-y-6 p-4">
      <div className="flex-none">
        <div className="text-xl font-semibold text-[#d1d1db]">Settings</div>
      </div>

      <div className="flex-none">
        <div className="flex items-center space-x-4">
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-[140px] bg-black text-[#d1d1db]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="border-black-300 bg-black text-white">
              {Object.keys(themes).map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px] bg-black text-[#d1d1db]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="border-black-300 bg-black text-white">
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-none">
          <div className="text-lg font-semibold text-[#d1d1db]">Recent</div>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          {isLoading && (
            <div className="mt-40 flex animate-spin items-center justify-center text-3xl text-[#d1d1db]">
              <PiSpinnerBold />
            </div>
          )}
          {error && <div className="text-[#d1d1db]">Error loading files</div>}
          {files && (
            <ul className="space-y-2">
              {files.map((file) => (
                <li
                  key={file.link}
                  className={`mb-2 cursor-pointer rounded-md p-2 text-[#d1d1db] ${
                    slug === file.link ? "bg-[#3a3a3a]" : "hover:bg-[#262525]"
                  }`}
                  onClick={() => handleLink(file.link)}
                >
                  {file.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
