import { defineSchema, defineTable } from 'convex/server';
import { v }from 'convex/values';

export default defineSchema({
    users: defineTable({
        email: v.string(),
        name: v.string(),
        clerkId: v.string(),
        username: v.optional(v.string()),
        phone: v.optional(v.string()),
    }).index("clerkId", ["clerkId"]),
})