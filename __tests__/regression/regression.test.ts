/**
 * Regression Tests
 * Tests that verify previously fixed bugs remain fixed.
 * Each test documents the original bug, when it was found, and what the fix was.
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

describe('Regression Tests', () => {

  // ---- BUG #1: Admin dashboard used lowercase status values ----
  // Previously the admin dashboard used 'pending', 'processing' etc.
  // but the Prisma schema uses PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED.
  // Fixed: Updated admin page.tsx to use uppercase enum values.

  describe('REG-001: Order status values must be uppercase enum', () => {
    let materialId: string
    let orderId: string

    beforeAll(async () => {
      const matRes = await fetch(`${BASE_URL}/api/materials`)
      const materials = await matRes.json()
      materialId = materials[0].id

      const orderRes = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Regression Status Test',
          customerPhone: '0300-1112233',
          materialId,
          widthFt: 2,
          heightFt: 2,
          quantity: 1,
        }),
      })
      const order = await orderRes.json()
      orderId = order.id
    })

    it('newly created order should have uppercase PENDING status', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}`)
      const order = await res.json()
      expect(order.status).toBe('PENDING')
      expect(order.status).not.toBe('pending')
    })

    it('status transitions should use uppercase values', async () => {
      // PENDING -> CONFIRMED
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      })
      const order = await res.json()
      expect(order.status).toBe('CONFIRMED')
      expect(order.status).not.toBe('confirmed')
    })

    it('should reject lowercase status values', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' }),
      })
      expect(res.status).toBe(400)
    })
  })

  // ---- BUG #2: Materials API soft-delete vs active filtering ----
  // Previously admin materials page fetched /api/materials without ?all=true,
  // so soft-deleted materials disappeared entirely from admin view.
  // Fixed: Admin page now uses ?all=true, public pages use default (active only).

  describe('REG-002: Soft-deleted materials visible to admin, hidden from public', () => {
    let materialId: string

    beforeAll(async () => {
      const res = await fetch(`${BASE_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Regression Soft-Delete ${Date.now()}`,
          pricePerSqFt: 10,
        }),
      })
      const data = await res.json()
      materialId = data.id

      // Soft-delete it
      await fetch(`${BASE_URL}/api/materials?id=${materialId}`, { method: 'DELETE' })
    })

    it('public listing should not include soft-deleted material', async () => {
      const res = await fetch(`${BASE_URL}/api/materials`)
      const data = await res.json()
      expect(data.find((m: any) => m.id === materialId)).toBeUndefined()
    })

    it('admin listing (?all=true) should include soft-deleted material', async () => {
      const res = await fetch(`${BASE_URL}/api/materials?all=true`)
      const data = await res.json()
      const found = data.find((m: any) => m.id === materialId)
      expect(found).toBeDefined()
      expect(found.isActive).toBe(false)
    })
  })

  // ---- BUG #3: Gallery category schema mismatch ----
  // Gallery item interface required category, but Prisma schema has it as optional.
  // Fixed: Made category optional in interfaces and API.

  describe('REG-003: Gallery items work without category', () => {
    it('should create gallery item without category', async () => {
      const res = await fetch(`${BASE_URL}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `No Category Regression ${Date.now()}`,
          imageUrl: '/images/no-cat-regression.jpg',
        }),
      })

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.category).toBeNull()
    })

    it('should create gallery item with category', async () => {
      const res = await fetch(`${BASE_URL}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `With Category Regression ${Date.now()}`,
          imageUrl: '/images/with-cat-regression.jpg',
          category: 'Banners',
        }),
      })

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.category).toBe('Banners')
    })
  })

  // ---- BUG #4: Order status pipeline invalid transitions allowed ----
  // Ensure backward transitions are properly blocked
  // and terminal states (COMPLETED, CANCELLED) remain final.

  describe('REG-004: Order status pipeline enforces valid transitions only', () => {
    let orderId: string

    beforeAll(async () => {
      // Create a fresh material to avoid ordering/pollution issues
      const matRes = await fetch(`${BASE_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Pipeline Test Material ${Date.now()}`,
          pricePerSqFt: 10,
        }),
      })
      const material = await matRes.json()

      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Pipeline Regression',
          customerPhone: '0300-4445566',
          materialId: material.id,
          widthFt: 1,
          heightFt: 1,
          quantity: 1,
        }),
      })
      orderId = (await res.json()).id
    })

    it('should not allow skipping steps (PENDING → IN_PROGRESS)', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'IN_PROGRESS' }),
      })
      expect(res.status).toBe(400)
    })

    it('should not allow skipping steps (PENDING → COMPLETED)', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })
      expect(res.status).toBe(400)
    })

    it('should follow valid pipeline only', async () => {
      // Move through valid pipeline
      await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      })

      // Try going backwards
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PENDING' }),
      })
      expect(res.status).toBe(400)
    })
  })

  // ---- BUG #5: Server-side price calculation integrity ----
  // Orders API must calculate totalPrice server-side from material price,
  // not trust client-sent totalPrice. This prevents price manipulation.

  describe('REG-005: Server-side price calculation is authoritative', () => {
    it('server should calculate price regardless of client input', async () => {
      // Create a fresh material with known price to avoid ordering issues
      const matCreateRes = await fetch(`${BASE_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Price Integrity Material ${Date.now()}`,
          pricePerSqFt: 50,
        }),
      })
      const material = await matCreateRes.json()
      expect(material.id).toBeDefined()

      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Price Integrity Test',
          customerPhone: '0300-9998877',
          materialId: material.id,
          widthFt: 4,
          heightFt: 3,
          quantity: 2,
        }),
      })

      expect(res.status).toBe(201)
      const order = await res.json()
      // Server calculates: 50 * 4 * 3 * 2 = 1200
      expect(order.totalPrice).toBe(1200)
    })
  })

  // ---- BUG #6: Dynamic rendering for DB-connected pages ----
  // Services and Gallery pages are server components that query the DB.
  // They must be marked as dynamic to avoid build-time prerender failures.

  describe('REG-006: DB-connected pages render without errors', () => {
    it('Services page should render successfully', async () => {
      const res = await fetch(`${BASE_URL}/services`)
      expect(res.status).toBe(200)
      const html = await res.text()
      expect(html).toContain('</html>')
    })

    it('Gallery page should render successfully', async () => {
      const res = await fetch(`${BASE_URL}/gallery`)
      expect(res.status).toBe(200)
      const html = await res.text()
      expect(html).toContain('</html>')
    })
  })

  // ---- BUG #7: Duplicate material name handling ----
  // POST /api/materials should return 409 for duplicate names, not 500.

  describe('REG-007: Duplicate material names return 409 not 500', () => {
    it('should return 409 Conflict for duplicate material name', async () => {
      const uniqueName = `Duplicate Test ${Date.now()}`

      // Create first
      await fetch(`${BASE_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: uniqueName, pricePerSqFt: 10 }),
      })

      // Try duplicate
      const res = await fetch(`${BASE_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: uniqueName, pricePerSqFt: 20 }),
      })

      expect(res.status).toBe(409)
      const data = await res.json()
      expect(data.error).toContain('already exists')
    })
  })

  // ---- BUG #8: Order API status filter now validates input ----
  // Previously used `status as any`, now validates against enum.

  describe('REG-008: Orders status filter handles invalid values gracefully', () => {
    it('should return orders (not crash) with invalid status filter', async () => {
      const res = await fetch(`${BASE_URL}/api/orders?status=INVALID`)
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should properly filter with valid status', async () => {
      const res = await fetch(`${BASE_URL}/api/orders?status=COMPLETED`)
      expect(res.status).toBe(200)
      const data = await res.json()
      for (const order of data) {
        expect(order.status).toBe('COMPLETED')
      }
    })
  })
})
