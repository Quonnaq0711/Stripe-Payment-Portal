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
    }).index("clerkId", ["clerkId"]),

    subscriptions: defineTable({
        title: v.string(),
        description: v.string(),
        imageUrl: v.string(),
        price: v.string(),
    })
});