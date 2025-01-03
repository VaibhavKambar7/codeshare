import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import themes from "../../lib/theme";
import { useTheme } from "../context/themeContext";

const Sidebar = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <div className="text-xl font-semibold text-[#d1d1db]">Settings</div>
      <div className="flex items-center space-x-4">
        <div className="text-[#d1d1db]">Editor Theme:</div>
        <Select value={theme} onValueChange={handleThemeChange}>
          <SelectTrigger className="w-[180px] bg-black text-[#d1d1db]">
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
      </div>
    </div>
  );
};

export default Sidebar;
