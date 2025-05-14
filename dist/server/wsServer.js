import { applyWSSHandler as G } from "@trpc/server/adapters/ws";
import { WebSocketServer as K, WebSocket as Q } from "ws";
import { initTRPC as q } from "@trpc/server";
import { getServerSession as B } from "next-auth";
import M from "superjson";
import { ZodError as z } from "zod";
import { PrismaClient as $ } from "@prisma/client";
import { createEnv as V } from "@t3-oss/env-nextjs";
import { z as k } from "zod";
var v = V({
  server: {
    DATABASE_URL: k.string().url(),
    NODE_ENV: k
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: "production",
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: !0,
});
var j = () =>
    new $({
      log:
        v.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    }),
  T = globalThis,
  E = T.prisma ?? j();
v.NODE_ENV !== "production" && (T.prisma = E);
var C = async (e) => ({ db: E, ...e }),
  g = q.context().create({
    transformer: M,
    errorFormatter({ shape: e, error: t }) {
      return {
        ...e,
        data: {
          ...e.data,
          zodError: t.cause instanceof z ? t.cause.flatten() : null,
        },
      };
    },
  }),
  L = g.middleware,
  H = L(async (e) => {
    let t = await B();
    if (!t?.user) throw new Error("Not authorized");
    return e.next({ ctx: { session: t } });
  }),
  N = g.createCallerFactory,
  w = g.router,
  a = g.procedure,
  ue = g.procedure.use(H);
import { EventEmitter as J } from "events";
import { observable as O } from "@trpc/server/observable";
import { z as i } from "zod";
import { z as c } from "zod";
var x = c.object({
    name: c.string().nullable(),
    email: c.string().email().nullable(),
  }),
  F = c.object({
    title: c.string(),
    content: c.string(),
    link: c.string(),
    language: c.string().optional(),
    isFavourite: c.boolean().optional(),
    ownerId: c.string().nullable().optional(),
  });
import { TRPCError as u } from "@trpc/server";
var d = new J(),
  U = w({
    onContentUpdate: a.input(i.string()).subscription(({ input: e }) =>
      O((t) => {
        let r = (n) => {
          n.room === e && t.next(n.content);
        };
        return (
          d.on("contentUpdate", r),
          () => {
            d.off("contentUpdate", r);
          }
        );
      }),
    ),
    updateContent: a
      .input(i.object({ room: i.string(), content: i.string() }))
      .mutation(({ input: e }) => {
        d.emit("contentUpdate", e);
      }),
    updateCursor: a
      .input(
        i.object({
          room: i.string(),
          cursor: i.object({
            id: i.string(),
            name: i.string(),
            email: i.string(),
            position: i.object({ lineNumber: i.number(), column: i.number() }),
          }),
        }),
      )
      .mutation(({ input: e }) => {
        let { room: t, cursor: r } = e;
        return d.emit(`CURSOR_${t}`, r), { success: !0 };
      }),
    onCursorUpdate: a.input(i.string()).subscription(({ input: e }) =>
      O((t) => {
        let r = (n) => t.next(n);
        return (
          d.on(`CURSOR_${e}`, r),
          () => {
            d.off(`CURSOR_${e}`, r);
          }
        );
      }),
    ),
  }),
  A = w({
    createUserFileMutation: a
      .input(i.object({ userData: x, fileData: F }))
      .mutation(async ({ ctx: e, input: t }) => {
        let { userData: r, fileData: n } = t;
        try {
          return r?.email
            ? await e.db.$transaction(async (o) => {
                if (r?.email) {
                  let s = await o.user.upsert({
                    where: { email: r.email },
                    update: { name: r.name ?? null },
                    create: { email: r.email, name: r.name ?? null },
                  });
                  return await o.file.upsert({
                    where: { link: n.link },
                    update: {
                      title: n.title ?? null,
                      content: n.content,
                      language: n.language,
                      owner: { connect: { id: s.id } },
                    },
                    create: {
                      title: n.title,
                      content: n.content,
                      link: n.link,
                      language: n.language,
                      owner: { connect: { id: s.id } },
                    },
                    include: { owner: !0 },
                  });
                }
              })
            : await e.db.file.upsert({
                where: { link: n.link },
                update: {
                  title: n.title ?? "Untitled",
                  content: n.content,
                  language: n.language,
                },
                create: {
                  title: n.title,
                  content: n.content,
                  link: n.link,
                  language: n.language,
                },
                include: { owner: !0 },
              });
        } catch (o) {
          if (o instanceof Error) {
            if (o.message.includes("Unique constraint"))
              throw new u({
                code: "CONFLICT",
                message: "A file with this link already exists",
              });
            if (o.message.includes("Foreign key constraint"))
              throw new u({
                code: "BAD_REQUEST",
                message: "Invalid user reference",
              });
          }
          throw (
            (console.error("Error saving file:", o),
            new u({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to save file",
            }))
          );
        }
      }),
    getFileData: a.input(i.string()).query(async ({ ctx: e, input: t }) => {
      let r = t,
        n = await e.db.file.findUnique({
          where: { link: r },
          include: { owner: !0 },
        });
      if (!n) throw new u({ code: "NOT_FOUND", message: "File not found" });
      return {
        content: n.content,
        title: n.title,
        isFavourite: n.isFavourite,
        language: n.language ?? "",
        userEmail: n?.owner?.email,
        isViewOnly: n?.isViewOnly,
      };
    }),
    getAllFiles: a.input(i.string()).query(async ({ ctx: e, input: t }) => {
      let r = t,
        n = await e.db.user.findUnique({
          where: { email: r },
          include: {
            files: {
              orderBy: { updatedAt: "desc" },
              select: { title: !0, link: !0, isFavourite: !0 },
            },
          },
        });
      if (!n) throw new u({ code: "NOT_FOUND", message: "User not found" });
      return n.files.map((s) => ({
        title: s.title,
        link: s.link,
        isFavourite: s.isFavourite,
      }));
    }),
    toggleFavourite: a
      .input(i.string())
      .mutation(async ({ ctx: e, input: t }) => {
        let r = await e.db.file.findUnique({ where: { link: t } });
        if (!r) throw new u({ code: "NOT_FOUND", message: "File not found" });
        return await e.db.file.update({
          where: { link: t },
          data: { isFavourite: !r.isFavourite },
        });
      }),
    toggleViewOnly: a
      .input(
        i.object({
          link: i.string(),
          isViewOnly: i.boolean(),
          userEmail: i.string(),
        }),
      )
      .mutation(async ({ ctx: e, input: t }) => {
        let r = await e.db.file.findUnique({
          where: { link: t.link },
          include: { owner: !0 },
        });
        if (!r) throw new u({ code: "NOT_FOUND", message: "File not found" });
        if (r.owner?.email !== t.userEmail)
          throw new u({
            code: "FORBIDDEN",
            message: "Only the owner can modify view-only status",
          });
        return await e.db.file.update({
          where: { link: t.link },
          data: { isViewOnly: t.isViewOnly },
        });
      }),
  });
var y = w({ editor: U, userFile: A }),
  Re = N(y);
var D = 5,
  X = 3e3,
  m = new Map(),
  l = null,
  Z = async ({}) => {
    let e = new Headers();
    return C({ headers: e });
  };
function P(e = 3001, t = "localhost") {
  try {
    l = new K({ port: e, host: t, clientTracking: !0 });
    let r = G({ wss: l, router: y, createContext: Z });
    return (
      l.on("error", (n) => {
        console.error("WebSocket server error:", n), h();
      }),
      l.on("close", () => {
        console.log("WebSocket server closed. Attempting to restart..."), h();
      }),
      { server: l, handler: r }
    );
  } catch (r) {
    throw (console.error("Failed to setup WebSocket server:", r), r);
  }
}
function h(e = 0) {
  e >= D &&
    (console.error(
      "Maximum reconnection attempts reached. Manual intervention required.",
    ),
    process.exit(1)),
    setTimeout(() => {
      try {
        l && l.close();
        let { server: t } = P();
        (l = t), console.log("WebSocket server successfully restarted");
      } catch (t) {
        console.error(
          `Failed to restart WebSocket server (attempt ${e + 1}/${D}):`,
          t,
        ),
          h(e + 1);
      }
    }, X);
}
var _ = (e) => {
  if (!l) return;
  let t = m.get(e);
  if (!t) return;
  let r = t.size;
  console.log(`Broadcasting active users: ${r}`);
  let n = JSON.stringify({ type: "ACTIVE_USERS", payload: r, room: e });
  l.clients.forEach((o) => {
    let s = o;
    if (s.roomId === e && s.readyState === Q.OPEN)
      try {
        s.send(n);
      } catch (f) {
        console.error(`Failed to send message to client in room ${e}:`, f);
      }
  });
};
function W(e) {
  (e.isAlive = !0),
    e.pingTimeout && clearTimeout(e.pingTimeout),
    (e.pingTimeout = setTimeout(() => {
      e.terminate();
    }, 31e3));
}
var { server: p, handler: I } = P();
if (p) {
  let e = setInterval(() => {
    p.clients.forEach((t) => {
      let r = t;
      if (r.isAlive === !1) return t.terminate();
      (r.isAlive = !1), t.ping();
    });
  }, 3e4);
  p.on("close", () => {
    clearInterval(e);
  }),
    p.on("connection", (t) => {
      let r = t;
      r.isAlive = !0;
      let n, o;
      W(r),
        r.on("pong", () => W(r)),
        t.on("message", (s) => {
          try {
            let f =
                typeof s == "string"
                  ? s
                  : Buffer.isBuffer(s)
                    ? s.toString()
                    : "",
              S = JSON.parse(f);
            if (S.type === "INIT") {
              (n = S.id),
                (o = S.room),
                (r.roomId = o),
                m.has(o) || m.set(o, new Set());
              let b = m.get(o);
              b &&
                !b.has(n) &&
                (b.add(n), console.log(`+ + Room (${o}) (${b.size})`), _(o));
            }
          } catch (f) {
            console.error("Error processing message:", f);
          }
        }),
        t.on("close", () => {
          if ((r.pingTimeout && clearTimeout(r.pingTimeout), n && o)) {
            let s = m.get(o);
            s && (s.delete(n), _(o), s.size === 0 && m.delete(o));
          }
        }),
        t.on("error", (s) => {
          console.error("WebSocket connection error:", s), t.terminate();
        });
    });
}
var R = () => {
  console.log("Shutting down WebSocket server..."),
    I && I.broadcastReconnectNotification(),
    m.clear(),
    p &&
      p.close(() => {
        console.log("WebSocket server closed successfully"), process.exit(0);
      });
};
process.on("SIGTERM", R);
process.on("SIGINT", R);
process.on("uncaughtException", (e) => {
  console.error("Uncaught exception:", e), R();
});
export { I as handler, p as wss };
