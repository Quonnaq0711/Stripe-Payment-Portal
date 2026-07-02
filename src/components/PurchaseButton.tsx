"use client"

import { useUser } from "@clerk/react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "../components/ui/button"
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

const PurchaseButton = ({ subId }: { subId: Id<"subscriptions"> }) => {
    const { user } = useUser()
    const userData = useQuery(api.users.getUserByClerkId, user ? { clerkId: user?.id } : "skip")
    const [isLoading, setIsLoading] = useState(false);
    const createCheckoutSession = useAction(api.stripe.CreateCheckoutSession)

    const userAccess = useQuery(api.users.getUserAccess, userData ? {
        userId: userData?._id,
        subscriptionId: subId
    } : "skip") || { hasAccess: false };

    const handlePurchase = async () => {
        if (!user) alert("Please log in to purchase")
        setIsLoading(true);
        try {
            const { checkoutUrl } = await createCheckoutSession({ subId });
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                throw new Error("Checkout Session Failed")
            }
        } catch (error: any) {
            //  TODO: handle error properly, show toast
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    };

    if (!userAccess.hasAccess) {
        return <Button variant="outline" onClick={handlePurchase}>
            Join Now
        </Button>
    }

    if (userAccess.hasAccess) {
        return <Button variant={"outline"}>
            Joined 
        </Button>
    }


    if (isLoading) {
        return <button>
            <Loader2 className="mr=2 size-4 animate-spin" />
            Processing...
        </button>
    }    
}

export default PurchaseButton;