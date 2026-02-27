import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// According to Option 2, we are using PrismaClient here as before
// Best practice: Use a global variable for Prisma in development to prevent hot-reload connection leaks
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formData, serviceId, selectedSize, totalPrice } = body;
    const { name, email, phone, designRequirements, specialInstructions } = formData;

    // 1. Validation
    if (!email || !serviceId) {
      return NextResponse.json(
        { error: "Email and Service ID are required" },
        { status: 400 }
      );
    }

    // 2. Find User (If the customer is not logged in, search by the provided email)
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If the user does not exist, create a new customer profile for this order
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash: "GUEST_ORDER", // The user can set a real password later
          role: "CUSTOMER",
          profile: { create: {} }
        },
      });
    }

    // 3. Save the Order to the Database
    const newOrder = await prisma.order.create({
      data: {
        customerId: user.id,
        serviceId: serviceId,
        customSize: selectedSize || null,
        totalPrice: totalPrice || 0,
        designRequirements,
        specialInstructions,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Order placed successfully!", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORDER_CREATE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}