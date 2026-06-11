import { query } from "../convex/_generated/server";
import { v } from "convex/values";

export const getSubs = query({
  args: {},
  handler: async (ctx) => {
    const subs = await ctx.db.query("subscriptions").collect();
    return subs;
  },
});

export const getSubtId = query({
  args: { subscriptionsId: v.id("subscriptions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.subscriptionsId);
  },
});
