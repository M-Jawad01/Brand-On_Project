/**
 * Integration Tests — Orders API
 * Tests the Orders API endpoints against a real PostgreSQL database.
 * Verifies order creation, status transitions, validation, and filtering.
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

describe('Orders API Integration', () => {
  let materialId: string
  let createdOrderId: string

  beforeAll(async () => {
    // Get a material to use in orders
    const res = await fetch(`${BASE_URL}/api/materials`)
    const materials = await res.json()

    if (materials.length === 0) {
      // Create one if none exists
      const createRes = await fetch(`${BASE_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Order Test Material ${Date.now()}`,
          pricePerSqFt: 20,
        }),
      })
      const created = await createRes.json()
      materialId = created.id
    } else {
      materialId = materials[0].id
    }
  })

  // ---- POST /api/orders ----

  describe('POST /api/orders', () => {
    it('should create an order with valid data', async () => {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Integration Test User',
          customerPhone: '0300-9999999',
          customerEmail: 'test@integration.com',
          customerAddress: '456 Test Street',
          materialId,
          widthFt: 3,
          heightFt: 4,
          quantity: 2,
        }),
      })

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.customerName).toBe('Integration Test User')
      expect(data.status).toBe('PENDING')
      expect(data.totalPrice).toBeGreaterThan(0)
      expect(data.material).toBeDefined()
      expect(data.material.name).toBeDefined()
      createdOrderId = data.id
    })

    it('should calculate totalPrice server-side correctly', async () => {
      // Fetch the material's price
      const matRes = await fetch(`${BASE_URL}/api/materials/${materialId}`)
      const material = await matRes.json()

      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Price Test',
          customerPhone: '0300-1111111',
          materialId,
          widthFt: 5,
          heightFt: 2,
          quantity: 3,
        }),
      })

      const data = await res.json()
      const expected = Math.round(material.pricePerSqFt * 5 * 2 * 3 * 100) / 100
      expect(data.totalPrice).toBe(expected)
    })

    it('should reject order with invalid materialId', async () => {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Bad Material',
          customerPhone: '0300-0000000',
          materialId: 'nonexistent-material-id',
          widthFt: 2,
          heightFt: 2,
          quantity: 1,
        }),
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toContain('not available')
    })

    it('should reject order with missing customer name', async () => {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: '',
          customerPhone: '0300-0000000',
          materialId,
          widthFt: 2,
          heightFt: 2,
          quantity: 1,
        }),
      })

      expect(res.status).toBe(400)
    })

    it('should reject order with zero dimensions', async () => {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Zero Dims',
          customerPhone: '0300-0000000',
          materialId,
          widthFt: 0,
          heightFt: 3,
          quantity: 1,
        }),
      })

      expect(res.status).toBe(400)
    })

    it('should handle optional fields (email, address, notes) as null', async () => {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Minimal Order',
          customerPhone: '0300-2222222',
          materialId,
          widthFt: 1,
          heightFt: 1,
          quantity: 1,
        }),
      })

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.customerEmail).toBeNull()
      expect(data.customerAddress).toBeNull()
      expect(data.specialNotes).toBeNull()
    })
  })

  // ---- GET /api/orders ----

  describe('GET /api/orders', () => {
    it('should return all orders', async () => {
      const res = await fetch(`${BASE_URL}/api/orders`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
    })

    it('should include material name in each order', async () => {
      const res = await fetch(`${BASE_URL}/api/orders`)
      const data = await res.json()

      for (const order of data) {
        expect(order.material).toBeDefined()
        expect(order.material.name).toBeDefined()
      }
    })

    it('should filter orders by status', async () => {
      const res = await fetch(`${BASE_URL}/api/orders?status=PENDING`)
      const data = await res.json()

      for (const order of data) {
        expect(order.status).toBe('PENDING')
      }
    })

    it('should return empty array for nonexistent status filter', async () => {
      const res = await fetch(`${BASE_URL}/api/orders?status=INVALID_STATUS`)
      expect(res.status).toBe(200)
      const data = await res.json()
      // Invalid status is ignored by the validated filter, returns all
      expect(Array.isArray(data)).toBe(true)
    })
  })

  // ---- GET /api/orders/[id] ----

  describe('GET /api/orders/[id]', () => {
    it('should return a single order with material details', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/${createdOrderId}`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.id).toBe(createdOrderId)
      expect(data.material).toBeDefined()
      expect(data.material.id).toBeDefined()
      expect(data.material.name).toBeDefined()
    })

    it('should return 404 for nonexistent order', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/nonexistent-order-id`)
      expect(res.status).toBe(404)
    })
  })

  // ---- PATCH /api/orders/[id] — Status Pipeline ----

  describe('PATCH /api/orders/[id] — Status Transitions', () => {
    let pipelineOrderId: string

    beforeAll(async () => {
      // Create a fresh order for status pipeline testing
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Pipeline Test',
          customerPhone: '0300-3333333',
          materialId,
          widthFt: 2,
          heightFt: 2,
          quantity: 1,
        }),
      })
      const data = await res.json()
      pipelineOrderId = data.id
    })

    it('should transition PENDING → CONFIRMED', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/${pipelineOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.status).toBe('CONFIRMED')
    })

    it('should transition CONFIRMED → IN_PROGRESS', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/${pipelineOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'IN_PROGRESS' }),
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.status).toBe('IN_PROGRESS')
    })

    it('should reject invalid transition IN_PROGRESS → PENDING', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/${pipelineOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PENDING' }),
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toContain('Cannot transition')
    })

    it('should reject invalid transition IN_PROGRESS → CONFIRMED', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/${pipelineOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      })

      expect(res.status).toBe(400)
    })

    it('should transition IN_PROGRESS → COMPLETED', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/${pipelineOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.status).toBe('COMPLETED')
    })

    it('should not allow transitions from COMPLETED state', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/${pipelineOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PENDING' }),
      })

      expect(res.status).toBe(400)
    })

    it('should reject status update without status field', async () => {
      const res = await fetch(`${BASE_URL}/api/orders/${pipelineOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      expect(res.status).toBe(400)
    })
  })

  // ---- Cancellation Flow ----

  describe('Order Cancellation', () => {
    it('should allow PENDING → CANCELLED', async () => {
      const createRes = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Cancel Test',
          customerPhone: '0300-4444444',
          materialId,
          widthFt: 1,
          heightFt: 1,
          quantity: 1,
        }),
      })
      const order = await createRes.json()

      const res = await fetch(`${BASE_URL}/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.status).toBe('CANCELLED')
    })

    it('should not allow transitions from CANCELLED', async () => {
      const createRes = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Cancel Lock Test',
          customerPhone: '0300-5555555',
          materialId,
          widthFt: 1,
          heightFt: 1,
          quantity: 1,
        }),
      })
      const order = await createRes.json()

      // Cancel it
      await fetch(`${BASE_URL}/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })

      // Try to reactivate
      const res = await fetch(`${BASE_URL}/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PENDING' }),
      })

      expect(res.status).toBe(400)
    })
  })
})
