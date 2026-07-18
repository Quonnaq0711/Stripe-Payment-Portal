"use client"

import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";


const ProPlan = () => {
    const { user, isLoaded: isUserLoaded } = useUser();

    const userData = useQuery(api.users.getUserByClerkId, user ? { clerkId: user?.id } : "skip")
    const userSubscription = useQuery(api.subscription.getUserSubscription,
        userData ? { userId: userData?._id } : "skip"
    );

    const isYearlyPlanActive = userSubscription?.status === "active" && userSubscription?.planType

    return <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Choose Your Pro Journey</h1>
        <p className="text-xl text-center text-gray-600">Unlock premium features and accelerate your vibe</p>

        {isUserLoaded && userSubscription?.status === "active" && (
            <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4 mb-8 text-center">
                <p className="text-purple-800 font-semibold">
                    You are currently subscribed to the <span className="font-semibold"> {userSubscription?.planType}</span> {" "} subscription.
                </p>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {Pro_Plans.map((plan) => (
                <Card key={plan.id} className={`flex flex-col transition-all duration-300 ${plan.highlighted
                    ? "border-blue-400 shadow-lg hover:shadow-xl"
                    : "bordee-grey-300 hover: shadow-md"
                }`}}
        </div>
    </div>    
};
export default ProPlan