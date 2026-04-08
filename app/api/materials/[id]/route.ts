import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { name, pricePerSqFt } = await req.json();
  const material = await prisma.material.update({
    where: { id: params.id },
    data: { name, pricePerSqFt: parseFloat(pricePerSqFt) },
  });
  return NextResponse.json(material);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.material.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: "Deleted" });
}