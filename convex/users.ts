import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = internalMutation({
    args: {
        email: v.string(),
        name: v.string(),
        clerkId: v.string(),
        username: v.optional(v.string()),
        phone: v.optional(v.string()),
    },
    handler: async (ctx, args) => { 
        const existingUser = await ctx.db.query("users")
            .withIndex("clerkId", q => q.eq("clerkId", args.clerkId)).unique();
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
        });
        return newUser;

    }


});