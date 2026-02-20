import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session types to include our custom Role enum
   */
  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
    } & DefaultSession['user'];
  }

  /**
   * Extends the built-in user types
   */
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT types to include role
   */
  interface JWT {
    id: string;
    role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
  }
}
