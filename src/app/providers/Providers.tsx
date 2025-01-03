"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "../context/themeContext";
import { WebSocketProvider } from "../context/webSocketContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TRPCReactProvider>
        <WebSocketProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </WebSocketProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
