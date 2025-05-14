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

const Sidebar = ({ slug }: { slug: string }) => {
  const { theme, setTheme, language, setLanguage } = useTheme();

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem(`editorLanguage_${slug}`, value);
  };

  return (
    <div className="flex h-full flex-col space-y-8 rounded-lg bg-white p-4 text-black">
      <div className="flex-none">
        <div className="text-xl font-semibold">Settings</div>
      </div>

      <div className="flex flex-none flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <label htmlFor="theme-select" className="text-gray-700">
            Theme:
          </label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="h-10 w-48 border border-gray-300 bg-white text-gray-700">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="max-h-60 w-48 overflow-y-auto border border-gray-300 bg-white text-gray-700">
              {Object.keys(themes).map((theme) => (
                <SelectItem
                  key={theme}
                  value={theme}
                  className="hover:cursor-pointer hover:bg-gray-100 hover:text-black"
                >
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="language-select" className="text-gray-700">
            Language:
          </label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-10 w-48 border border-gray-300 bg-white text-gray-700">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="max-h-60 w-48 overflow-y-auto border border-gray-300 bg-white text-gray-700">
              {languages.map((language) => (
                <SelectItem
                  key={language}
                  value={language}
                  className="hover:cursor-pointer hover:bg-gray-100 hover:text-black"
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
