import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer, WebSocket } from "ws";
import { appRouter } from "~/server/api/root";
import { type CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { createTRPCContext } from "./api/trpc";

const MAX_RECONNECTION_ATTEMPTS = 5;
const RECONNECTION_INTERVAL = 3000;

const rooms = new Map<string, Set<string>>();
let server: WebSocketServer | null = null;

const createContext = async ({}: CreateWSSContextFnOptions) => {
  const headers = new Headers();
  return createTRPCContext({
    headers,
  });
};

function setupWebSocketServer(port = 3001, host = "localhost") {
  try {
    server = new WebSocketServer({
      port,
      host,
      clientTracking: true,
    });

    const handler = applyWSSHandler({
      wss: server,
      router: appRouter,
      createContext,
    });

    server.on("error", (error) => {
      console.error("WebSocket server error:", error);
      restartServer();
    });

    server.on("close", () => {
      console.log("WebSocket server closed. Attempting to restart...");
      restartServer();
    });

    return { server, handler };
  } catch (error) {
    console.error("Failed to setup WebSocket server:", error);
    throw error;
  }
}

function restartServer(attempts = 0) {
  if (attempts >= MAX_RECONNECTION_ATTEMPTS) {
    console.error(
      "Maximum reconnection attempts reached. Manual intervention required.",
    );
    process.exit(1);
  }

  setTimeout(() => {
    try {
      if (server) {
        server.close();
      }
      const { server: newServer } = setupWebSocketServer();
      server = newServer;
      console.log("WebSocket server successfully restarted");
    } catch (error) {
      console.error(
        `Failed to restart WebSocket server (attempt ${attempts + 1}/${MAX_RECONNECTION_ATTEMPTS}):`,
        error,
      );
      restartServer(attempts + 1);
    }
  }, RECONNECTION_INTERVAL);
}

interface InitMessage {
  type: string;
  id: string;
  room: string;
}

interface ExtendedWebSocket extends WebSocket {
  roomId?: string;
  isAlive?: boolean;
  pingTimeout?: NodeJS.Timeout;
}

const broadcastActiveUsers = (roomId: string) => {
  if (!server) return;

  const room = rooms.get(roomId);

  if (!room) return;

  const activeUsers = room.size;

  console.log(`Broadcasting active users: ${activeUsers}`);

  const message = JSON.stringify({
    type: "ACTIVE_USERS",
    payload: activeUsers,
    room: roomId,
  });

  server.clients.forEach((client) => {
    const extendedClient = client as ExtendedWebSocket;
    if (
      extendedClient.roomId === roomId &&
      extendedClient.readyState === WebSocket.OPEN
    ) {
      try {
        extendedClient.send(message);
      } catch (error) {
        console.error(
          `Failed to send message to client in room ${roomId}:`,
          error,
        );
      }
    }
  });
};

function heartbeat(ws: ExtendedWebSocket) {
  ws.isAlive = true;
  if (ws.pingTimeout) clearTimeout(ws.pingTimeout);

  ws.pingTimeout = setTimeout(() => {
    ws.terminate();
  }, 30000 + 1000);
}

const { server: wss, handler } = setupWebSocketServer();

if (wss) {
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const extWs = ws as ExtendedWebSocket;
      if (extWs.isAlive === false) {
        return ws.terminate();
      }

      extWs.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(interval);
  });

  wss.on("connection", (ws) => {
    const extendedWs = ws as ExtendedWebSocket;
    extendedWs.isAlive = true;
    let connectionId: string | undefined;
    let currentRoom: string | undefined;

    heartbeat(extendedWs);
    extendedWs.on("pong", () => heartbeat(extendedWs));

    ws.on("message", (msg) => {
      try {
        const message =
          typeof msg === "string"
            ? msg
            : Buffer.isBuffer(msg)
              ? msg.toString()
              : "";
        const data = JSON.parse(message) as InitMessage;

        if (data.type === "INIT") {
          connectionId = data.id;
          currentRoom = data.room;
          extendedWs.roomId = currentRoom;

          if (!rooms.has(currentRoom)) {
            rooms.set(currentRoom, new Set());
          }

          const room = rooms.get(currentRoom);
          if (room && !room.has(connectionId)) {
            room.add(connectionId);
            console.log(`+ + Room (${currentRoom}) (${room.size})`);
            broadcastActiveUsers(currentRoom);
          }
        }
      } catch (e) {
        console.error("Error processing message:", e);
      }
    });

    ws.on("close", () => {
      if (extendedWs.pingTimeout) {
        clearTimeout(extendedWs.pingTimeout);
      }

      if (connectionId && currentRoom) {
        const room = rooms.get(currentRoom);
        if (room) {
          room.delete(connectionId);
          broadcastActiveUsers(currentRoom);
          if (room.size === 0) {
            rooms.delete(currentRoom);
          }
        }
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket connection error:", error);
      ws.terminate();
    });
  });
}

const shutdown = () => {
  console.log("Shutting down WebSocket server...");
  if (handler) {
    handler.broadcastReconnectNotification();
  }
  rooms.clear();
  if (wss) {
    wss.close(() => {
      console.log("WebSocket server closed successfully");
      process.exit(0);
    });
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  shutdown();
});

export { wss, handler };
