import {
  getSessionCookieName,
  getSessionCookieOptions,
} from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { adminProcedure, protectedProcedure } from "./_core/trpc";
import { applyWalletTransaction, createNewsStory, getOrCreateWallet, listNewsStories, removeNewsStory, updateNewsStory } from "./db";
import { z } from "zod";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(getSessionCookieName(ctx.req), {
        ...cookieOptions,
        maxAge: -1,
      });
      return {
        success: true,
      } as const;
    }),
  }),

  wallet: router({
    get: protectedProcedure.query(({ ctx }) => getOrCreateWallet(ctx.user.id)),
    deposit: protectedProcedure.input(z.object({ amount: z.number().int().positive().max(10000000) })).mutation(({ ctx, input }) => applyWalletTransaction(ctx.user.id, "deposit", input.amount)),
    withdraw: protectedProcedure.input(z.object({ amount: z.number().int().positive().max(10000000) })).mutation(({ ctx, input }) => applyWalletTransaction(ctx.user.id, "withdrawal", input.amount)),
  }),

  newsAdmin: router({
    list: publicProcedure.query(() => listNewsStories()),
    create: adminProcedure.input(z.object({ slug: z.string().min(1).max(120), title: z.string().min(1).max(220), dek: z.string().min(1), body: z.string().min(1), creator: z.string().min(1).max(160), status: z.enum(["sample", "verified"]).default("sample"), published: z.boolean().default(false) })).mutation(({ input }) => createNewsStory({ ...input, published: input.published ? 1 : 0 })),
    update: adminProcedure.input(z.object({ id: z.number().int().positive(), title: z.string().min(1).max(220).optional(), dek: z.string().min(1).optional(), body: z.string().min(1).optional(), creator: z.string().min(1).max(160).optional(), status: z.enum(["sample", "verified"]).optional(), published: z.boolean().optional() })).mutation(({ input }) => { const { id, published, ...rest } = input; return updateNewsStory(id, { ...rest, ...(published === undefined ? {} : { published: published ? 1 : 0 }) }); }),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => removeNewsStory(input.id)),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
