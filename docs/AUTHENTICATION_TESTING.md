# Authentication Testing Guide

## 🔐 BrandON Authentication Setup Complete

All authentication components have been successfully configured and the development server is running at **http://localhost:3000**

---

## 📋 Testing Checklist

### 1. **Create a Test User**
Navigate to: http://localhost:3000/register

**Test Data:**
```
Name: Test User
Email: test@brandonpk.com
Phone: +92 300 1234567
Password: password123
```

### 2. **Login with Test User**
Navigate to: http://localhost:3000/login

**Credentials:**
```
Email: test@brandonpk.com
Password: password123
```

### 3. **Test RBAC (Role-Based Access Control)**

#### Customer Dashboard (Default for new registrations)
- After login, you should be redirected to: http://localhost:3000/customer
- View order history and profile

#### Agent Dashboard (Requires manual DB update)
```sql
-- Update user role to AGENT
UPDATE "User" SET role = 'AGENT' WHERE email = 'test@brandonpk.com';
```
- After role update, login should redirect to: http://localhost:3000/agent
- Access order management and service controls

#### Admin Dashboard (Requires manual DB update)
```sql
-- Update user role to ADMIN
UPDATE "User" SET role = 'ADMIN' WHERE email = 'test@brandonpk.com';
```
- After role update, login should redirect to: http://localhost:3000/admin
- Access full system control panel

### 4. **Test Unauthorized Access**
Try accessing protected routes without authentication or with wrong role:
- http://localhost:3000/admin (without ADMIN role)
- http://localhost:3000/agent (without AGENT role)
- Should redirect to: http://localhost:3000/unauthorized

### 5. **Test Public Routes (No Auth Required)**
- Homepage: http://localhost:3000
- Services: http://localhost:3000/services
- Gallery: http://localhost:3000/gallery
- About: http://localhost:3000/about
- Contact: http://localhost:3000/contact

---

## 🗄️ Database Management

### Access PostgreSQL Database
```bash
docker exec -it brand-on-postgres psql -U admin -d brand_on_db
```

### Useful SQL Commands
```sql
-- View all users
SELECT id, name, email, role FROM "User";

-- Update user role
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
UPDATE "User" SET role = 'AGENT' WHERE email = 'your-email@example.com';
UPDATE "User" SET role = 'CUSTOMER' WHERE email = 'your-email@example.com';

-- View user profiles
SELECT * FROM "Profile";

-- View orders
SELECT * FROM "Order";

-- Exit psql
\q
```

### Open Prisma Studio (Visual Database Manager)
```bash
npm run db:studio
```
Access at: http://localhost:5555

---

## 🔑 Environment Variables

Ensure your `.env.local` file contains:
```env
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="postgresql://admin:admin@localhost:5432/brand_on_db"
```

---

## 🧪 Expected Behaviors

### ✅ Successful Login
1. User enters valid credentials
2. NextAuth validates password hash
3. JWT token is created with user role
4. User is redirected to role-based dashboard
5. Middleware validates token on protected routes

### ❌ Failed Login
- Invalid email/password shows error message
- User stays on login page

### 🔒 Protected Route Access
- **Unauthenticated**: Redirect to `/login?callbackUrl=/original-path`
- **Wrong Role**: Redirect to `/unauthorized`
- **Correct Role**: Access granted

### 🔄 Auth Routes (Login/Register)
- **Unauthenticated**: Show form
- **Authenticated**: Redirect to role-based dashboard

---

## 🛠️ Troubleshooting

### "Invalid credentials" error on login
- Verify user exists in database
- Check password was hashed during registration
- Ensure bcrypt is working correctly

### Redirect loop or middleware issues
- Clear browser cookies
- Check NEXTAUTH_URL matches your domain
- Verify middleware matcher patterns

### Database connection errors
- Ensure Docker container is running: `docker ps`
- Check DATABASE_URL in .env.local
- Verify PostgreSQL is accepting connections: `docker logs brand-on-postgres`

### Session not persisting
- Check NEXTAUTH_SECRET is set
- Verify cookies are being set (browser DevTools > Application > Cookies)
- Ensure JWT strategy is working

---

## 📊 Authentication Flow Diagram

```
Registration Flow:
User → /register → API /api/auth/register → Hash Password → Create User (CUSTOMER) → Redirect to /login

Login Flow:
User → /login → API /api/auth/[...nextauth] → Verify Password → Create JWT → Set Cookie → Redirect to Dashboard

Middleware Flow:
Request → middleware.ts → Check Session → Verify Role → Allow/Deny Access → Protected Route

RBAC Flow:
Login → Get Role from Token → Route to Dashboard (ADMIN→/admin, AGENT→/agent, CUSTOMER→/customer)
```

---

## 🚀 Next Development Steps

1. **Create CRUD API Routes**
   - `/api/services` - Service management
   - `/api/orders` - Order management
   - `/api/users` - User management (admin only)

2. **Implement File Upload**
   - Design file upload for orders
   - Store in cloud storage (AWS S3, Azure Blob, etc.)

3. **Add Email Verification**
   - Send verification email on registration
   - Verify token before allowing login

4. **Password Reset Flow**
   - Request password reset
   - Email reset token
   - Update password

5. **Enhanced Security**
   - Rate limiting on auth routes
   - CSRF protection
   - Session refresh logic

---

## 📝 Notes

- Default role for new registrations: **CUSTOMER**
- Admin users must be created manually in database
- Session duration: **30 days**
- JWT strategy (no database session storage)
- Passwords hashed with bcrypt (12 rounds)

---

Happy Testing! 🎉
