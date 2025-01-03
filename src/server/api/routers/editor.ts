import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { fileDataSchema, userDataSchema } from "~/lib/types";
import { TRPCError } from "@trpc/server";

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

export const userFileRouter = createTRPCRouter({
  createUserFileMutation: publicProcedure
    .input(
      z.object({
        userData: userDataSchema,
        fileData: fileDataSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userData, fileData } = input;
      try {
        if (userData?.email) {
          return await ctx.db.$transaction(async (tx) => {
            if (userData?.email) {
              const user = await tx.user.upsert({
                where: {
                  email: userData.email,
                },
                update: {
                  name: userData.name ?? null,
                },
                create: {
                  email: userData.email,
                  name: userData.name ?? null,
                },
              });

              return await tx.file.upsert({
                where: {
                  link: fileData.link,
                },
                update: {
                  title: fileData.title ?? null,
                  content: fileData.content,
                  owner: {
                    connect: {
                      id: user.id,
                    },
                  },
                },
                create: {
                  title: fileData.title,
                  content: fileData.content,
                  link: fileData.link,
                  owner: {
                    connect: {
                      id: user.id,
                    },
                  },
                },
                include: {
                  owner: true,
                },
              });
            }
          });
        } else {
          return await ctx.db.file.upsert({
            where: {
              link: fileData.link,
            },
            update: {
              title: fileData.title ?? "Untitled",
              content: fileData.content,
            },
            create: {
              title: fileData.title,
              content: fileData.content,
              link: fileData.link,
            },
            include: {
              owner: true,
            },
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("Unique constraint")) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A file with this link already exists",
            });
          }
          if (error.message.includes("Foreign key constraint")) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid user reference",
            });
          }
        }
        console.error("Error saving file:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save file",
        });
      }
    }),
});
