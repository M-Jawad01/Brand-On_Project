import { isAdmin } from '@/lib/adminAuth';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/gallery — list all gallery items (Public)
export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

// POST /api/gallery — add a gallery item (admin)
export async function POST(request: NextRequest) {
  // SECURITY CHECK
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!body.imageUrl?.trim()) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const item = await prisma.galleryItem.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || null,
        imageUrl: body.imageUrl.trim(),
        category: body.category?.trim() || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}

// DELETE /api/gallery?id=xxx — remove a gallery item (admin)
export async function DELETE(request: NextRequest) {
  // SECURITY CHECK
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 });
    }

    await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}