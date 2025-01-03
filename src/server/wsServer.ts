// wsServer.ts
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";
import { appRouter } from "~/server/api/root";
import { type CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { createTRPCContext } from "./api/trpc";

const activeConnections = new Set<string>();

const createContext = async ({ req, res }: CreateWSSContextFnOptions) => {
  const headers = new Headers();
  return createTRPCContext({
    headers,
  });
};

const wss = new WebSocketServer({
  port: 9898,
});

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext,
});

interface InitMessage {
  type: string;
  id: string;
}

const broadcastActiveUsers = () => {
  const activeUsers = activeConnections.size;
  console.log("🚀 Active Users:", activeUsers);

  const message = JSON.stringify({
    type: "ACTIVE_USERS",
    payload: activeUsers,
  });

  wss.clients.forEach((client) => {
    client.send(message);
  });
};

wss.on("connection", (ws) => {
  let connectionId: string | undefined;

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
        if (!activeConnections.has(connectionId)) {
          activeConnections.add(connectionId);
          console.log(`+ + Connection (${activeConnections.size})`);
          broadcastActiveUsers();
        }
      }
    } catch (e) {
      console.log("Error parsing message:", e);
    }
  });

  ws.on("close", () => {
    if (connectionId) {
      activeConnections.delete(connectionId);
      console.log(`- - Connection (${activeConnections.size})`);
      broadcastActiveUsers();
    }
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  activeConnections.clear();
  wss.close();
});

export { wss, handler };
