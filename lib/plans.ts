export interface Plan{
    name: string;
    amount: number;
    currency: string;
    interval:string;
    isPopular?: boolean;
    description: string;
    features: string[]
}


export const availablePlans: Plan[] = [
    {
        name: "Weekly Plan",
        amount: 9.99,
        currency: "USD",
        interval: "week",
        description: "Great if you want to try the service before committing longer.",
        features: [
            "Unlimited AI meal plans",
            "AI Nutrition Insights",
            "Cancel Anytime"
        ],
    },
    {
        name: "Monthly Plan",
        amount: 39.99,
        currency: "USD",
        interval: "week",
        description: "Great if you want to try the service before committing longer.",
        isPopular: true,
        features: [
            "Unlimited AI meal plans",
            "Priority AI support",
            "Cancel Anytime"
        ],
    },
    {
        name: "Yearly Plan",
        amount: 299.99,
        currency: "USD",
        interval: "week",
        description: "Great if you want to try the service before committing longer.",
        features: [
            "Unlimited AI meal plans",
            "AI Nutrition Insights",
            "Cancel Anytime"
        ],
    },
];

const priceIDMap: Record<string, string> = {
    week: process.env.STRIPE_PRICE_WEEKLY!,
    month: process.env.STRIPE_PRICE_MONTHLY!,
    year: process.env.STRIPE_PRICE_YEARLY!,
}
export const getPriceIdFromType = (planType: string) => priceIDMap(planType);