import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, description, pricePerSqFt, isActive } = body;

    const updated = await prisma.material.update({
      where: { id: params.id },
      data: {
        name,
        description,
        pricePerSqFt: parseFloat(pricePerSqFt),
        isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}