import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { languages, themes } from "../../lib/theme";
import { useTheme } from "../context/themeContext";

const Sidebar = () => {
  const { theme, setTheme, language, setLanguage } = useTheme();
  const handleThemeChange = (value: string) => {
    setTheme(value);
  };
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <div className="flex h-full flex-col space-y-8 p-4">
      <div className="flex-none">
        <div className="text-xl font-semibold text-[#d1d1db]">Settings</div>
      </div>

      <div className="flex flex-none flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <label htmlFor="theme-select" className="text-[#d1d1db]">
            Theme:
          </label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-[140px] bg-[#2e3033] text-[#d1d1db]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="border-black-300 bg-[#2e3033] text-white">
              {Object.keys(themes).map((theme) => (
                <SelectItem
                  key={theme}
                  value={theme}
                  className="hover:cursor-pointer hover:bg-white hover:text-black"
                >
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="language-select" className="text-[#d1d1db]">
            Language:
          </label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px] bg-[#2e3033] text-[#d1d1db]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="border-black-300 bg-[#2e3033] text-white">
              {languages.map((language) => (
                <SelectItem
                  key={language}
                  value={language}
                  className="hover:cursor-pointer hover:bg-white hover:text-black"
                >
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
