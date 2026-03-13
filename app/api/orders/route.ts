import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Admin auth import omitted for now, as requested to be done later.

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
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    
    //  Generate Human-Readable Order Number
    
    const today = new Date();
    
    // Generate today's date string (e.g., "20260313")
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); 

    // Get the start time of the current day
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Count the number of orders placed today from the database
    const count = await prisma.order.count({
      where: { createdAt: { gte: startOfDay } },
    });

    // Generate the ID format: BON-20260313-001
    const orderNumber = `BON-${dateStr}-${String(count + 1).padStart(3, '0')}`;
    // ==========================================

    // Save the order to the database
    const order = await prisma.order.create({
      data: {
        orderNumber, //newly generated ID
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
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(" POST /api/orders Error:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// GET /api/orders — Admin only (List all orders)
export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status');
    
    // Filter by status if query parameter exists, otherwise fetch all
    const where = status ? { status: status as any } : {};

    const orders = await prisma.order.findMany({
      where,
      include: { material: true }, // Include related material details with the order
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error(" GET /api/orders Error:", error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// PATCH /api/orders — Admin only (Update order status)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(" PATCH /api/orders Error:", error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}