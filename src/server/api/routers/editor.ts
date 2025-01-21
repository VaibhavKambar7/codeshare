import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { fileDataSchema, userDataSchema } from "~/lib/types";
import { TRPCError } from "@trpc/server";

interface ContentUpdate {
  room: string;
  content: string;
}

const ee = new EventEmitter();

export const editorRouter = createTRPCRouter({
  onContentUpdate: publicProcedure
    .input(z.string())
    .subscription(({ input: roomId }) => {
      return observable<string>((emit) => {
        const onContentUpdate = (update: ContentUpdate) => {
          if (update.room === roomId) {
            emit.next(update.content);
          }
        };
        ee.on("contentUpdate", onContentUpdate);
        return () => {
          ee.off("contentUpdate", onContentUpdate);
        };
      });
    }),
  updateContent: publicProcedure
    .input(z.object({ room: z.string(), content: z.string() }))
    .mutation(({ input }) => {
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

  getFileData: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const slug = input;

      const file = await ctx.db.file.findUnique({
        where: {
          link: slug,
        },
        include: {
          owner: true,
        },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      return {
        content: file.content,
        title: file.title,
        isFavourite: file.isFavourite,
        userEmail: file?.owner?.email,
        isViewOnly: file?.isViewOnly,
      };
    }),

  getAllFiles: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userEmail = input;

      const user = await ctx.db.user.findUnique({
        where: { email: userEmail },
        include: {
          files: {
            orderBy: {
              updatedAt: "desc",
            },
            select: {
              title: true,
              link: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const files = user.files.map((file) => ({
        title: file.title,
        link: file.link,
      }));

      return files;
    }),

  toggleFavourite: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.db.file.findUnique({
        where: { link: input },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      return await ctx.db.file.update({
        where: { link: input },
        data: {
          isFavourite: !file.isFavourite,
        },
      });
    }),

  toggleViewOnly: publicProcedure
    .input(
      z.object({
        link: z.string(),
        isViewOnly: z.boolean(),
        userEmail: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.db.file.findUnique({
        where: {
          link: input.link,
        },
        include: {
          owner: true,
        },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      if (file.owner?.email !== input.userEmail) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the owner can modify view-only status",
        });
      }

      return await ctx.db.file.update({
        where: {
          link: input.link,
        },
        data: { isViewOnly: input.isViewOnly },
      });
    }),
});
