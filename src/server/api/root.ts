import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { editorRouter, userFileRouter } from "./routers/editor";

export const appRouter = createTRPCRouter({
  editor: editorRouter,
  userFile: userFileRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
