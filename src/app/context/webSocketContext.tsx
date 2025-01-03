// contexts/WebSocketContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

interface WebSocketContextType {
  activeUsers: number;
}

interface Message {
  type: string;
  payload: number;
}

export const WebSocketContext = createContext<WebSocketContextType>({
  activeUsers: 0,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeUsers, setActiveUsers] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let mounted = true;

    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      const ws = new WebSocket("ws://localhost:9898");
      wsRef.current = ws;

      ws.onmessage = (event) => {
        if (!mounted) return;
        try {
          const data = JSON.parse(event.data as string) as Message;
          if (data.type === "ACTIVE_USERS") {
            setActiveUsers(data.payload);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
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
  }, []);

  return (
    <WebSocketContext.Provider value={{ activeUsers }}>
      {children}
    </WebSocketContext.Provider>
  );
};
