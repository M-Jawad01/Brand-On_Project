import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // 2. User khunje ber kora ba notun toiri kora
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash: "GUEST_ORDER", // Guest order er jonno dummy password
          role: "CUSTOMER",
          profile: { create: {} }
        },
      });
    }

    // 3. Database e Order save kora
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