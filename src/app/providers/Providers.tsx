"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "../context/themeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TRPCReactProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
