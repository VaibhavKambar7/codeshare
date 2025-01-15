import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface ThemeContextType {
  language: string;
  setLanguage: (theme: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  title: string;
  setTitle: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<string>("GitHubDark");
  const [language, setLanguage] = useState<string>("javascript");
  const [title, setTitle] = useState<string>("Untitled");

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, title, setTitle, language, setLanguage }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
