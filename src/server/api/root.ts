import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { editorRouter } from "./routers/editor";

export const appRouter = createTRPCRouter({
  editor: editorRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
