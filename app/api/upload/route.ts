import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG is allowed.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Generate a unique filename to prevent collisions and path traversal
    const safeName = `${crypto.randomUUID()}.jpg`

    await mkdir(UPLOAD_DIR, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Verify actual file content is JPG (magic bytes: FF D8 FF)
    if (buffer.length < 3 || buffer[0] !== 0xFF || buffer[1] !== 0xD8 || buffer[2] !== 0xFF) {
      return NextResponse.json(
        { error: 'Invalid file content. Only genuine JPG files are allowed.' },
        { status: 400 }
      )
    }

    await writeFile(path.join(UPLOAD_DIR, safeName), buffer)

    const url = `/uploads/${safeName}`

    return NextResponse.json({ url, filename: safeName })
  } catch (error) {
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 })
  }
}
