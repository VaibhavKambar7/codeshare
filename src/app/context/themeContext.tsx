import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface ThemeContextType {
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
  const [title, setTitle] = useState<string>("Untitled");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, title, setTitle }}>
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
