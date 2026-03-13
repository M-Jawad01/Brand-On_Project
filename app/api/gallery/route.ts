import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper function to check admin auth
function isAdmin(request: NextRequest) {
  const adminToken = request.cookies.get('admin_token')?.value;
  return adminToken && adminToken === process.env.ADMIN_SECRET;
}

// GET /api/gallery — Public (Return all gallery items)
export async function GET() {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(galleryItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

// POST /api/gallery — Admin Only (Create gallery item)
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, imageUrl, category } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and imageUrl are required' }, { status: 400 });
    }

    const galleryItem = await prisma.galleryItem.create({
      data: { title, description, imageUrl, category },
    });

    return NextResponse.json(galleryItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}

// DELETE /api/gallery — Admin Only (Delete gallery item)
export async function DELETE(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: 'Gallery Item ID is required' }, { status: 400 });

    const deletedItem = await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Gallery item deleted', deletedItem });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}