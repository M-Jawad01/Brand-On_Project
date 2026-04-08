import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateOrderInput } from '@/lib/validation'

// GET /api/orders — list all orders (admin)
export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status')
    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

    const orders = await prisma.order.findMany({
      where: status && validStatuses.includes(status) ? { status: status as 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' } : {},
      include: { material: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST /api/orders — place a new order (customer)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Calculate total price server-side for integrity
    const material = await prisma.material.findUnique({
      where: { id: body.materialId },
    })

    if (!material || !material.isActive) {
      return NextResponse.json({ error: 'Selected material is not available' }, { status: 400 })
    }

    const widthFt = parseFloat(body.widthFt)
    const heightFt = parseFloat(body.heightFt)
    const quantity = parseInt(body.quantity) || 1
    const totalPrice = Math.round(material.pricePerSqFt * widthFt * heightFt * quantity * 100) / 100

    const validation = validateOrderInput({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      materialId: body.materialId,
      widthFt,
      heightFt,
      quantity,
      totalPrice,
    })

    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        customerName: body.customerName.trim(),
        customerPhone: body.customerPhone.trim(),
        customerEmail: body.customerEmail?.trim() || null,
        customerAddress: body.customerAddress?.trim() || null,
        materialId: body.materialId,
        widthFt,
        heightFt,
        quantity,
        totalPrice,
        designFileUrl: body.designFileUrl || null,
        specialNotes: body.specialNotes?.trim() || null,
      },
      include: { material: { select: { name: true } } },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
