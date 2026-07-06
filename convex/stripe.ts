import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import StripeClient from "../src/lib/stripe"
import ratelimit from "../src/lib/ratelimit"



export const CreateCheckoutSession = action({
    args: { subId: v.id("subscriptions") },
    handler: async (ctx, args):Promise<{checkoutUrl: string | null}> => {
        const identity = await ctx.auth.getUserIdentity();    

        if (!identity) {
            throw new ConvexError("Unauthorized");
        }   

        const user = await ctx.runQuery(api.users.getUserByClerkId, {
            clerkId: identity.subject
        });

        if (!user) {
            throw new ConvexError("User Not Found");
        }

        
        const ratelimitKey = `checkout-limit:${user._id}`;
        const { success } = await ratelimit.limit(ratelimitKey);

        if (!success) {
            throw new Error(`Rate limit exceeded. Please try again later.`);
        }


        const sub = await ctx.runQuery(api.subs.getSubById, {
            subscriptionId: args.subId
        })

        if (!sub) {
            throw new ConvexError("Subscription Not Found")
        }

        const session = await StripeClient.checkout.sessions.create({
            customer: user.stripeCustomerId,
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: sub.title,
                            ...(sub.imageUrl ? sub.imageUrl.startsWith("https://") && { images: [sub.imageUrl] } : {})
                        },
                        unit_amount: Math.round(parseFloat(sub.price.replace(/[^0-9.]/g, "")) * 100)
                    },
                    quantity: 1
                }
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions/${args.subId}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions`,
            metadata: {
                subId: args.subId,
                userId: user._id
            }
        })

        return { checkoutUrl: session.url}
    }

})