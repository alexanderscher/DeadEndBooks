import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  const json = await request.json();

  const requiredFields = [
    "address",
    "zipCode",
    "city",
    "state",
    "country",
    "phone",
    "userId",
  ];

  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!json[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return new NextResponse(
      JSON.stringify({
        error: `Missing or invalid fields: ${missingFields.join(", ")}`,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const address = await prisma.address.create({
      data: {
        address: json.address,
        zipcode: json.zipCode,
        city: json.city,
        state: json.state,
        country: json.country,
        phone: json.phone,
        userId: parseInt(json.userId),
      },
    });

    return new NextResponse(JSON.stringify(address), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request: Request) {
  const json = await request.json();
  console.log(json);

  const requiredFields = [
    "address",
    "zipCode",
    "city",
    "state",
    "country",
    "phone",
    "userId",
  ];

  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!json[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return new NextResponse(
      JSON.stringify({
        error: `Missing or invalid fields: ${missingFields.join(", ")}`,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const address = await prisma.address.update({
      where: { userId: parseInt(json.userId) }, // <-- You need to provide a unique identifier here
      data: {
        address: json.address,
        zipcode: json.zipCode,
        city: json.city,
        state: json.state,
        country: json.country,
        phone: json.phone,
      },
    });

    return new NextResponse(JSON.stringify(address), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
