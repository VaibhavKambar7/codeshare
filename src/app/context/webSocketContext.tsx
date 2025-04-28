"use client";

import { nanoid } from "nanoid";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { getWsUrl } from "~/trpc/react";

interface WebSocketContextType {
  activeUsers: number;
  currentRoom: string | null;
  // cursors: Map<string, { id: string; x: number; y: number }>;
}

interface Message {
  type: string;
  payload: number | { id: string; x: number; y: number }[];
  room: string;
}

export const WebSocketContext = createContext<WebSocketContextType>({
  activeUsers: 0,
  currentRoom: null,
  // cursors: new Map(),
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: string;
}) => {
  const [activeUsers, setActiveUsers] = useState(0);
  // const [cursors, setCursors] = useState<
  //   Map<string, { id: string; x: number; y: number }>
  // >(new Map());
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let mounted = true;

    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      const ws = new WebSocket(getWsUrl());
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: "INIT",
            id: nanoid(10),
            room: roomId,
          }),
        );
      };

      ws.onmessage = (event) => {
        if (!mounted) return;
        try {
          const data = JSON.parse(event.data as string) as Message;
          if (data.type === "ACTIVE_USERS" && data.room === roomId) {
            setActiveUsers(data.payload as number);
          }
          // else if (data.type === "CURSORS" && data.room === roomId) {
          //   const newCursors = new Map();
          //   (data.payload as { id: string; x: number; y: number }[]).forEach(
          //     (cursor) => {
          //       newCursors.set(cursor.id, cursor);
          //     },
          //   );
          //   setCursors(newCursors);
          // }
        } catch (error) {
          console.error(error);
        }
      };

      ws.onclose = () => {
        if (!mounted) return;
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      mounted = false;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [roomId]);

  return (
    <WebSocketContext.Provider value={{ activeUsers, currentRoom: roomId }}>
      {children}
    </WebSocketContext.Provider>
  );
};
