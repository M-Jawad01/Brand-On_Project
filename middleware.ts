// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Only protect /admin routes (except the login page itself)
//   if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
//     const adminToken = request.cookies.get("admin_token")?.value;

//     if (!adminToken || adminToken !== process.env.ADMIN_SECRET) {
//       const loginUrl = new URL("/admin/login", request.url);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };


import { NextResponse } from 'next/server';

export function middleware() {
  // সব রিকোয়েস্টকে সরাসরি যেতে দাও, কোনো চেক করার দরকার নেই
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};