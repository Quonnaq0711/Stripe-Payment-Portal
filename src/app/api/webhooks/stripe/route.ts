import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { api } from "../../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
    const sig = req.headers.get("stripe-signature") as string;
    const body = await req.text();
    
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err:any) {
        console.error("Webhook signature failed:", err.message);
        return new Response("Webhook signature verification failed", { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
                break;
        }
    } catch (err:any) {
        console.error("Error handling webhook:", err.message);
        return new Response("Error handling webhook", { status: 500 });
    }

    return new Response("Webhook received", { status: 200 });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const subId = session.metadata?.subId;
    const StripeCustomerId = session.customer as string;

    if (!subId || !StripeCustomerId) {
        throw new Error("Missing subscription ID or Stripe customer ID");
    }
    
    const user = await convex.query(api.users.getUserByStripeCustomerId, { stripeCustomerId: StripeCustomerId });

    if (!user) {
        throw new Error("User Stripe customer ID not found");
    }

    await convex.mutation(api.payments.updatePaymentRecord, {
        userId: user._id,
        subscriptionId: subId,
        amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00",
        stripeSessionId: session.id,
    });

    // TODO: completed email notification to user about successful payment

}