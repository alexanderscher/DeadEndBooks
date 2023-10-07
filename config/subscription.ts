export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  price: number;
}

export const storeSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    description: "Monthly Plan",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_MOBILE_PRICE_ID ?? "",
    price: 18.85,
  },
  {
    id: "yearly",
    name: "Yearly Plan",
    description: "Yearly Plan",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID ?? "",
    price: 206.1,
  },
];
