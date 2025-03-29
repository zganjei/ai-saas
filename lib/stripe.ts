import Stripe from "stripe";
if(!process.env.STRIPE_SECRET_KEY){
    throw new Error("process.env.STRIPE_SECRET_KEY is not found")
}
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)