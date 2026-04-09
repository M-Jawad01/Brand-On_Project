import { isAdmin } from '@/lib/adminAuth'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

// GET /api/orders/[id] — get a single order (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // SECURITY CHECK: Only Admin can view individual order details
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { material: { select: { id: true, name: true, pricePerSqFt: true } } },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

// PATCH /api/orders/[id] — update order status (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // SECURITY CHECK: Only Admin can update order status
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Validate status transition
    const allowed = VALID_TRANSITIONS[order.status]
    if (!allowed || !allowed.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${order.status} to ${status}` },
        { status: 400 }
      )
    }

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: { material: { select: { id: true, name: true, pricePerSqFt: true } } },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
