'use node'
import { HttpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix"; 
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";

const http = new HttpRouter();


const clerkwebhook = httpAction(async ( ctx, request ) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    const signature = request.headers.get("Clerk-Signature");
    

    if (!signature || !webhookSecret) {
        console.error("Missing signature or webhook secret");
        return new Response("Unauthorized", { status: 401 });
    }


    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");
    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error("Missing svix headers");
        return new Response("Unauthorized", { status: 401 });
    }
    
    const payload = await request.json();
    const body = JSON.stringify(payload);   
    
    const wh = new Webhook(webhookSecret);
    let event: WebhookEvent;


    try {
        event = wh.verify(body, {
            "svix-signature": svix_signature,
            "svix-timestamp": svix_timestamp,
            "svix-id": svix_id
        }) as WebhookEvent
    } catch (err) {
        console.error("Invalid signature", err);
        return new Response("Unauthorized", { status: 401 });
    }


    const EventType = event.type;

    if (EventType === "user.created") {
        const { email_addresses, first_name, last_name, id } = event.data;
        const email = email_addresses[0].email_address;
        const name = `${first_name || ""} ${last_name || ""}`.trim();

        try {
            await ctx.runMutation(api.users.createUser, {
                email,
                name,
                clerkId: id
            })
        } catch (err) { 
            console.error("Error creating user in Convex", err);
            return new Response("Error Creating User", { status: 500 });
        }

    }
    return new Response("User created", { status: 200 });        
});

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: clerkwebhook
    });


export default http;