import { HttpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { internal } from "./_generated/api";
import stripeClient from "../next-app/lib/stripe";

const http = new HttpRouter();

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        console.log("Webhook received");

        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("MISSING: CLERK_WEBHOOK_SECRET");
            return new Response("Unauthorized", { status: 401 });
        }
        console.log("Webhook secret present");

        const svix_id = request.headers.get("svix-id");
        const svix_timestamp = request.headers.get("svix-timestamp");
        const svix_signature = request.headers.get("svix-signature");

        console.log("Headers:", { svix_id, svix_timestamp, svix_signature });

        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.error("MISSING: svix headers");
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await request.text();
        console.log("Body length:", body.length);

        const wh = new Webhook(webhookSecret);
        let event: WebhookEvent;

        try {
            event = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent;
            console.log("Signature verified, event type:", event.type);
        } catch (err) {
            console.error("VERIFY FAILED:", err);
            return new Response("Unauthorized", { status: 401 });
        }

        if (event.type === "user.created") {
            const { id, email_addresses, phone_numbers, username, first_name, last_name, external_accounts } = event.data;

            const email = email_addresses[0]?.email_address ?? "";
            const phone = phone_numbers[0]?.phone_number;

            const oauthName = [
                external_accounts[0]?.first_name,
                external_accounts[0]?.last_name
            ].filter(Boolean).join(" ").trim();

            const name = [first_name, last_name].filter(Boolean).join(" ").trim()
                || oauthName
                || username
                || "Unknown";

            console.log("Creating user:", { id, email, name, username, phone });

            try {
                const customer = stripeClient.customers.create({
                    email,
                    name,
                    phone,
                    metadata: { clerkId: id },
                })

                await ctx.runMutation(internal.users.createUser, {
                    clerkId: id,
                    email,
                    name,
                    username: username ?? undefined,
                    phone: phone ?? undefined,
                    stripeCustomerId: (await customer).id ?? undefined,
                });
                console.log("User created successfully");
            } catch (err) {
                console.error("MUTATION FAILED:", err);
                return new Response("Error creating user", { status: 500 });
            }
        }

        return new Response("OK", { status: 200 });
    }),
});

export default http;