import { internalMutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createUser = internalMutation({
    args: {
        email: v.string(),
        name: v.string(),
        clerkId: v.string(),
        username: v.optional(v.string()),
        phone: v.optional(v.string()),
        stripeCustomerId: v.optional(v.string()),
    },
    handler: async (ctx, args) => { 
        const existingUser = await ctx.db.query("users")
            .withIndex("by_clerkId", q => q.eq("clerkId", args.clerkId)).unique();
        if (existingUser) {
            console.log("User already exists");
            return existingUser._id;
        }

        const newUser = await ctx.db.insert("users", {
            email: args.email,
            name: args.name,
            clerkId: args.clerkId,
            username: args.username,
            phone: args.phone,
            stripeCustomerId: args.stripeCustomerId,
        });
        return newUser;

    }


});

export const getUserByClerkId = query({
    args: { clerkId: v.string(), },
    handler: async (ctx, args) => {
        return await ctx.db.query("users")
            .withIndex("by_clerkId", q => q.eq("clerkId", args.clerkId)).unique();
    }
});

export const getUserByStripeCustomerId = query({
    args: { stripeCustomerId: v.string(), },
    handler: async (ctx, args) => {
        return await ctx.db.query("users")
            .withIndex("by_stripeCustomerId", q => q.eq("stripeCustomerId", args.stripeCustomerId)).unique();
    }
});


export const getUserAccess = query({
    args: { userId: v.id("users"), subscriptionId: v.id("subscriptions") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new ConvexError("User not found");
        }

        if (user.currentSubscriptionPlanId) {
            const subscriptionPlan = await ctx.db.get(user.currentSubscriptionPlanId);
            if (subscriptionPlan && subscriptionPlan.status === "active") {
                return { hasAccess: true, accessType: "subscription" };
            }
        }

        const purchases = await ctx.db.query("payments")
            .withIndex("user_subscription", q => q.eq("userId", args.userId).eq("subscriptionId", args.subscriptionId))
            .unique();
        
        if (purchases) {
            return { hasAccess: true, accessType: "subscription" };
        }

        return { hasAccess: false, accessType: "none" };
    }
});