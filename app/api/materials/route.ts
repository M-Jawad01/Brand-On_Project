import { isAdmin } from '@/lib/adminAuth'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateMaterialInput } from '@/lib/validation'

// GET /api/materials — list active materials (public) or all materials (admin)
export async function GET(request: NextRequest) {
  try {
    const showAll = request.nextUrl.searchParams.get('all') === 'true'

    const materials = await prisma.material.findMany({
      where: showAll ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(materials)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}

// POST /api/materials — add a new material (admin)
export async function POST(request: NextRequest) {
  // SECURITY CHECK: only admin can add materials 
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const validation = validateMaterialInput(body)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 })
    }

    const material = await prisma.material.create({
      data: {
        name: body.name.trim(),
        description: body.description || null,
        pricePerSqFt: body.pricePerSqFt,
        imageUrl: body.imageUrl || null,
      },
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A material with this name already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 })
  }
}

// DELETE /api/materials?id=xxx — delete a material (admin)
export async function DELETE(request: NextRequest) {
  // SECURITY CHECK: only admin can delete materials
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 })
  }

  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Material ID is required' }, { status: 400 })
    }

    // Soft-delete: deactivate instead of removing (preserves order history)
    await prisma.material.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 })
  }
}