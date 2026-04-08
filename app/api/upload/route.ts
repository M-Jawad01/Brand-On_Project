import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { isAdmin } from '@/lib/adminAuth'; // Security: Protect upload route

export async function POST(request: NextRequest) {
  // Security Check: Only admins can upload files
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized: Only admins can upload files' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // 1. Edge Case: No file provided
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 2. Edge Case: Empty file (0 bytes)
    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    // 3. Validate file size (Max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    // 4. Validate MIME type and file extension matching
    const allowedTypes = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/webp': ['webp'],
    };

    const mimeType = file.type as keyof typeof allowedTypes;
    
    // Check if MIME type is in our allowed list
    if (!allowedTypes[mimeType]) {
      return NextResponse.json({ error: 'Only JPG, PNG, and WebP files are allowed' }, { status: 400 });
    }

    // Check if the file extension matches its actual MIME type
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedTypes[mimeType].includes(ext)) {
      return NextResponse.json({ error: 'File extension does not match its actual content type' }, { status: 400 });
    }

    // 5. Ensure the public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // 6. Generate a secure, unique filename (prevents long names and path traversal)
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Save the file to the local system
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    return NextResponse.json({ url: `/uploads/${filename}` });
    
  } catch (error) {
    console.error(" POST /api/upload Error:", error);
    return NextResponse.json({ error: 'Upload failed due to server error' }, { status: 500 });
  }
}