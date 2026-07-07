import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updatePaymentRecord = mutation({
    args: {
        userId: v.id("users"),
        subscriptionId: v.id("subscriptions"),
        amount: v.string(),
        stripeSessionId: v.string(),
    },
    handler: async (ctx, args) => {
        const { userId, subscriptionId, amount, stripeSessionId } = args;

        const paymentRecord = await ctx.db.insert("payments", {
            userId,
            subscriptionId,
            amount,
            stripeSessionId,
            purchaseDate: Date.now(),
        })

        return paymentRecord;
    }
    }
)