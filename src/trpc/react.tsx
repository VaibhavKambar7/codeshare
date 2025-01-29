"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  loggerLink,
  unstable_httpBatchStreamLink,
  wsLink,
  createWSClient,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";
import { type AppRouter } from "~/server/api/root";

const createQueryClient = () => new QueryClient();
let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function getWsUrl() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (process.env.NODE_ENV === "production") {
      return `ws://${hostname}:3001`;
    }
    console.log("im here");
    return "ws://localhost:3001";
  }
  return process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3001";
}

function getEndingLink() {
  if (typeof window === "undefined") {
    return unstable_httpBatchStreamLink({
      url: getBaseUrl() + "/api/trpc",
      headers: () => {
        const headers = new Headers();
        headers.set("x-trpc-source", "server");
        return headers;
      },
      transformer: SuperJSON,
    });
  }

  const client = createWSClient({
    url: getWsUrl(),
    onOpen: () => {
      console.log("tRPC WebSocket connected");
    },
    onClose: () => {
      console.log("tRPC WebSocket closed");
    },
    onError: (error) => {
      console.error("tRPC WebSocket error:", error);
    },
  });
  return wsLink<AppRouter>({
    client,
    transformer: SuperJSON,
  });
}

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        getEndingLink(),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
