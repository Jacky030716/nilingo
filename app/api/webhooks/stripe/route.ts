import db from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request){
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if(event.type === "checkout.session.completed"){
    const subs = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    if(!session?.metadata?.userId){
      return new NextResponse("No user ID found", { status: 400 });
    }

    await db.insert(userSubscription).values({
      userId: session.metadata.userId,
      stripeSubscriptionId: subs.id,
      stripeCustomerId: subs.customer as string,
      stripePriceId: subs.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subs.current_period_end * 1000),
    })
  }

  if(event.type === "invoice.payment_succeeded"){
    const subs = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    await db.update(userSubscription).set({
      stripePriceId: subs.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subs.current_period_end * 1000),
    }).where(eq(userSubscription.stripeSubscriptionId, subs.id))
  }

  return new NextResponse("Webhook received", { status: 200 });
}