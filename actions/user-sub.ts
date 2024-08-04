"use server";
import { auth, currentUser } from '@clerk/nextjs/server';
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscriptions } from '@/db/queries';
import { stripe } from '@/lib/stripe';

const returnUrl = absoluteUrl("/shop");

export const createStripeURL = async () => {
  const { userId } = await auth()
  const user = await currentUser()

  if(!userId || !user) throw new Error("User not found")

  const userSubs = await getUserSubscriptions();

  if(userSubs && userSubs.stripeCustomerId){
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubs.stripeCustomerId,
      return_url: returnUrl
    })

    return { data: stripeSession.url }
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "MYR",
          product_data: {
            name: "Nilingo Pro",
            description: "Unlock all features and content",
          },
          unit_amount: 1000, // RM10.00
          recurring: {
            interval: "year"
          }
        }
      }
    ],
    metadata: {
      userId
    },
    success_url: returnUrl,
    cancel_url: returnUrl
  })

  return { data: stripeSession.url }
}