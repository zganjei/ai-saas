"use client";

import { availablePlans } from "@/lib/plans";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast, {Toaster} from 'react-hot-toast'

type SubscribeResponse = {
    url: string;
};

type SubscribeError = {
    error: string;
};

async function subscribeToPlan(planType: string, userId: string, email: string): Promise<SubscribeResponse> {
    const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            planType,
            userId,
            email,
        }),
    });

    if (!response.ok) {
        const errorData: SubscribeError = await response.json();
        throw new Error(errorData.error || "Something went wrong.");
    }

    return response.json();
}

export default function Subscribe() {
    const { user } = useUser();
    const router = useRouter();
    const userId = user?.id;
    const email = user?.emailAddresses[0]?.emailAddress || "";
    const { mutate, isPending } = useMutation<
        SubscribeResponse,
        SubscribeError,
        { planType: string }
    >({
        mutationFn: async ({ planType }) => {
            if (!userId) {
                throw new Error("User not signed in.");
            }
            return subscribeToPlan(planType, userId, email);
        },
        onMutate:()=>{
            toast.loading("Processing your subscription details....")
        },
        onSuccess: (data) => {
            window.location.href = data.url;
        },
        onError: (error) => {
            toast.error("Something went wrong.")
        },
    });

    function handleSubscribe(planType: string) {
        if (!userId) {
            router.push("/sign-up");
            return;
        }
        mutate({ planType });
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <Toaster /> {/* Ensure this is present in your component */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Pricing</h2>
                <p className="text-gray-600">Get started on our weekly plan or upgrade to monthly or yearly when you're ready.</p>
            </div>
            {availablePlans.map((plan, key) => (
                <div key={key} className="border p-6 rounded-lg shadow-md mb-4">
                    <div className="mb-4">
                        {plan.isPopular && <p className="text-sm font-semibold text-green-600">Most Popular</p>}
                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                        <p className="text-gray-700"><span className="text-lg font-bold">${plan.amount}</span> / {plan.interval}</p>
                        <p className="text-gray-600">{plan.description}</p>
                    </div>
                    <ul className="mb-4 space-y-2">
                        {plan.features.map((feature, key) => (
                            <li key={key} className="flex items-center text-gray-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0 w-6 h-6 text-emerald-500 mr-2"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => handleSubscribe(plan.interval)}
                        disabled={isPending}
                        className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition duration-300 ${
    isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isPending ? "Please wait..." : `Subscribe ${plan.name}`}
                    </button>
                </div>
            ))}
        </div>
    );
}
