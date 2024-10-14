import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";
import { appRouter } from "~/server/api/root";
import { type CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { createTRPCContext } from "./api/trpc";

const createContext = ({ req, res }: CreateWSSContextFnOptions) => {
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

wss.on("connection", (ws) => {
  console.log(` + + Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(` - - Connection (${wss.clients.size})`);
  });
});

console.log("✅ WebSocket Server listening on ws://localhost:9898");

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});

export { wss, handler };
