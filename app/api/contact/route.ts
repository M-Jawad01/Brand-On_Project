import { isAdmin } from '@/lib/adminAuth'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/contact — list all contact messages (admin only)
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 })
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contact messages' }, { status: 500 })
  }
}

// POST /api/contact — handle contact form submissions (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (body.name.trim().length > 100) {
      return NextResponse.json({ error: 'Name must be 100 characters or less' }, { status: 400 })
    }
    if (!body.phone?.trim()) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 })
    }
    if (!/^[\d\s\-+()]{7,20}$/.test(body.phone.trim())) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
    }
    if (!body.message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }
    if (body.message.trim().length > 5000) {
      return NextResponse.json({ error: 'Message must be 5000 characters or less' }, { status: 400 })
    }

    // Save the contact message to the database
    await prisma.contactMessage.create({
      data: {
        name: body.name.trim(),
        email: body.email?.trim() || null,
        phone: body.phone.trim(),
        message: body.message.trim(),
      },
    })

    return NextResponse.json({ success: true, message: 'Your message has been received. We will get back to you soon.' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process contact form' }, { status: 500 })
  }
}
