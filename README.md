# BRAND ON

An online ordering and property listing system built with Next.js 14+, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the database: `docker-compose up -d`
4. Copy `.env.example` to `.env.local` and update the DATABASE_URL
5. Run Prisma migrations: `npm run db:migrate`
6. Start the development server: `npm run dev`

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Infrastructure**: Docker & Docker Compose

## User Roles

- ADMIN
- AGENT (OWNER)
- CUSTOMER

## Key Entities

- Users
- Listings (Properties)
- Gallery (Projects/Portfolios)