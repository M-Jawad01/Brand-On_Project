import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { material: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(orders);
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}