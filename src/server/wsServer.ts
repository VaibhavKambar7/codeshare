import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer, type WebSocket } from "ws";
import { appRouter } from "~/server/api/root";
import { type CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { createTRPCContext } from "./api/trpc";

const rooms = new Map<string, Set<string>>();

const createContext = async ({}: CreateWSSContextFnOptions) => {
  const headers = new Headers();
  return createTRPCContext({
    headers,
  });
};

const wss = new WebSocketServer({
  port: 3001,
  host: "localhost",
});

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext,
});

interface InitMessage {
  type: string;
  id: string;
  room: string;
}

interface ExtendedWebSocket extends WebSocket {
  roomId?: string;
}

const broadcastActiveUsers = (roomId: string) => {
  const room = rooms.get(roomId);

  if (!room) return;

  const activeUsers = room.size;

  console.log(`Broadcasting active users: ${activeUsers}`);

  const message = JSON.stringify({
    type: "ACTIVE_USERS",
    payload: activeUsers,
    room: roomId,
  });

  wss.clients.forEach((client) => {
    const extendedClient = client as ExtendedWebSocket;
    if (extendedClient.roomId === roomId) {
      extendedClient.send(message);
    }
  });
};

wss.on("connection", (ws) => {
  const extendedWs = ws as ExtendedWebSocket;
  let connectionId: string | undefined;
  let currentRoom: string | undefined;

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
      console.log("Error parsing message:", e);
    }
  });

  ws.on("close", () => {
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
});

process.on("SIGTERM", () => {
  handler.broadcastReconnectNotification();
  rooms.clear();
  wss.close();
});

export { wss, handler };
