/**
 * Design Pattern: Singleton
 *
 * Purpose: Ensure only ONE database connection instance exists across the
 * entire application. Without this, every page render or API call would
 * create a new connection, exhausting the database connection pool.
 *
 * How it works:
 * - DatabaseClient.getInstance() always returns the same PrismaClient
 * - The instance is stored on `globalThis` so it survives Next.js hot reloads
 * - In production, a single instance is created and reused
 */

import { PrismaClient } from '@prisma/client'

class DatabaseClient {
  private static instance: PrismaClient | undefined

  // Private constructor prevents direct instantiation with `new`
  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query'] : [],
      })
    }
    return DatabaseClient.instance
  }
}

// Preserve the singleton across Next.js hot reloads in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? DatabaseClient.getInstance()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma