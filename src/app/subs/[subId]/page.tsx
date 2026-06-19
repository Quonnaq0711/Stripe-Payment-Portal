"use client"

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { notFound } from "next/navigation";
import { Skeleton } from "../../../components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import Image  from "next/image";
import { Download, FileText, PlayCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PurchaseButton from "../../../components/PurchaseButton";


const SubcriptionDetailsPage = ({ params }: { params: { subId: Id<"subscriptions"> } }) => {
    const { user, isLoaded: isUserLoaded } = useUser();
    const userData = useQuery(api.users.getUserByClerkId, { clerkId: user?.id ?? "" });
    const subData = useQuery(api.subs.getSubById, { subscriptionId: params.subId });

    const userAccess = useQuery(api.users.getUserAccess, userData ? {
        userId: userData._id,
        subscriptionId: params.subId
    } : "skip") || { hasAccess: false}

    const hasUserAccess = userAccess !== undefined && "hasAccess" in userAccess && userAccess.hasAccess;

    // undefined => Loading, convex
    if (!isUserLoaded || subData === undefined) {
        return <SubscriptionDetailsSkeleton />
    }

    if (subData === null) {
        return notFound()
    }


  return (
      <div className="container mx-auto py-8 px-4">
          <Card className="max-w-4xl mx-auto">
              <CardHeader>
                  <Image 
                      src={subData.imageUrl}
                      alt={subData.title}
                      width={1200}
                      height={600}
                      className="rounded-md object-cover w-full"
                  />                  
              </CardHeader>
              <CardContent >
                  <CardTitle className="text-3xl mb-4">
                      {subData.title}
                  </CardTitle>
                  {hasUserAccess ? (
                      <>
                          <p className="text-blue-600 mb-6"> {subData.description}</p>
                          <div className="grid grid-col-1 md:grid-col-2 gap-4 mb-8">
                              <Button className="flex items-center justify-center space-x-2">
                                  <PlayCircle className="size-5" />
                                  <span> Play Media</span>
                              </Button>
                              <Button className="flex items-center justify-center space-x-2" variant="outline">
                                  <Download className="size-5" />
                                  <span>Download Media</span>
                              </Button>
                              <h3 className="text-xl font-semibold mb-4">Playlist</h3>
                              <ul className="space-y-2">
                                  <li className="flex items-center justify-center sapce-x-2">
                                      <FileText className="size-5 text-blue-400" />
                                      <span>Track 1</span>
                                  </li>
                              </ul>
                          </div>
                      </>
                  ) : (
                          <div className="text-center">
                              <div className="flex flex-col items-centerspace-y-4">
                                  <Lock className="size-16 text-blue-400" />
                                  <p className="text-lg text-blue-600">Locked</p>
                                  <p className="text-blue-500">
                                      Enroll to access content.
                                  </p>
                                  <p className="text-2xl font-bold mb-4">${subData.price}</p>
                                  <PurchaseButton subId={params.subId} />
                              </div>
                          </div>
                  )}                  
              </CardContent>
          </Card>
    </div>
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