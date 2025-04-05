"use client";

import { useUser } from "@clerk/nextjs";
import { Spinner } from "@/components/spinner";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { useMutation, useQuery,QueryClient } from "@tanstack/react-query";
import { availablePlans } from "@/lib/plans";
import React, { useState } from "react";

async function fetchSubscriptionStatus() {
  const response = await fetch("/api/profile/subscription-status");
  return response.json();
}

async function updatePlan(newPlan: string){
  const response = await fetch("/api/profile/change-plan",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({newPlan})
  });
  return response.json();
};

export default function Profile() {
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const { isLoaded, isSignedIn, user } = useUser();
  const {
    data: subscription,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscriptionStatus,
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = new QueryClient()
  const {data: updatedPlan, mutate: updatePlanMutation, isPending: isUpdatePlanPending}= useMutation({
    mutationFn: updatePlan,
  });

  const currentPlan = availablePlans.find(
    (plan) => plan.interval === subscription?.subscription.subscriptionTier
  );

  function handleUpdatePlan(){
    if(selectedPlan){
        updatePlanMutation(selectedPlan)
    }

    setSelectedPlan("");
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
        <span className="ml-2 text-cyan-700">Loading...</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-cyan-700">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyan-50 py-10">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-6">
            {user.imageUrl && (
              <Image
                className="w-24 h-24 rounded-full border-4 border-cyan-300"
                src={user.imageUrl}
                alt="User Avatar"
                width={100}
                height={100}
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-cyan-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-cyan-600">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-cyan-800">
              Subscription Details
            </h2>
            {isLoading ? (
              <div className="flex items-center mt-4">
                <Spinner />
                <span className="ml-2 text-cyan-700">
                  Loading subscription details...
                </span>
              </div>
            ) : isError ? (
              <p className="mt-4 text-red-500">{error?.message}</p>
            ) : subscription ? (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-cyan-800">
                  Current Plan
                </h3>
                {currentPlan ? (
                  <div className="mt-2 p-4 bg-cyan-50 border rounded-lg">
                    <p className="text-cyan-700">
                      <strong>Plan:</strong> {currentPlan.name}
                    </p>
                    <p className="text-cyan-700">
                      <strong>Amount:</strong> {currentPlan.amount}
                      {currentPlan.currency}
                    </p>
                    <p className="text-cyan-700">
                      <strong>Status:</strong> ACTIVE
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-cyan-700">
                    Current plan not found.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-cyan-700">
                You are not subscribed to any plan.
              </p>
            )}
          </div>
          <div>
            <h3>Change Subscription Plan</h3>
            {
                currentPlan && (
                    <>
                    <select 
                        defaultValue={selectedPlan} 
                        disabled={isUpdatePlanPending}
                        onChange={(event:React.ChangeEvent<HTMLSelectElement>) => setSelectedPlan(event.target.value)}
                        >
                        <option value="" disabled>
                            Select a New Plan
                        </option>
                        {availablePlans.map((plan,key) => (
                            <option key={key} value={plan.interval}>
                                {" "}
                                {plan.name} - ${plan.amount} /{plan.interval}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleUpdatePlan}> Save Change </button>
                    {isUpdatePlanPending && (<div>
                        {" "}
                        <Spinner/> <span> Updating Plan...</span></div>)}
                    </>
                )
            }
          </div>

          <div>
            <h3> Unsubscribe</h3>
            <button> Unsubscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}
