"use client";

import { useUser } from "@clerk/nextjs";
import { Spinner } from "@/components/spinner";
import {Toaster} from "react-hot-toast";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { availablePlans } from "@/lib/plans";

async function fetchSubscriptionStatus(){
    const response = await fetch("/api/profile/subscription-status")
    return response.json()
}

export default function Profile(){
    const {isLoaded, isSignedIn, user} = useUser();
    const {data: subscription, isLoading, isError, error} = useQuery({
        queryKey: ["subscription"], 
        queryFn: fetchSubscriptionStatus,
        enabled: isLoaded && isSignedIn,
        staleTime: 5 *60 * 1000,
    });

    const currentPlan = availablePlans.find((plan) => plan.interval===subscription?.subscription.subscriptionTier)

    if (!isLoaded){
        return (
            <div>
                {" "}
                <Spinner /><span> Loading .... </span>
            </div>
        );
    }

    if (!isSignedIn){
        return (
            <div>
                {" "}
                <p> Please sign in to view your profile.</p>
            </div>
        );
    }

    return (
    <div>
        <Toaster position="top-center"/>
        <div>
            <div>
                <div>
                    {user.imageUrl && (
                        <Image 
                            src = {user.imageUrl} 
                            alt="User Avatar"
                            width={100}
                            height= {100}
                    />
                    )}
                    <h1> {user.firstName} {user.lastName} </h1>
                    <p> {user.primaryEmailAddress?.emailAddress}</p>
                </div>

                <div>
                   <h2> Subscription Details</h2> 
                   {isLoading ?
                   (
                    <div> 
                        <Spinner /> <span> Loading subscription details ...</span>
                    </div>
                     ): isError ? (<p>{error?.message}</p>): subscription ?
                     (<div>
                        <h3> Current Plan</h3>
                        {currentPlan?(<div> 
                            <>
                            <p>
                                <strong>Plan: </strong> {currentPlan.name}{" "}
                            </p>

                            <p>
                                <strong>Amount: </strong> {currentPlan.amount}{currentPlan.currency}
                            </p>
                            <p>
                                <strong>Status: </strong> ACTIVE
                            </p>
                            </>

                        </div>):
                        (<p>Current plan not found </p>)}
                     </div>):
                     (<p>You are not subscribed</p>

                     )}
                </div>
            </div>
        </div>
    </div>
    );
}