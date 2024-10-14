import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const ee = new EventEmitter();

export const editorRouter = createTRPCRouter({
  onContentUpdate: publicProcedure.subscription(() => {
    return observable<string>((emit) => {
      const onContentUpdate = (content: string) => {
        emit.next(content);
      };

      ee.on("contentUpdate", onContentUpdate);

      return () => {
        ee.off("contentUpdate", onContentUpdate);
      };
    });
  }),

  updateContent: publicProcedure.input(z.string()).mutation(({ input }) => {
    ee.emit("contentUpdate", input);
  }),
});
