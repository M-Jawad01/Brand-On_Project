import { NextRequest } from 'next/server';

export function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  return token === process.env.ADMIN_SECRET;
}