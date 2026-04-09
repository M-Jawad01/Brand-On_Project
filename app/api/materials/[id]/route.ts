import { isAdmin } from '@/lib/adminAuth';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateMaterialInput } from '@/lib/validation';

// PUT /api/materials/[id] — update a material (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Only Admin can update material
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = params;

    const validation = validateMaterialInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const material = await prisma.material.update({
      where: { id },
      data: {
        name: body.name.trim(),
        description: body.description || null,
        pricePerSqFt: body.pricePerSqFt,
        imageUrl: body.imageUrl || null,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(material);
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A material with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update material' }, { status: 500 });
  }
}

// GET /api/materials/[id] — get a single material (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
    });

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    return NextResponse.json(material);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch material' }, { status: 500 });
  }
}