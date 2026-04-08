import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/adminAuth'; // imported from new helper file

// GET /api/materials — Public (Return all active materials)
export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(materials);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
  }
}

// POST /api/materials — Admin Only (Create material)
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, description, pricePerSqFt, imageUrl } = body;

    if (!name || pricePerSqFt === undefined) {
      return NextResponse.json({ error: 'Name and pricePerSqFt are required' }, { status: 400 });
    }

    const material = await prisma.material.create({
      data: { 
        name, 
        description, 
        pricePerSqFt: parseFloat(pricePerSqFt), 
        imageUrl 
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error("Database Create Error: ", error);
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 });
  }
}

// PUT /api/materials — Admin Only (Update material)
export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, name, description, pricePerSqFt, imageUrl, isActive } = body;

    if (!id) return NextResponse.json({ error: 'Material ID is required' }, { status: 400 });

    const material = await prisma.material.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(pricePerSqFt !== undefined && { pricePerSqFt: parseFloat(pricePerSqFt) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(material);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update material' }, { status: 500 });
  }
}

// DELETE /api/materials — Admin Only (Soft delete - set isActive to false)
export async function DELETE(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: 'Material ID is required' }, { status: 400 });

    const material = await prisma.material.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: 'Material deleted (soft)', material });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 });
  }
}