import { defineSchema, defineTable } from 'convex/server';
import { v }from 'convex/values';
import { subscribe } from 'node:diagnostics_channel';
import { title } from 'node:process';

export default defineSchema({
    users: defineTable({
        email: v.string(),
        name: v.string(),
        clerkId: v.string(),
        username: v.optional(v.string()),
        phone: v.optional(v.string()),
        stripeCustomerId: v.optional(v.string()),
        currentSubscriptionPlanId: v.optional(v.id("subscriptionPlans")),
    }).index("clerkId", ["clerkId"]),

    subscriptions: defineTable({
        title: v.string(),
        description: v.string(),
        imageUrl: v.string(),
        price: v.string(),
    }),

    payments: defineTable({
        userId: v.id("users"),
        subscriptionId: v.id("subscriptions"),
        stripeSessionId: v.string(),
        purchaseDate: v.number(),
        amount: v.string(),
    }).index("user_subscription", ["userId", "subscriptionId"]),

    subscriptionPlans: defineTable({
        userId: v.id("users"),
        planType: v.union(v.literal("monthly"), v.literal("yearly")),
        currentPeriodStart: v.number(),
        currentPeriodEnd: v.number(),
        stripeSubscriptionId: v.string(),
        status: v.string(),
        cancelAtPeriodEnd: v.boolean(),
    }).index("user_plan", ["stripeSubscriptionId"]),
});