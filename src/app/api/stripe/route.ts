import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";


const return_url = process.env.NEXT_BASE_URL + "/";

export async function GET() {
    try{
        const { userId} = await auth()
        const user = await currentUser();

        if(!userId){
            return new NextResponse(
                'Unauthorized',{
                    status:401
                }
            )
        }

        const _userSubscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));

        // Trying to cancel in stripe portal
        if(_userSubscriptions[0] && _userSubscriptions[0].stripeCustomerId){
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: _userSubscriptions[0].stripeCustomerId,
                return_url,
            });
            return NextResponse.json({
                url: stripeSession.url,
            })
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: return_url,
            cancel_url: return_url,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user?.emailAddresses[0].emailAddress,
            line_items: [
                {
                price_data: {
                    currency: "USD",
                    product_data: {
                    name: "Talk-PDF Pro",
                    description: "Unlimited Chat sessions!",
                    },
                    unit_amount: 1000,
                    recurring: {
                        interval: "month",
                    },
                },
                quantity: 1,
                },
            ],
            metadata: {
                userId,
            },
        });
        return NextResponse.json({
            url: stripeSession.url,
        })
    }
    catch(error){
        console.log("Stripe error: ", error);
        return new NextResponse(
            'Internal Server Error',{
                status:500
            }
        )
    }
}