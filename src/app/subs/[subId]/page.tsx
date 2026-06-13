"use client"

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { notFound } from "next/navigation";
import { Skeleton } from "../../../components/ui/skeleton";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";

const SubcriptionDetailsPage = ({ params }: { params: { subId: Id<"subscriptions"> } }) => {
    const { user, isLoaded: isUserLoaded } = useUser();
    const userData = useQuery(api.users.getUserByClerkId, { clerkId: user?.id ?? "" });
    const subData = useQuery(api.subs.getSubById, { subscriptionId: params.subId });

    const userAccess = useQuery(api.users.getUserAccess, userData ? {
        userId: userData._id,
        subscriptionId: params.subId
    } : "skip") || { hasAccess: false };


    // undefined => Loading, convex
    if (!isUserLoaded || subData === undefined) {
        return <SubscriptionDetailsSkeleton />
    }

    if (subData === null) {
        return notFound()
    }


  return (
    <div>sub id SubscriptionDetailsPage</div>
  )
}

export default SubcriptionDetailsPage;


function SubscriptionDetailsSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4" >
      <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <Skeleton className=" w-full h-150 rounded-md" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <div className="grid grid-col-1 md:grid-col-2 gap-4 mb-8">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card> 
      </div>      
    );
}