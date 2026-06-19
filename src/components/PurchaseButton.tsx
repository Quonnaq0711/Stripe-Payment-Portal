"use client"

import { useUser } from "@clerk/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "../components/ui/button"

const PurchaseButton = ({ subId }: { subId: Id<"subscriptions"> }) => {
    const { user } = useUser()
    const userData = useQuery(api.users.getUserByClerkId, user ? { clerkId: user?.id } : "skip")

    const userAccess = useQuery(api.users.getUserAccess, userData ? {
        userId: userData?._id,
        subscriptionId: subId.subId
    } : "skip") || { hasAccess: false };

    if (!userAccess.hasAccess) {
        return <Button variant="outline">
            Enroll Now
        </Button>
    }

    if (userAccess.hasAccess) {
        return <Button variant={"outline"}>
            Enrolled
        </Button>
    }
    
  return (
    <div>PurchaseButton</div>
  )
}

export default PurchaseButton;