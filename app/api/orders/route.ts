import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { material: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerAddress: body.address,
        widthFt: parseFloat(body.width),
        heightFt: parseFloat(body.height),
        quantity: parseInt(body.quantity),
        totalPrice: parseFloat(body.totalPrice),
        status: "PENDING",
        material: { connect: { id: body.materialId } }
      }
    });
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const order = await prisma.order.update({
      where: { id: body.id },
      data: { status: body.status }
    });
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await prisma.order.delete({
      where: { id: body.id }
    });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}