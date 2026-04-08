/**
 * System Tests — End-to-End User Flows
 * Tests complete user journeys through the system:
 * - Customer order flow (browse → order → confirmation)
 * - Admin management flow (materials → orders → status pipeline)
 * - Public page accessibility
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

describe('System Tests — Customer Order Flow', () => {
  let materialId: string
  let materialPrice: number
  let orderId: string

  it('Step 1: Customer can browse available materials', async () => {
    const res = await fetch(`${BASE_URL}/api/materials`)
    expect(res.status).toBe(200)

    const materials = await res.json()
    expect(materials.length).toBeGreaterThan(0)

    // Store first material for order
    materialId = materials[0].id
    materialPrice = materials[0].pricePerSqFt
    expect(materialPrice).toBeGreaterThan(0)
  })

  it('Step 2: Customer places an order with selected material', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'E2E Customer',
        customerPhone: '0300-7777777',
        customerEmail: 'e2e@test.com',
        customerAddress: '789 System Test Ave',
        materialId,
        widthFt: 6,
        heightFt: 4,
        quantity: 2,
        specialNotes: 'System test order',
      }),
    })

    expect(res.status).toBe(201)
    const order = await res.json()

    // Verify server-side price calculation
    const expectedPrice = Math.round(materialPrice * 6 * 4 * 2 * 100) / 100
    expect(order.totalPrice).toBe(expectedPrice)
    expect(order.status).toBe('PENDING')
    expect(order.orderNumber).toBeDefined()
    expect(order.material.name).toBeDefined()

    orderId = order.id
  })

  it('Step 3: Order appears in order listing', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`)
    const orders = await res.json()

    const found = orders.find((o: any) => o.id === orderId)
    expect(found).toBeDefined()
    expect(found.customerName).toBe('E2E Customer')
  })

  it('Step 4: Order details are retrievable', async () => {
    const res = await fetch(`${BASE_URL}/api/orders/${orderId}`)
    expect(res.status).toBe(200)

    const order = await res.json()
    expect(order.customerName).toBe('E2E Customer')
    expect(order.material.id).toBe(materialId)
    expect(order.widthFt).toBe(6)
    expect(order.heightFt).toBe(4)
    expect(order.quantity).toBe(2)
  })
})

describe('System Tests — Admin Order Management Flow', () => {
  let orderId: string
  let materialId: string

  beforeAll(async () => {
    // Get material for order
    const matRes = await fetch(`${BASE_URL}/api/materials`)
    const materials = await matRes.json()
    materialId = materials[0].id

    // Create order for admin flow
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Admin Flow Customer',
        customerPhone: '0300-8888888',
        materialId,
        widthFt: 3,
        heightFt: 3,
        quantity: 1,
      }),
    })
    const order = await orderRes.json()
    orderId = order.id
  })

  it('Step 1: Admin confirms the order (PENDING → CONFIRMED)', async () => {
    const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CONFIRMED' }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('CONFIRMED')
  })

  it('Step 2: Admin starts production (CONFIRMED → IN_PROGRESS)', async () => {
    const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'IN_PROGRESS' }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('IN_PROGRESS')
  })

  it('Step 3: Admin marks as completed (IN_PROGRESS → COMPLETED)', async () => {
    const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('COMPLETED')
  })

  it('Step 4: Completed order status is final', async () => {
    const attempts = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'CANCELLED']

    for (const status of attempts) {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      expect(res.status).toBe(400)
    }
  })
})

describe('System Tests — Admin Material Management Flow', () => {
  let materialId: string
  const materialName = `System Test Material ${Date.now()}`

  it('Step 1: Admin creates a new material', async () => {
    const res = await fetch(`${BASE_URL}/api/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: materialName,
        description: 'Created during system test',
        pricePerSqFt: 35,
      }),
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    materialId = data.id
    expect(data.isActive).toBe(true)
  })

  it('Step 2: Material appears in public listing', async () => {
    const res = await fetch(`${BASE_URL}/api/materials`)
    const materials = await res.json()

    const found = materials.find((m: any) => m.id === materialId)
    expect(found).toBeDefined()
    expect(found.name).toBe(materialName)
  })

  it('Step 3: Admin updates material price', async () => {
    const res = await fetch(`${BASE_URL}/api/materials/${materialId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: materialName, pricePerSqFt: 42 }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.pricePerSqFt).toBe(42)
  })

  it('Step 4: Admin deactivates material', async () => {
    const res = await fetch(`${BASE_URL}/api/materials?id=${materialId}`, {
      method: 'DELETE',
    })

    expect(res.status).toBe(200)
  })

  it('Step 5: Deactivated material hidden from public but visible to admin', async () => {
    // Public list should not include it
    const publicRes = await fetch(`${BASE_URL}/api/materials`)
    const publicMats = await publicRes.json()
    expect(publicMats.find((m: any) => m.id === materialId)).toBeUndefined()

    // Admin list should include it
    const adminRes = await fetch(`${BASE_URL}/api/materials?all=true`)
    const allMats = await adminRes.json()
    const found = allMats.find((m: any) => m.id === materialId)
    expect(found).toBeDefined()
    expect(found.isActive).toBe(false)
  })
})

describe('System Tests — Gallery Management Flow', () => {
  let itemId: string

  it('Step 1: Admin adds a gallery item', async () => {
    const res = await fetch(`${BASE_URL}/api/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `System Test Gallery ${Date.now()}`,
        imageUrl: '/images/system-test.jpg',
        category: 'System Test',
      }),
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    itemId = data.id
  })

  it('Step 2: Gallery item appears in public listing', async () => {
    const res = await fetch(`${BASE_URL}/api/gallery`)
    const items = await res.json()

    const found = items.find((i: any) => i.id === itemId)
    expect(found).toBeDefined()
  })

  it('Step 3: Admin deletes the gallery item', async () => {
    const res = await fetch(`${BASE_URL}/api/gallery?id=${itemId}`, {
      method: 'DELETE',
    })
    expect(res.status).toBe(200)
  })

  it('Step 4: Deleted item no longer in listing', async () => {
    const res = await fetch(`${BASE_URL}/api/gallery`)
    const items = await res.json()

    expect(items.find((i: any) => i.id === itemId)).toBeUndefined()
  })
})

describe('System Tests — Public Pages Accessibility', () => {
  const publicPages = [
    { path: '/', name: 'Homepage' },
    { path: '/about', name: 'About' },
    { path: '/services', name: 'Services' },
    { path: '/gallery', name: 'Gallery' },
    { path: '/order', name: 'Order' },
    { path: '/contact', name: 'Contact' },
  ]

  publicPages.forEach(({ path, name }) => {
    it(`${name} page (${path}) should return 200`, async () => {
      const res = await fetch(`${BASE_URL}${path}`)
      expect(res.status).toBe(200)
    })
  })

  it('Admin login page should be publicly accessible', async () => {
    const res = await fetch(`${BASE_URL}/admin/login`)
    expect(res.status).toBe(200)
  })

  it('Protected admin routes should redirect without auth', async () => {
    const protectedPaths = ['/admin', '/admin/materials', '/admin/orders', '/admin/gallery']

    for (const path of protectedPaths) {
      const res = await fetch(`${BASE_URL}${path}`, { redirect: 'manual' })
      expect(res.status).toBe(307)
    }
  })
})
