"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "../context/themeContext";
import { WebSocketProvider } from "../context/webSocketContext";
import { useParams } from "next/navigation";

const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  return <WebSocketProvider roomId={slug}>{children}</WebSocketProvider>;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TRPCReactProvider>
        <RoomProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </RoomProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
