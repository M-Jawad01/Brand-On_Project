# BrandON - Digital Advertising Agency Platform

A modern, role-based Digital Advertising Agency platform where customers can order custom services (Birthday banners, LED signboards, Showroom branding) and view a professional portfolio. Built with enterprise-grade RBAC (Role-Based Access Control) architecture.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Brand-On_Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   docker-compose up -d
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Update DATABASE_URL in .env.local
   ```

5. **Initialize Prisma**
   ```bash
   npm run db:generate
   npm run db:push
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Public Site: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin
   - Agent Dashboard: http://localhost:3000/agent
   - Customer Dashboard: http://localhost:3000/customer

## 🏗️ Architecture

### Route Groups (RBAC-Based Physical Separation)

```
app/
├── (public)/                    # Public pages (no auth required)
│   ├── page.tsx                 # Homepage
│   ├── services/                # Service listing & details
│   ├── gallery/                 # Portfolio showcase
│   ├── about/                   # Company info
│   └── contact/                 # Contact form
├── (auth)/                      # Authentication pages
│   ├── login/                   # Login page
│   └── register/                # Registration page
├── (admin)/                     # Admin-only routes (ADMIN role)
│   └── admin/                   # Admin dashboard
├── (dashboard)/                 # Protected user dashboards
│   ├── agent/                   # Agent dashboard (AGENT role)
│   └── customer/                # Customer dashboard (CUSTOMER role)
└── unauthorized/                # Access denied page
```

### Middleware Security Layer

The `middleware.ts` enforces role-based access control:
- ✅ Public routes: Accessible to all
- 🔐 Auth routes: Redirects authenticated users to their dashboard
- 🛡️ Protected routes: Validates session and role before access
- ⛔ Unauthorized access: Redirects to `/unauthorized`

### Database Schema

#### Core Models
- **User**: Authentication & role management (ADMIN, AGENT, CUSTOMER)
- **Profile**: Extended user information (address, company, avatar, bio)
- **Session**: NextAuth session tokens
- **Account**: OAuth provider accounts
- **ServiceProduct**: Advertising services with pricing
- **Order**: Customer orders with custom requirements & design files
- **GalleryItem**: Portfolio showcase projects
- **CompanyProfile**: Business information & contact details

## 🎨 Design System

### Enhanced Color Palette

```typescript
// Tailwind Configuration
colors: {
  'brand-primary': {
    DEFAULT: '#22C55E',  // Vibrant green
    dark: '#16A34A',
    light: '#4ADE80'
  },
  'brand-secondary': {
    DEFAULT: '#1E293B',  // Deep blue-gray
    light: '#334155',
    dark: '#0F172A'
  },
  'brand-accent': {
    DEFAULT: '#3B4B63',  // Muted blue
    light: '#475569',
    dark: '#1E2936'
  },
  'brand-base': {
    DEFAULT: '#0F172A',  // Darkest background
    light: '#1E293B'
  }
}
```

### Typography
- **Font**: System fonts with fallbacks
- **Headings**: Bold, 2xl-4xl sizes
- **Body**: Regular, sm-base sizes
- **Captions**: Light, xs size

## 🔐 Authentication & Authorization

### User Roles

| Role     | Access Level | Permissions |
|----------|--------------|-------------|
| ADMIN    | Full System  | User management, system settings, all orders |
| AGENT    | Management   | Service management, order processing |
| CUSTOMER | Standard     | Place orders, view order history, profile |

### Protected Routes

```typescript
const protectedRoutes = {
  admin: ['/admin'],              // ADMIN only
  agent: ['/agent'],              // AGENT only
  customer: ['/customer']         // CUSTOMER only
};
```

### Session Management
- **Strategy**: JWT with database sessions
- **Token Storage**: HTTP-only cookies
- **Session Duration**: 30 days (configurable)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.0.4 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Custom components with Tailwind

### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js (configured)
- **Validation**: Zod (planned)

### Database
- **Database**: PostgreSQL 15 (Alpine)
- **ORM**: Prisma 5.22.0
- **Connection**: Connection pooling via Prisma
- **Migrations**: Prisma Migrate

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database Volume**: Persistent storage
- **Port Mapping**: 3000 (app), 5432 (postgres)

## 📦 Project Structure

```
Brand-On_Project/
├── app/                         # Next.js App Router
│   ├── (public)/                # Public pages
│   ├── (auth)/                  # Auth pages
│   ├── (admin)/                 # Admin dashboard
│   ├── (dashboard)/             # User dashboards
│   ├── unauthorized/            # Access denied
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                  # Reusable UI components
│   ├── Header.tsx               # Navigation header
│   ├── Footer.tsx               # Footer with links
│   ├── ServiceCard.tsx          # Service display card
│   └── OrderFormModal.tsx       # Order form modal
├── lib/                         # Utilities & helpers
│   └── data/
│       └── mockServices.ts      # Mock data for development
├── prisma/                      # Database schema & migrations
│   └── schema.prisma            # Prisma schema
├── types/                       # TypeScript type definitions
│   └── next-auth.d.ts           # NextAuth augmentation
├── middleware.ts                # RBAC middleware
├── tailwind.config.ts           # Tailwind configuration
├── docker-compose.yml           # Docker services
└── package.json                 # Dependencies & scripts
```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

### Environment Variables

```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/brand_on_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 🚦 Roadmap

### ✅ Completed
- Route Groups with RBAC
- Prisma schema with auth models
- Middleware security layer
- Public pages (home, services, gallery, about, contact)
- Auth pages (login, register)
- Protected dashboards (admin, agent, customer)
- Enhanced color system
- Responsive design

### 🔄 In Progress
- NextAuth configuration
- API routes for CRUD operations
- File upload for design requirements

### 📋 Planned
- Email verification
- Password reset flow
- Order status tracking
- Payment integration
- Admin user management
- Service CRUD operations
- Real-time notifications

## 📝 Key Features

### Public Features
- 🏠 Modern landing page with hero section
- 📦 Service catalog with filtering
- 🖼️ Portfolio gallery (8 projects)
- 📞 Contact form
- 📱 Fully responsive design

### Customer Features
- 🛒 Place custom orders with design requirements
- 📁 Upload design files
- 📊 Order history & tracking
- 👤 Profile management

### Agent Features
- 📝 Manage service products
- 📋 Process customer orders
- ✅ Update order status
- 📊 View order analytics

### Admin Features
- 👥 User management
- 🏢 Service approval & management
- 📊 System statistics
- ⚙️ System configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📧 Contact

For inquiries: info@brandonpk.com