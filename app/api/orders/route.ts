import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/adminAuth'; // Task 8.3: Adding admin protection

// POST /api/orders — Public (Create a new order)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName, customerPhone, customerEmail, customerAddress,
      materialId, widthFt, heightFt, quantity, totalPrice,
      designFileUrl, specialNotes
    } = body;

    // Task 8.3: Strict Server-Side Validation
    if (!customerName?.trim() || !customerPhone?.trim() || !materialId) {
      return NextResponse.json({ error: 'Customer name, phone, and material are required' }, { status: 400 });
    }

    // Logical Validation: Dimensions and Price cannot be zero or negative
    if (parseFloat(widthFt) <= 0 || parseFloat(heightFt) <= 0 || parseFloat(totalPrice) < 0) {
      return NextResponse.json({ error: 'Invalid dimensions or total price' }, { status: 400 });
    }

    // Generate Human-Readable Order Number (BON-YYYYMMDD-00X)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); 
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const count = await prisma.order.count({
      where: { createdAt: { gte: startOfDay } },
    });

    const orderNumber = `BON-${dateStr}-${String(count + 1).padStart(3, '0')}`;

    // Save the order to the database with sanitized data
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail?.trim(),
        customerAddress: customerAddress?.trim(),
        materialId,
        widthFt: parseFloat(widthFt),
        heightFt: parseFloat(heightFt),
        quantity: Math.max(1, parseInt(quantity) || 1), // Ensure at least 1 item
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
  // Task 8.3: Check if the requester is an admin
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const status = request.nextUrl.searchParams.get('status');
    const where = status ? { status: status as any } : {};

    const orders = await prisma.order.findMany({
      where,
      include: { material: true }, 
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
  // Task 8.3: Check if the requester is an admin
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

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