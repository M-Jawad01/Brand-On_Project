import { NextRequest } from 'next/server';

export function isAdmin(request: NextRequest) {
  const adminToken = request.cookies.get('admin_token')?.value;
  return adminToken && adminToken === process.env.ADMIN_SECRET;
}