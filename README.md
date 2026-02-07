# BrandON

A Digital Advertising Agency platform where customers can order custom services (Birthday banners, LED signboards, Showroom branding) and view a professional portfolio.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the database: `docker-compose up -d`
4. Copy `.env.example` to `.env.local` and update the DATABASE_URL
5. Generate Prisma client: `npm run db:generate`
6. Push schema to database: `npm run db:push`
7. Start the development server: `npm run dev`

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Infrastructure**: Docker & Docker Compose

## Brand Colors

- **Primary Green**: #1E6E27 (Buttons, CTAs)
- **Dark Base**: #1C293C (Background)
- **Secondary**: #283548 (UI Elements)
- **Accent**: #2C3C53 (Highlights)

## User Roles

- ADMIN (System Control)
- AGENT (Owner/Manager)
- CUSTOMER (Buyer)

## Key Entities

- Users (with role-based access)
- Service Products (Banners, LED Signboards, etc.)
- Orders (Service bookings with custom requirements)
- Gallery (Portfolio projects)
- Company Profile (About, Contact, Social Links)