import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper function to check admin auth
function isAdmin(request: NextRequest) {
  const adminToken = request.cookies.get('admin_token')?.value;
  return adminToken && adminToken === process.env.ADMIN_SECRET;
}

// POST /api/orders — Public (Create a new order)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerName, customerPhone, customerEmail, customerAddress, 
      materialId, widthFt, heightFt, quantity, totalPrice, 
      designFileUrl, specialNotes 
    } = body;

    // Basic validation
    if (!customerName || !customerPhone || !materialId || !widthFt || !heightFt || !totalPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        customerAddress,
        materialId,
        widthFt: parseFloat(widthFt),
        heightFt: parseFloat(heightFt),
        quantity: quantity ? parseInt(quantity) : 1,
        totalPrice: parseFloat(totalPrice),
        designFileUrl,
        specialNotes,
        status: 'PENDING'
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// GET /api/orders — Admin Only (List all orders with optional ?status filter)
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const status = request.nextUrl.searchParams.get('status');
    // Prepare the where clause if status exists
    const where = status ? { status: status as any } : {};

    const orders = await prisma.order.findMany({
      where,
      include: { material: true }, // Include related material data!
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// PATCH /api/orders — Admin Only (Update order status)
export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { material: true }
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}