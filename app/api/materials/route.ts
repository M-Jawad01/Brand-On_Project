import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(materials);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const material = await prisma.material.create({
      data: {
        name: body.name,
        pricePerSqFt: parseFloat(body.pricePerSqFt),
      },
    });
    return NextResponse.json(material);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}