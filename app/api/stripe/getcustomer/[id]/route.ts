import { stripe } from "@/stripe/stripe";
import { NextResponse } from "next/server";

export async function GET(request: Request, data: any) {
  const id = data.params?.id;

  if (!id) {
    return new NextResponse("Missing id. Cannot find user.", {
      status: 400,
    });
  }
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set in the environment variables."
    );
  }

  const customer = await stripe.customers.retrieve(id);

  return NextResponse.json(customer);
}
