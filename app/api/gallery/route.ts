import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/adminAuth'; // Using our central admin helper

// GET /api/gallery — Public (Return all gallery items)
export async function GET() {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error(" GET /api/gallery Error:", error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

// POST /api/gallery — Admin Only (Create gallery item)
export async function POST(request: NextRequest) {
  // Task 8.3: Secure the route with central admin check
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, imageUrl, category } = body;

    // Task 8.3: Server-side validation and sanitization
    if (!title?.trim() || !imageUrl) {
      return NextResponse.json({ error: 'Title and imageUrl are required' }, { status: 400 });
    }

    const galleryItem = await prisma.galleryItem.create({
      data: { 
        title: title.trim(), 
        description: description?.trim(), 
        imageUrl, 
        category: category?.trim() || 'General' 
      },
    });

    return NextResponse.json(galleryItem, { status: 201 });
  } catch (error) {
    console.error(" POST /api/gallery Error:", error);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}

// DELETE /api/gallery — Admin Only (Delete gallery item)
export async function DELETE(request: NextRequest) {
  // Task 8.3: Secure the route
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Gallery Item ID is required' }, { status: 400 });
    }

    const deletedItem = await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Gallery item deleted', deletedItem });
  } catch (error) {
    console.error(" DELETE /api/gallery Error:", error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}