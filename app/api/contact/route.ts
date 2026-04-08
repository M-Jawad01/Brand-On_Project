import { NextRequest, NextResponse } from 'next/server'

// POST /api/contact — handle contact form submissions
// For MVP: log the message. In production, this would send an email/WhatsApp notification.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!body.phone?.trim()) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 })
    }
    if (!body.message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Log the contact submission (in production, integrate email/SMS/WhatsApp)
    console.log('[Contact Form Submission]', {
      name: body.name.trim(),
      email: body.email?.trim() || 'Not provided',
      phone: body.phone.trim(),
      message: body.message.trim(),
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, message: 'Your message has been received. We will get back to you soon.' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process contact form' }, { status: 500 })
  }
}
