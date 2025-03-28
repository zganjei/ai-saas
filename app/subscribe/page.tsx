import { availablePlans } from "@/lib/plans";
import { useMutation } from "@tanstack/react-query";

type SubscribeResponse = {
    url:string;
};

type SubscribeError = {
    error:string;
};

async function subscribeToPlan(planType:string, userId: string, email: string): Promise<SubscribeResponse>{
    const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            body: JSON.stringify({
                planType,
                userId,
                email,
            }),
        },
    });

    if(!response.ok){
        const errorData: SubscribeError = await response.json()
        throw new Error(errorData.error || "Something went wrong.")
    }

    const data:
}


export default function Subscribe(){

    const {user} = useUser()
    const userId = user?.id;
    const email = user?.emailAddresses[0].emailAddress || "";
    const {} = useMutation<SubscribeResponse, SubscribeError, {planType: string}>({
        mutationFn: async({planType}) => {
            if(!userId){
                throw new Error("user not signed in.")
            }

            return subscribeToPlan(planType,userId, email)
        }
    });

    return (<div>
         <div>
        <h2>Pricing</h2>
        <p>Get started on our weekly plan or upgrade to monthly or yearly when you're ready.</p>
        </div>
            {availablePlans.map((plan,key) => (
                <div key={key}>
                    <div>
                        {plan.isPopular && <p> Most Popular</p>}
                        <h3>{plan.name}</h3>
                        <p><span> ${plan.amount}</span> <span> {plan.interval}</span></p>
                        <p>{plan.description}</p>
                        <ul>
                            {plan.features.map((feature,key) => (
                                <li key={key}>
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
                                        className="flex-shrink-0 w-6 h-6 text-emerald-500"
                                    >
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                        <span> {feature} </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button>Subscribe {plan.name}</button>
                </div>        
            ))}
        <div></div>
        </div>);
}