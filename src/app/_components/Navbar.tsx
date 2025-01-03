import React, { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FiShare2 } from "react-icons/fi";
import { PiSignInLight } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "../context/themeContext";
import { useWebSocket } from "../context/webSocketContext";
import { FaUser } from "react-icons/fa6";

const Navbar = () => {
  const { title, setTitle } = useTheme();
  const { status } = useSession();
  const { activeUsers } = useWebSocket();
  const wsRef = useRef<WebSocket | null>(null);
  const connectionIdRef = useRef<string>(
    `tab_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  );

  // interface Message {
  //   type: string;
  //   payload: number;
  // }

  useEffect(() => {
    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      const ws = new WebSocket("ws://localhost:9898");
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: "INIT",
            id: connectionIdRef.current,
          }),
        );
      };

      // ws.onmessage = (event) => {
      //   try {
      //     const data = JSON.parse(event.data as string) as Message;
      //     if (data.type === "ACTIVE_USERS") {
      //       setActiveUsers(data.payload);
      //     }
      //   } catch (error) {
      //     console.error("Error parsing WebSocket message:", error);
      //   }
      // };

      ws.onclose = () => {
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const handleSignin = () => signIn("google");
  const handleSignout = () => signOut();

  return (
    <div className="h-18 flex items-center justify-between bg-[#1f1e1e] p-3">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Image src="/assets/coding.png" alt="logo" width="40" height="40" />
        </Link>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-none bg-[#212121] p-1 text-sm text-white focus:ring-0"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="mr-4 flex flex-row items-center text-sm text-gray-400">
          <FaUser size="16" className="mr-1" />
          {activeUsers}
        </span>
        <Button
          variant="outline"
          className="border-0 bg-[#2D2D2D] px-2 py-1 text-sm text-white"
        >
          Share
          <FiShare2 size="16" className="ml-1" />
        </Button>
        {status === "authenticated" ? (
          <Button
            onClick={handleSignout}
            variant="outline"
            className="border-0 bg-[#2D2D2D] px-2 py-1 text-sm text-white"
          >
            Sign Out
            <PiSignInLight size="19" className="ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSignin}
            variant="outline"
            className="border-0 bg-[#2D2D2D] px-2 py-1 text-sm text-white"
          >
            Sign In
            <PiSignInLight size="19" className="ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
