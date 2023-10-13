import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/prisma/client";

const stripeId = async (user: any, email: string, name: string) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
  });

  const customer = await stripe.customers.create({
    email: user.email!,
    name: user.name!,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeCustomerId: customer.id,
    },
  });
};

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { provider, name, email, password } = body.data;

    if (provider && provider === "Google") {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      let user;
      if (existingUser) {
        user = existingUser;
      } else {
        const user = await prisma.user.create({
          data: {
            name: name,
            email: email,
            password: "",
            admin: false,
          },
        });

        stripeId(user, email, name);
        // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        //   apiVersion: "2023-08-16",
        // });

        // const customer = await stripe.customers.create({
        //   email: user.email!,
        //   name: user.name!,
        // });

        // await prisma.user.update({
        //   where: { id: user.id },
        //   data: {
        //     stripeCustomerId: customer.id,
        //   },
        // });
      }
      return new NextResponse(JSON.stringify(user), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      if (!name || !email || !password) {
        return new NextResponse(JSON.stringify({ error: "Missing fields" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        return new NextResponse(
          JSON.stringify({ error: "Invalid email format" }),
          {
            status: 422,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (existingUser) {
        return new NextResponse(
          JSON.stringify({ error: "User already exists" }),
          {
            status: 409,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          admin: false,
        },
      });

      stripeId(user, email, name);

      return new NextResponse(JSON.stringify(user), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
