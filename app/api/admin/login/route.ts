import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Set HTTP-only cookie with the secret token
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', process.env.ADMIN_SECRET!, {
      httpOnly: true,       // JavaScript can't read this cookie (security)
      secure: process.env.NODE_ENV === 'production', // True in production with HTTPS
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day validity
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}